@echo off
cd /d %~dp0
setlocal
echo ==========================================
echo    CORE_OS SECURITY AGENT INITIALIZER
echo ==========================================
echo.

:: Check if running inside a ZIP (Temporary folder)
echo %CD% | findstr /I "Temp" >nul
if %errorlevel% equ 0 (
    echo [CRITICAL ERROR] You are running this from inside a ZIP file!
    echo Please "Extract All" files to a normal folder before running.
    pause
    exit /b
)

:: Check if files exist
if not exist "SecurityServer.java" (
    echo [CRITICAL ERROR] Missing 'SecurityServer.java' in this folder!
    echo Please ensure all files from the Agent folder are in the same place.
    pause
    exit /b
)

:: Check for Java Compiler
javac -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java Compiler (javac) not found! 
    echo Please install the Java Development Kit (JDK).
    echo Download: https://www.oracle.com/java/technologies/downloads/
    pause
    exit /b
)

:: Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found! 
    echo Please install Python 3 and add it to your PATH.
    echo Download: https://www.python.org/downloads/
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
    echo [ERROR] Compilation failed. Check your Java version.
    pause
    exit /b
)

:: Start Server
echo [3/3] Launching Security Node...
echo.
echo >>> AGENT ACTIVE! KEEP THIS WINDOW OPEN.
echo >>> GO TO: https://R-arjun9.github.io/SYSTEM-VULRENABILITIES-/
echo.
java SecurityServer
pause
