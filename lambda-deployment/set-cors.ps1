# Set CORS on your Lambda Function URL
# 1. Install AWS CLI: https://aws.amazon.com/cli/ (or: winget install Amazon.AWSCLI)
# 2. Run: aws configure   (enter your Access Key + Secret + region us-east-2)
# 3. Edit the line below: set $FUNCTION_NAME to your Lambda function name
# 4. Run this script: .\set-cors.ps1

$FUNCTION_NAME = "website_ocr_demo"   # <-- Change this to your Lambda function name
$REGION = "us-east-2"

if ($FUNCTION_NAME -eq "YOUR_FUNCTION_NAME") {
    Write-Host "Edit this script and set FUNCTION_NAME to your Lambda function name." -ForegroundColor Yellow
    Write-Host "Find it in: AWS Console -> Lambda -> your function -> name at the top" -ForegroundColor Gray
    exit 1
}

# Use "*" for methods (AWS limits each method string to 6 chars, so "OPTIONS" would fail)
$corsJson = '{"AllowOrigins":["*"],"AllowMethods":["*"],"AllowHeaders":["*"]}'
$tempPath = Join-Path $env:TEMP "cors-lambda.json"
[System.IO.File]::WriteAllText($tempPath, $corsJson)
$corsUri = "file://" + $tempPath.Replace("\", "/")

Write-Host "Setting CORS for function: $FUNCTION_NAME (region: $REGION)" -ForegroundColor Cyan
aws lambda update-function-url-config `
    --function-name $FUNCTION_NAME `
    --region $REGION `
    --cors $corsUri

if ($LASTEXITCODE -eq 0) {
    Write-Host "Done. Reload http://localhost:8080 and try the demo again." -ForegroundColor Green
} else {
    Write-Host "Failed. Is AWS CLI installed and configured? Run: aws configure" -ForegroundColor Red
}
