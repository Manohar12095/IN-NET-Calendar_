@echo off
setlocal EnableExtensions
title IN NET Calendar

rem Always run from this .bat file's folder, even if the path contains [brackets].
cd /d "%~dp0"

set "APP_DIR=%~dp0innet-calendar"
if not exist "%APP_DIR%\package.json" (
  echo Could not find the app at:
  echo   %APP_DIR%
  echo.
  pause
  exit /b 1
)

rem Make Node available if it was installed but this window's PATH is stale.
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

cd /d "%APP_DIR%"

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

rem Open the browser shortly after the server starts.
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"

call npm run dev
echo.
pause
