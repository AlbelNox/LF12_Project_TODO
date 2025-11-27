#include <iostream>
#include "Helper/socketHelper.hpp"

SocketHelper* socketHelper = new SocketHelper;

int main() {
    WSADATA w;
    WSAStartup(MAKEWORD(2, 2), &w);

    std::cout << "[*] Loading cfg...\n";
    if (!socketHelper->LoadConfig("DataStorage/Server-Config/serverConfig.cfg")) {
        std::cout << "[!] Failed config\n";
        return 1;
    }

    std::cout << "[*] Create socket\n";
    if (!socketHelper->OpenSocket()) return 1;

    std::cout << "[*] Bind\n";
    if (!socketHelper->BindFromConfig()) return 1;

    std::cout << "[*] Listen\n";
    if (!socketHelper->Listen()) return 1;

    std::cout << "[+] Server läuft auf: http://localhost:8080/\n";

    while (true) {
        SOCKET client = socketHelper->AcceptClient();
        if (client == INVALID_SOCKET) continue;

        std::string request = socketHelper->ReadHTTPRequest(client);
        std::cout << "[REQ]\n" << request << "\n";

        //Building Routes here
        if (request.find("GET /hello") != std::string::npos) {
            socketHelper->SendHTTPResponse(client, "Hallo vom C++ Server!");
        }
        else {
            socketHelper->SendHTTPResponse(client, "Default Route: C++ Server");
        }

        closesocket(client);
    }

    return 0;
}
