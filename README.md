# Faizah Binte Naquib — Portfolio

A responsive, editorial-style portfolio for Faizah’s applied machine-learning work across OCR, computer vision, autonomous-system perception, evaluation, simulation, and edge inference.

## Structure

- Professional positioning and current focus
- Evidence-led case studies with scoped results and limitations
- Experience and education timeline
- Publications and recognition
- Independent project archive
- Skills grouped by working context
- Interactive OCR and optional text-refinement demo
- Printable résumé source (`Faizah_Binte_Naquib_Resume.html`) and downloadable PDF (`Faizah_Binte_Naquib_Resume.pdf`)

Portfolio facts and public-claim boundaries are maintained in `Faizah_Master_Career_Reference_for_Portfolio.md`.

## Local preview

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

The site is buildless HTML, CSS, and JavaScript. The OCR demo attempts a hosted PaddleOCR service, uses Tesseract.js as a browser fallback, and labels local text formatting separately from model-backed refinement.

## Deployment

This repository can be published directly with GitHub Pages from the repository root.
