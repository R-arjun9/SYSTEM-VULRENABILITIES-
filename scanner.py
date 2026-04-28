import json
import subprocess
import winreg
import platform
import os

def check_registry_key(hive, subkey, value_name):
    try:
        key = winreg.OpenKey(hive, subkey, 0, winreg.KEY_READ)
        value, _ = winreg.QueryValueEx(key, value_name)
        winreg.CloseKey(key)
        return value
    except FileNotFoundError:
        return None
    except Exception as e:
        return None

def check_dep():
    # Check Data Execution Prevention policy using powershell
    try:
        output = subprocess.check_output('powershell -Command "Get-CimInstance Win32_OperatingSystem | Select-Object -ExpandProperty DataExecutionPrevention_SupportPolicy"', shell=True, text=True)
        policy_str = output.strip()
        if policy_str.isdigit():
            policy = int(policy_str)
            # 0 = AlwaysOff, 1 = OptIn, 2 = OptOut, 3 = AlwaysOn
            if policy in [0, 1]:
                return {
                    "type": "Buffer Overflow Risk",
                    "severity": "High",
                    "details": f"DEP policy is set to {policy} (Not strictly enforced system-wide).",
                    "mitigation": "Set DEP to OptOut (2) or AlwaysOn (3) using System Properties -> Advanced -> Performance."
                }
    except Exception:
        pass
    return None

def check_always_install_elevated():
    # Privilege escalation check
    hkcu_val = check_registry_key(winreg.HKEY_CURRENT_USER, r"SOFTWARE\Policies\Microsoft\Windows\Installer", "AlwaysInstallElevated")
    hklm_val = check_registry_key(winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\Policies\Microsoft\Windows\Installer", "AlwaysInstallElevated")
    
    if hkcu_val == 1 and hklm_val == 1:
        return {
            "type": "Privilege Escalation Risk",
            "severity": "Critical",
            "details": "AlwaysInstallElevated is enabled in registry. Any user can install MSI packages with SYSTEM privileges.",
            "mitigation": "Disable AlwaysInstallElevated in Group Policy or delete the registry keys in HKCU and HKLM."
        }
    return None

def check_suspicious_processes():
    # Simple malware activity check: processes running from Temp folders
    suspicious = []
    try:
        output = subprocess.check_output('powershell -Command "Get-Process | Select-Object -Property Path | Where-Object Path -Like \'*Temp*\' | Select-Object -ExpandProperty Path"', shell=True, text=True)
        paths = output.strip().split("\n")
        for path in paths:
            path = path.strip()
            if path:
                name = os.path.basename(path)
                if name.lower() not in suspicious:
                    suspicious.append(name)
    except Exception:
        pass
    
    if suspicious:
        return {
            "type": "Potential Malware Activity",
            "severity": "Medium",
            "details": f"Found {len(suspicious)} process(es) running from temporary directories: {', '.join(suspicious[:3])}{'...' if len(suspicious)>3 else ''}.",
            "mitigation": "Investigate these processes. If unauthorized, terminate them and run a full antivirus scan."
        }
    return None

def check_uac_settings():
    # Check UAC Prompt on Secure Desktop
    val = check_registry_key(winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System", "PromptOnSecureDesktop")
    if val == 0:
         return {
            "type": "Privilege Escalation Risk",
            "severity": "Medium",
            "details": "UAC Prompt on Secure Desktop is disabled. Malware can potentially spoof or bypass the UAC prompt.",
            "mitigation": "Enable 'PromptOnSecureDesktop' via Group Policy or Registry (set to 1)."
        }
    return None

def check_defender_status():
    try:
        output = subprocess.check_output('powershell -Command "(Get-MpComputerStatus).RealTimeProtectionEnabled"', shell=True, text=True)
        if 'False' in output.strip() or '0' in output.strip():
            return {
                "type": "Antivirus Protection Disabled",
                "severity": "Critical",
                "details": "Windows Defender Real-Time Protection is currently disabled.",
                "mitigation": "Enable Real-Time Protection in Windows Security settings immediately."
            }
    except Exception:
        pass
    return None

def check_rdp_status():
    val = check_registry_key(winreg.HKEY_LOCAL_MACHINE, r"System\CurrentControlSet\Control\Terminal Server", "fDenyTSConnections")
    if val == 0:
        return {
            "type": "Remote Desktop Enabled",
            "severity": "Low",
            "details": "Remote Desktop Protocol (RDP) is enabled. If not required, this increases the attack surface.",
            "mitigation": "Disable Remote Desktop if not in use via System Properties -> Remote."
        }
    return None

def check_firewall_status():
    profiles = ["DomainProfile", "StandardProfile", "PublicProfile"]
    disabled_profiles = []
    for profile in profiles:
        val = check_registry_key(winreg.HKEY_LOCAL_MACHINE, rf"SYSTEM\CurrentControlSet\Services\SharedAccess\Parameters\FirewallPolicy\{profile}", "EnableFirewall")
        if val == 0:
            disabled_profiles.append(profile.replace("Profile", ""))
            
    if disabled_profiles:
        return {
            "type": "Firewall Disabled",
            "severity": "High",
            "details": f"Windows Firewall is disabled for: {', '.join(disabled_profiles)}.",
            "mitigation": "Enable Windows Firewall for all profiles."
        }
    return None

def run_scan():
    vulnerabilities = []
    
    dep_risk = check_dep()
    if dep_risk:
        vulnerabilities.append(dep_risk)
        
    priv_escalation = check_always_install_elevated()
    if priv_escalation:
        vulnerabilities.append(priv_escalation)
        
    uac_risk = check_uac_settings()
    if uac_risk:
        vulnerabilities.append(uac_risk)
        
    malware_risk = check_suspicious_processes()
    if malware_risk:
        vulnerabilities.append(malware_risk)
        
    defender_risk = check_defender_status()
    if defender_risk:
        vulnerabilities.append(defender_risk)
        
    rdp_risk = check_rdp_status()
    if rdp_risk:
        vulnerabilities.append(rdp_risk)
        
    firewall_risk = check_firewall_status()
    if firewall_risk:
        vulnerabilities.append(firewall_risk)

    # Base score 100, minus severity points
    score = 100
    for v in vulnerabilities:
        if v['severity'] == 'Critical': score -= 40
        elif v['severity'] == 'High': score -= 25
        elif v['severity'] == 'Medium': score -= 10
        elif v['severity'] == 'Low': score -= 5
        
    if score < 0:
        score = 0

    result = {
        "system_info": {
            "os": platform.system(),
            "release": platform.release(),
            "architecture": platform.machine()
        },
        "health_score": score,
        "vulnerabilities": vulnerabilities
    }
    
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    run_scan()
