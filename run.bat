@echo off
echo ==========================================
echo    CORE_OS SECURITY AGENT INITIALIZER
echo ==========================================
echo.

:: Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found! Please install Python 3.
    pause
    exit /b
)

:: Install Dependencies
echo [1/3] Synchronizing Python dependencies (psutil)...
pip install psutil --quiet

:: Compile Java
echo [2/3] Compiling Java Security Bridge...
javac SecurityServer.java
if %errorlevel% neq 0 (
    echo [ERROR] Java compiler failed! Please install JDK.
    pause
    exit /b
)

:: Start Server
echo [3/3] Launching Security Node on Port 8080...
echo.
echo >>> AGENT ACTIVE! KEEP THIS WINDOW OPEN.
echo >>> GO TO: https://R-arjun9.github.io/SYSTEM-VULRENABILITIES-/
echo.
java SecurityServer
pause
