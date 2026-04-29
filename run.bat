@echo off
cd /d %~dp0
setlocal enabledelayedexpansion
echo ==========================================
echo    CORE_OS SECURITY SUITE INITIALIZER
echo ==========================================
echo.

:: 1. Check for Prerequisites with Detailed Messages
echo [SYSTEM CHECK] Verifying environment...

java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java (JRE/JDK) is NOT installed or not in PATH.
    echo Please download and install Java: https://www.oracle.com/java/technologies/downloads/
    goto :error_pause
)

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
echo [1/3] Launching Security Agent...
javac SecurityServer.java
if %errorlevel% neq 0 (
    echo [ERROR] Java compilation failed. Make sure you have the JDK installed.
    goto :error_pause
)
start "CORE_OS_AGENT" cmd /k "java SecurityServer"

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
