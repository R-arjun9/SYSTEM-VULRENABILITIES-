@echo off
cd /d %~dp0
setlocal
echo ==========================================
echo    CORE_OS SECURITY SUITE INITIALIZER
echo ==========================================
echo.

:: 1. Check for Prerequisites
javac -version >nul 2>&1 || (echo [ERROR] Java JDK not found! && pause && exit /b)
python --version >nul 2>&1 || (echo [ERROR] Python not found! && pause && exit /b)
npm -v >nul 2>&1 || (echo [ERROR] NodeJS/NPM not found! && pause && exit /b)

:: 2. Launch Backend in Background
echo [1/3] Launching Security Agent...
start "CORE_OS_AGENT" cmd /c "javac SecurityServer.java && java SecurityServer"

:: 3. Setup and Run Frontend
echo [2/3] Initializing Dashboard...
cd frontend
if not exist "node_modules" (
    echo [INFO] First time setup: Installing libraries...
    call npm install --quiet
)

echo [3/3] System Online! Opening Dashboard...
echo.
start http://localhost:5173/SYSTEM-VULRENABILITIES-/
npm run dev

pause
