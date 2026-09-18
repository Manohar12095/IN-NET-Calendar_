@echo off
setlocal EnableExtensions

title IN NET Calendar

set "APP_DIR=%~dp0innet-calendar"
if not exist "%APP_DIR%\package.json" (
  echo ERROR: Could not find innet-calendar at:
  echo   %APP_DIR%
  pause
  exit /b 1
)

cd /d "%APP_DIR%"

where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js is not installed or not on PATH.
  echo Install Node.js LTS from https://nodejs.org/
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo ERROR: npm install failed.
    pause
    exit /b 1
  )
)

if not exist ".env.local" (
  if exist ".env.example" (
    echo Creating .env.local from .env.example...
    copy /Y ".env.example" ".env.local" >nul
    echo Edit .env.local with your Supabase keys, then run this file again.
    pause
    exit /b 1
  )
  echo ERROR: Missing .env.local. Add your Supabase keys first.
  pause
  exit /b 1
)

echo Freeing port 3000 if another dev server is running...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
  taskkill /F /PID %%a >nul 2>&1
)

echo.
echo ========================================
echo   IN NET Calendar - powered by IN NET CREATIONS
echo ========================================
echo.
echo Starting at http://localhost:3000
echo Press Ctrl+C to stop.
echo.

start "" "http://localhost:3000"
call npm run dev

pause
