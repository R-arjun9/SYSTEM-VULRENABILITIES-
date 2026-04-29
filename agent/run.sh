#!/bin/bash
echo "=========================================="
echo "   CORE_OS SECURITY AGENT (MAC/LINUX)"
echo "=========================================="
echo ""

# Check for Python
if ! command -v python3 &> /dev/null
then
    echo "[ERROR] Python 3 not found! Please install it."
    exit
fi

# Install Dependencies
echo "[1/3] Synchronizing Python dependencies (psutil)..."
pip3 install psutil --quiet

# Compile Java
echo "[2/3] Compiling Java Security Bridge..."
javac SecurityServer.java
if [ $? -ne 0 ]; then
    echo "[ERROR] Java compiler failed! Please install JDK."
    exit
fi

# Start Server
echo "[3/3] Launching Security Node..."
echo ""
echo ">>> AGENT ACTIVE! KEEP THIS WINDOW OPEN."
echo ">>> GO TO: https://R-arjun9.github.io/SYSTEM-VULRENABILITIES-/"
echo ""
java SecurityServer
