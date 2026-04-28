# 🛡️ SYSTEM-VULNERABILITIES: Professional OS Security Command Center

An advanced, full-stack Operating System Auditing Dashboard designed for real-time threat detection, process management, and educational security simulations. Built with a futuristic "All-Time Blue" aesthetic, this project provides deep insights into Windows-based system vulnerabilities.

![Project Preview](https://img.shields.io/badge/Theme-All--Time%20Blue-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Tech-Full--Stack-00599C?style=for-the-badge)

## 🚀 Key Features

### 1. **Heuristic Vulnerability Scanner**
- Performs deep-system audits of Registry Hives, DEP/ASLR policies, and UAC configurations.
- Real-time terminal log feed demonstrating the step-by-step detection process.
- Progressive "Scan Matrix" visualization for heuristic analysis.

### 2. **AI OS Intelligence Assistant**
- An integrated AI Chatbot powered by a custom OS knowledge base.
- Capable of explaining complex concepts like Deadlocks, Memory Segmentation, and Buffer Overflows.

### 3. **Professional Task Manager**
- Real-time monitoring of system processes with CPU/RAM metrics.
- Advanced search and filtering capabilities for system threads.

### 4. **Interactive Security Sandbox**
- **Buffer Overflow Synthesis:** Visualize stack memory corruption and return address hijacking.
- **Privilege Escalation Vector:** Demonstration of `AlwaysInstallElevated` registry exploits.
- **Malware Activity Analysis:** Visualization of cross-process code injection.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, Tailwind CSS (Custom "All-Time Blue" Theme)
- **Backend:** Java (Security API Server)
- **Auditing Engine:** Python 3 (System Registry & PowerShell Integration)
- **Icons & UI:** Lucide React, Glassmorphism UI Principles

---

## 📥 Installation & Setup

To run this project on your local machine, follow these steps:

### Prerequisites
- [Java JDK 17+](https://www.oracle.com/java/technologies/downloads/)
- [Python 3.x](https://www.python.org/downloads/)
- [Node.js & npm](https://nodejs.org/)

### 1. Clone the Repository
```bash
git clone https://github.com/R-arjun9/SYSTEM-VULRENABILITIES-.git
cd SYSTEM-VULRENABILITIES-
```

### 2. Start the Backend (Java)
Open a terminal in the root directory:
```bash
javac SecurityServer.java
java SecurityServer
```
*Note: The server will start on `http://localhost:8080`.*

### 3. Start the Frontend (React)
Open a new terminal in the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
*The dashboard will be available at `http://localhost:5173`.*

---

## 📖 How it Works
This tool interacts directly with the **Host Operating System** to perform its audit:
- The **Java Server** acts as a bridge between the React frontend and the system scripts.
- The **Python Engine** executes PowerShell commands and queries the Windows Registry (`winreg`) to identify misconfigurations.
- The **React Frontend** visualizes this data using a deterministic state machine for educational clarity.

---

## 🛡️ Educational Disclaimer
This project is developed for **educational and auditing purposes only**. It is designed to help students and security enthusiasts understand OS internals and common vulnerability vectors.

---

**Developed by [R-arjun9](https://github.com/R-arjun9)**
