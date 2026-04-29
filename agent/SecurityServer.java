import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.net.InetSocketAddress;

public class SecurityServer {

    public static void main(String[] args) throws Exception {
        int port = 8080;
        HttpServer server = null;
        
        try {
            server = HttpServer.create(new InetSocketAddress(port), 0);
        } catch (java.net.BindException e) {
            System.out.println("Port 8080 is busy, trying fallback port 8081...");
            port = 8081;
            server = HttpServer.create(new InetSocketAddress(port), 0);
        }
        
        server.createContext("/api/scan", new ScanHandler());
        server.createContext("/api/taskmgr", new TaskMgrHandler());
        
        server.setExecutor(null); 
        System.out.println("Starting Java SecurityServer on port " + port);
        server.start();
    }

    static class ScanHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {
            System.out.println("DEBUG: Received Scan Request from " + t.getRemoteAddress());
            t.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            t.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, OPTIONS");
            t.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
            
            if ("OPTIONS".equals(t.getRequestMethod())) {
                t.sendResponseHeaders(204, -1);
                return;
            }

            StringBuilder output = new StringBuilder();
            try {
                // Try 'python' first, then 'python3'
                Process process;
                try {
                    process = Runtime.getRuntime().exec("python scanner.py");
                } catch (Exception e) {
                    process = Runtime.getRuntime().exec("python3 scanner.py");
                }
                
                BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
                BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
                
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
                
                StringBuilder errorOutput = new StringBuilder();
                while ((line = errorReader.readLine()) != null) {
                    errorOutput.append(line).append("\n");
                }
                
                process.waitFor();
                
                if (output.length() == 0 && errorOutput.length() > 0) {
                    throw new Exception("Python Error: " + errorOutput.toString());
                }
            } catch (Exception e) {
                System.err.println("ERROR: " + e.getMessage());
                String response = "{\"error\": \"" + e.getMessage().replace("\"", "'").replace("\n", " ") + "\"}";
                t.getResponseHeaders().add("Content-Type", "application/json");
                t.sendResponseHeaders(500, response.length());
                OutputStream os = t.getResponseBody();
                os.write(response.getBytes());
                os.close();
                return;
            }

            String response = output.toString();
            System.out.println("DEBUG: Scan successful. Sending results.");
            t.getResponseHeaders().add("Content-Type", "application/json");
            t.sendResponseHeaders(200, response.length());
            OutputStream os = t.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }
    }

    static class TaskMgrHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {
            System.out.println("DEBUG: Received TaskMgr Request from " + t.getRemoteAddress());
            t.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            t.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, OPTIONS");
            t.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
            
            if ("OPTIONS".equals(t.getRequestMethod())) {
                t.sendResponseHeaders(204, -1);
                return;
            }

            StringBuilder output = new StringBuilder();
            try {
                Process process;
                try {
                    process = Runtime.getRuntime().exec("python taskmgr.py");
                } catch (Exception e) {
                    process = Runtime.getRuntime().exec("python3 taskmgr.py");
                }
                
                BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
                BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
                
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
                
                StringBuilder errorOutput = new StringBuilder();
                while ((line = errorReader.readLine()) != null) {
                    errorOutput.append(line).append("\n");
                }
                
                process.waitFor();

                if (output.length() == 0 && errorOutput.length() > 0) {
                    throw new Exception("Python Error: " + errorOutput.toString());
                }
            } catch (Exception e) {
                System.err.println("ERROR: " + e.getMessage());
                String response = "{\"error\": \"" + e.getMessage().replace("\"", "'").replace("\n", " ") + "\"}";
                t.getResponseHeaders().add("Content-Type", "application/json");
                t.sendResponseHeaders(500, response.length());
                OutputStream os = t.getResponseBody();
                os.write(response.getBytes());
                os.close();
                return;
            }

            String response = output.toString();
            t.getResponseHeaders().add("Content-Type", "application/json");
            t.sendResponseHeaders(200, response.length());
            OutputStream os = t.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }
    }
}
