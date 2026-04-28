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
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        
        server.createContext("/api/scan", new ScanHandler());
        server.createContext("/api/taskmgr", new TaskMgrHandler());
        
        server.setExecutor(null); // creates a default executor
        System.out.println("Starting Java SecurityServer on port " + port);
        server.start();
    }

    static class ScanHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {
            // Add CORS headers
            t.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            t.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, OPTIONS");
            t.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
            
            if ("OPTIONS".equals(t.getRequestMethod())) {
                t.sendResponseHeaders(204, -1);
                return;
            }

            StringBuilder output = new StringBuilder();
            try {
                // Execute the Python script
                Process process = Runtime.getRuntime().exec("python scanner.py");
                BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
                process.waitFor();
            } catch (Exception e) {
                e.printStackTrace();
                String errorMsg = e.getMessage() != null ? e.getMessage().replace("\"", "\\\"") : "Unknown error";
                String error = "{\"error\": \"Failed to run scanner: " + errorMsg + "\"}";
                t.sendResponseHeaders(500, error.length());
                OutputStream os = t.getResponseBody();
                os.write(error.getBytes());
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

    static class TaskMgrHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {
            t.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            t.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, OPTIONS");
            t.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
            
            if ("OPTIONS".equals(t.getRequestMethod())) {
                t.sendResponseHeaders(204, -1);
                return;
            }

            StringBuilder output = new StringBuilder();
            try {
                Process process = Runtime.getRuntime().exec("python taskmgr.py");
                BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
                process.waitFor();
            } catch (Exception e) {
                e.printStackTrace();
                String errorMsg = e.getMessage() != null ? e.getMessage().replace("\"", "\\\"") : "Unknown error";
                String error = "{\"error\": \"Failed to run taskmgr: " + errorMsg + "\"}";
                t.sendResponseHeaders(500, error.length());
                OutputStream os = t.getResponseBody();
                os.write(error.getBytes());
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
