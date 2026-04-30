@echo off
cd /d %~dp0
setlocal enabledelayedexpansion
echo ==========================================
echo    CORE_OS SECURITY SUITE INITIALIZER
echo ==========================================
echo.

:: 1. Check for Prerequisites with Detailed Messages
echo [SYSTEM CHECK] Verifying environment...

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is NOT installed or not in PATH.
    echo Please download and install Python: https://www.python.org/downloads/
    goto :error_pause
)

npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] NodeJS/NPM is NOT installed or not in PATH.
    echo Please download and install NodeJS: https://nodejs.org/
    goto :error_pause
)

:: 2. Launch Backend
echo [1/3] Launching Security Agent (Python)...
echo [INFO] Ensuring Python dependencies are installed...
python -m pip install -r requirements.txt --quiet
if %errorlevel% neq 0 (
    echo [WARNING] Could not install requirements automatically.
    echo Please run: pip install flask flask-cors psutil
)
start "CORE_OS_AGENT" cmd /k "python security_server.py"

:: 3. Setup and Run Frontend
echo [2/3] Initializing Dashboard...
if not exist "frontend" (
    echo [ERROR] 'frontend' folder not found in %CD%
    goto :error_pause
)

cd frontend
if not exist "node_modules" (
    echo [INFO] First time setup: Installing libraries (this may take a minute)...
    call npm install
)

echo [3/3] System Online! Opening Dashboard...
echo.
start http://localhost:5173/SYSTEM-VULRENABILITIES-/
npm run dev

goto :end

:error_pause
echo.
echo ------------------------------------------
echo CRITICAL ERROR DETECTED. Window will stay open for diagnosis.
echo ------------------------------------------
pause
exit /b

:end
pause
