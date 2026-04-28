import psutil
import json
import time

def get_taskmgr_data():
    try:
        # Get overall stats
        # Using a small interval to get a quick CPU percentage reading
        cpu_percent = psutil.cpu_percent(interval=0.5)
        memory = psutil.virtual_memory()
        
        processes = []
        # Iterate over all running processes
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
            try:
                # Get process info dictionary
                pinfo = proc.info
                if pinfo['cpu_percent'] is None:
                    pinfo['cpu_percent'] = 0.0
                if pinfo['memory_percent'] is None:
                    pinfo['memory_percent'] = 0.0
                processes.append(pinfo)
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass
                
        # Sort by Memory or CPU usage and get top 20
        # Sorting by memory is often more stable, but CPU is good too. Let's do CPU then Memory.
        processes = sorted(processes, key=lambda p: (p['cpu_percent'], p['memory_percent']), reverse=True)[:20]
        
        data = {
            "cpu_usage": cpu_percent,
            "memory_usage": memory.percent,
            "total_memory": memory.total,
            "used_memory": memory.used,
            "processes": processes
        }
        print(json.dumps(data))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    get_taskmgr_data()
