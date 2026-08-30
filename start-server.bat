@echo off
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  start "NUTT Server" cmd /k "py -m http.server 8000"
  timeout /t 2 >nul
  start "" "http://localhost:8000/"
  exit /b
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "NUTT Server" cmd /k "python -m http.server 8000"
  timeout /t 2 >nul
  start "" "http://localhost:8000/"
  exit /b
)
echo Python is not installed. Install Python 3, then run this file again.
pause
