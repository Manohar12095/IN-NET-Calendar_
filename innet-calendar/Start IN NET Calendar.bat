@echo off
setlocal EnableExtensions
title IN NET Calendar

cd /d "%~dp0"

if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;%PATH%"
if exist "%ProgramFiles(x86)%\nodejs\node.exe" set "PATH=%ProgramFiles(x86)%\nodejs;%PATH%"
if exist "%LocalAppData%\Programs\nodejs\node.exe" set "PATH=%LocalAppData%\Programs\nodejs;%PATH%"

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is not installed or not on PATH.
  echo Install the LTS build from https://nodejs.org then run this file again.
  echo.
  pause
  exit /b 1
)

if not exist ".env.local" (
  if exist ".env.example" copy /y ".env.example" ".env.local" >nul
)

if not exist "node_modules\" (
  echo Installing dependencies. This can take a minute the first time...
  call npm install
  if errorlevel 1 (
    echo npm install failed.
    pause
    exit /b 1
  )
)

echo.
echo Starting IN NET Calendar at http://localhost:3000
echo Close this window to stop the server.
echo.

start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"
call npm run dev
echo.
pause
