#pragma once

#include <WinSock2.h>
#include <ws2tcpip.h>
#include <string>
#include <fstream>
#include <sstream>
#include <iostream>

#pragma comment(lib, "ws2_32.lib")

class SocketHelper {

public:

    bool LoadConfig(const std::string& path) {
        std::ifstream file(path);
        if (!file.is_open()) return false;

        std::string line;
        while (std::getline(file, line)) {
            if (line.rfind("IP=", 0) == 0) ip = line.substr(3);
            if (line.rfind("Port=", 0) == 0) port = std::stoi(line.substr(5));
        }

        return true;
    }

    std::string GetConfigValues(int choice) {

        if (choice == 1)
            return ip;

        if (choice == 2)
            return std::to_string(port);

        if (choice != 1 || choice != 2)
            return "Error! . . .";
    }

    bool OpenSocket() {
        currentSocket = socket(AF_INET, SOCK_STREAM, 0);
        return currentSocket != INVALID_SOCKET;
    }

    bool BindFromConfig() {
        sockaddr_in addr{};
        addr.sin_family = AF_INET;
        addr.sin_port = htons(port);
        inet_pton(AF_INET, ip.c_str(), &addr.sin_addr);

        return bind(currentSocket, (sockaddr*)&addr, sizeof(addr)) != SOCKET_ERROR;
    }

    bool Listen() {
        return listen(currentSocket, SOMAXCONN) != SOCKET_ERROR;
    }

    SOCKET AcceptClient() {
        return accept(currentSocket, nullptr, nullptr);
    }

    std::string ReadHTTPRequest(SOCKET client) {
        char buffer[4096];
        int bytes = recv(client, buffer, sizeof(buffer), 0);
        if (bytes <= 0) return "";

        return std::string(buffer, bytes);
    }

    void SendHTTPResponse(SOCKET client, const std::string& body) {
        std::string header =
            "HTTP/1.1 200 OK\r\n"
            "Content-Type: text/plain\r\n"
            "Access-Control-Allow-Origin: *\r\n"
            "Content-Length: " + std::to_string(body.size()) + "\r\n"
            "\r\n";

        send(client, header.c_str(), (int)header.size(), 0);
        send(client, body.c_str(), (int)body.size(), 0);
    }

    SOCKET GetSocket() { return currentSocket; }

private:
    SOCKET currentSocket = INVALID_SOCKET;
    std::string ip = "127.0.0.1";
    int port = 8080;
};
