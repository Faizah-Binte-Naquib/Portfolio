"""
AWS Lambda Function for Llama 3.1 Text Refinement

Uses Hugging Face Router API via plain HTTP (no openai package = no layer needed).
Fixes: Runtime.ImportModuleError (pydantic_core) and CORS.

Requirements: Python 3.9+ (standard library only)
Environment Variables: HF_TOKEN (required), MODEL_NAME (optional)
HF_TOKEN: Create at https://huggingface.co/settings/tokens — use a *fine-grained* token
         with "Make calls to Inference Providers" (or similar) for router.huggingface.co.
"""

import json
import os
import re
import urllib.request
import urllib.error

# Model name - set via env or default. 8B is fast/cheap but often skips simple typos (teh→the).
# For better correction, set MODEL_NAME in Lambda env to a larger model, e.g.:
#   meta-llama/Llama-3.1-70B-Instruct:novita   (slower, better at following instructions)
#   meta-llama/Llama-3.1-8B-Instruct:novita    (default, fast)
MODEL_NAME = os.environ.get('MODEL_NAME', 'meta-llama/Llama-3.1-8B-Instruct:novita')

# Response headers: Content-Type only. CORS is handled by the Function URL config
# so we don't send Access-Control-* here (avoid "multiple values" error).
RESPONSE_HEADERS = {'Content-Type': 'application/json'}


def lambda_handler(event, context):
    # Handle preflight OPTIONS (Function URL also handles this; minimal response here)
    http_method = event.get('requestContext', {}).get('http', {}).get('method', '')
    if http_method == 'OPTIONS' or event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': RESPONSE_HEADERS, 'body': ''}

    try:
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        elif event.get('body'):
            body = event['body'] if isinstance(event['body'], dict) else json.loads(event['body'])
        else:
            body = event

        text = body.get('text', '')
        task = body.get('task', 'refine')

        if not text:
            return {
                'statusCode': 400,
                'headers': RESPONSE_HEADERS,
                'body': json.dumps({'error': 'No text provided', 'refined_text': ''}),
            }

        # Obvious health check: no HF call, instant proof Lambda is running
        ping = text.strip().lower()
        if ping in ('ping', 'test', 'hello lambda'):
            return {
                'statusCode': 200,
                'headers': RESPONSE_HEADERS,
                'body': json.dumps({
                    'refined_text': 'Lambda is working! You sent: "' + text.strip() + '".',
                    'original_text': text,
                    'model': 'ping',
                }),
            }

        refined_text = refine_text_with_llama(text) if task == 'refine' else text

        return {
            'statusCode': 200,
            'headers': RESPONSE_HEADERS,
            'body': json.dumps({
                'refined_text': refined_text,
                'original_text': text,
                'model': MODEL_NAME,
            }),
        }
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': RESPONSE_HEADERS,
            'body': json.dumps({'error': str(e), 'refined_text': ''}),
        }


def refine_text_with_llama(text):
    """Call Hugging Face Router API (OpenAI-compatible) using urllib only."""
    token = os.environ.get('HF_TOKEN')
    if not token:
        print("HF_TOKEN not set")
        return simple_refinement(text)

    # Prompt asks for teh→the etc.; 8B often ignores it, so we also run _fix_common_typos() on the result
    prompt = f"""Fix the text below. It came from OCR/handwriting, so words are often wrong or incomplete. You MUST replace every wrong or incomplete word with the correct full English word. Never leave typos or fragments.

Correct: cav → canvas, betar → better, helo → hello, persn → person, 9s → is, teh → the, recieve → receive, ths → this, wrog → wrong. If a word is clearly a broken or partial word, replace it with the obvious full word.

Output ONLY the corrected sentence(s). No explanation. No quotes around the whole thing. Just the fixed text.

Input:
{text}"""

    url = 'https://router.huggingface.co/v1/chat/completions'
    data = json.dumps({
        'model': MODEL_NAME,
        'messages': [{'role': 'user', 'content': prompt}],
        'max_tokens': 500,
        'temperature': 0.1,
        'top_p': 0.95,
    }).encode('utf-8')

    req = urllib.request.Request(
        url,
        data=data,
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {token}',
        },
        method='POST',
    )

    try:
        print(f"[HF] Calling API model={MODEL_NAME}")
        with urllib.request.urlopen(req, timeout=60) as resp:
            raw = resp.read().decode()
            print(f"[HF] Response length: {len(raw)}")
            out = json.loads(raw)
        if "error" in out:
            print(f"[HF] API returned error: {out.get('error')}")
            return simple_refinement(text)
        content = (out.get('choices') or [{}])[0].get('message', {}).get('content', '')
        refined = (content or text).strip()
        print(f"[HF] OK refined length={len(refined)}")
        return _fix_common_typos(refined)
    except urllib.error.HTTPError as e:
        body = ""
        try:
            if e.fp:
                body = e.fp.read().decode()[:800]
        except Exception:
            pass
        print(f"[HF] HTTPError {e.code} {e.reason}: {body}")
        return simple_refinement(text)
    except urllib.error.URLError as e:
        print(f"[HF] URLError: {e.reason}")
        return simple_refinement(text)
    except Exception as e:
        import traceback
        print(f"[HF] Exception {type(e).__name__}: {e}")
        print(traceback.format_exc())
        return simple_refinement(text)


def _fix_common_typos(s):
    """Fix common OCR/typos Llama sometimes leaves unchanged (e.g. Teh -> The)."""
    if not s:
        return s
    fixes = [
        (r'\bTeh\b', 'The'),
        (r'\bteh\b', 'the'),
        (r'\bths\b', 'this'),
        (r'\bThs\b', 'This'),
        (r'\bcav\b', 'canvas'),
        (r'\bCav\b', 'Canvas'),
        (r'\bhelo\b', 'hello'),
        (r'\bHelo\b', 'Hello'),
        (r'\bpersn\b', 'person'),
        (r'\bbetar\b', 'better'),
        (r'\bBetar\b', 'Better'),
        (r'\bwrog\b', 'wrong'),
        (r'\bWrog\b', 'Wrong'),
        (r'\b(9s|1s)\b', 'is'),
        (r'\brecieve\b', 'receive'),
    ]
    for pattern, repl in fixes:
        s = re.sub(pattern, repl, s)
    return s


def simple_refinement(text):
    refined = text.strip()
    if refined:
        refined = (refined[0].upper() + refined[1:]) if len(refined) > 1 else refined.upper()
    if refined and refined[-1] not in '.!?':
        refined += '.'
    return refined
