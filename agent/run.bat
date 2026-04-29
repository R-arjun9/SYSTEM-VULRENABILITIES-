@echo off
setlocal
echo ==========================================
echo    CORE_OS SECURITY AGENT INITIALIZER
echo ==========================================
echo.

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

:: Start Server
echo [3/3] Launching Security Node...
echo.
echo >>> AGENT ACTIVE! KEEP THIS WINDOW OPEN.
echo >>> GO TO: https://R-arjun9.github.io/SYSTEM-VULRENABILITIES-/
echo.
java SecurityServer
pause
