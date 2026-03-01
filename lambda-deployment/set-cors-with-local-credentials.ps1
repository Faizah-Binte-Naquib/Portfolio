# Run CORS update using keys from aws-credentials.local.txt
# 1. Copy aws-credentials.local.txt.example to aws-credentials.local.txt
# 2. Open aws-credentials.local.txt and paste line 1 = Access Key ID, line 2 = Secret Access Key (delete the example lines)
# 3. Run this script (or double-click run-set-cors-with-credentials.bat)

$FUNCTION_NAME = "website_ocr_demo"
$REGION = "us-east-2"

$credFile = Join-Path $PSScriptRoot "aws-credentials.local.txt"
if (-not (Test-Path $credFile)) {
    Write-Host "Missing: aws-credentials.local.txt" -ForegroundColor Red
    Write-Host "Copy aws-credentials.local.txt.example to aws-credentials.local.txt and add your Access Key ID and Secret (one per line)." -ForegroundColor Yellow
    exit 1
}

$lines = Get-Content $credFile | Where-Object { $_.Trim() -and -not $_.StartsWith("#") }
if ($lines.Count -lt 2) {
    Write-Host "aws-credentials.local.txt must have 2 lines: Access Key ID, then Secret Access Key." -ForegroundColor Red
    exit 1
}

$env:AWS_ACCESS_KEY_ID = $lines[0].Trim()
$env:AWS_SECRET_ACCESS_KEY = $lines[1].Trim()
$env:AWS_DEFAULT_REGION = $REGION

# Use "*" for methods so OPTIONS is allowed (AWS limits each method name to 6 chars, so "OPTIONS" fails)
$corsJson = '{"AllowOrigins":["*"],"AllowMethods":["*"],"AllowHeaders":["*"]}'
$tempPath = Join-Path $env:TEMP "cors-lambda.json"
[System.IO.File]::WriteAllText($tempPath, $corsJson)
$corsUri = "file://" + $tempPath.Replace("\", "/")

Write-Host "Setting CORS for function: $FUNCTION_NAME (region: $REGION) using credentials from aws-credentials.local.txt" -ForegroundColor Cyan
aws lambda update-function-url-config --function-name $FUNCTION_NAME --region $REGION --cors $corsUri

if ($LASTEXITCODE -eq 0) {
    Write-Host "Done. Reload http://localhost:8080 and try the demo again." -ForegroundColor Green
} else {
    Write-Host "Failed. Check that the two lines in aws-credentials.local.txt are correct (Access Key ID, then Secret)." -ForegroundColor Red
}

# Clear from environment after use
$env:AWS_ACCESS_KEY_ID = $null
$env:AWS_SECRET_ACCESS_KEY = $null
