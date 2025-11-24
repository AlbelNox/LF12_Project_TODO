#pragma once

#include <WinSock2.h>
#include <ws2tcpip.h>
#include <string>
#include <fstream>
#include <sstream>

#pragma comment(lib, "ws2_32.lib")

class SocketHelper {

public:

    bool LoadConfig(const std::string& path) {
        std::ifstream file(path);
        if (!file.is_open()) return false;

        std::string line;
        while (std::getline(file, line)) {

            if (line.find("IP=") == 0) {
                ip = line.substr(3); // nach 'IP='
            }

            if (line.find("Port=") == 0) {
                port = std::stoi(line.substr(5));
            }
        }

        return true;
    }


    bool OpenSocket() {
        currentSocket = socket(AF_INET, SOCK_STREAM, 0);
        return currentSocket != INVALID_SOCKET;
    }

    bool IsSocketValid() const {
        return currentSocket != INVALID_SOCKET;
    }

    bool IsSocketAlive() const {
        char buffer;
        int result = recv(currentSocket, &buffer, 1, MSG_PEEK);

        if (result == 0)
            return false; // Verbindung geschlossen

        if (result == SOCKET_ERROR) {
            int error = WSAGetLastError();
            if (error == WSAEWOULDBLOCK)
                return true; // Socket lebt
            return false;
        }

        return true;
    }

    // Bind anhand config
    bool BindFromConfig() {
        sockaddr_in addr{};
        addr.sin_family = AF_INET;
        addr.sin_port = htons(port);

        inet_pton(AF_INET, ip.c_str(), &addr.sin_addr);

        return bind(currentSocket, (sockaddr*)&addr, sizeof(addr)) != SOCKET_ERROR;
    }


    std::string GetLocalInfo() {
        sockaddr_in localAddr{};
        int len = sizeof(localAddr);

        if (getsockname(currentSocket, (sockaddr*)&localAddr, &len) == SOCKET_ERROR)
            return "Unknown";

        char ipStr[INET_ADDRSTRLEN]{};
        inet_ntop(AF_INET, &localAddr.sin_addr, ipStr, sizeof(ipStr));

        int port = ntohs(localAddr.sin_port);

        return std::string(ipStr) + ":" + std::to_string(port);
    }

    SOCKET GetCurrentSocket() { return currentSocket; }


private:
    SOCKET currentSocket = INVALID_SOCKET;
    std::string ip = "0.0.0.0";
    int port = 0;
};
