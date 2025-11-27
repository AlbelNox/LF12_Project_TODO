#include <iostream>
#include "Helper/socketHelper.hpp"

#define serverConfigPath "DataStorage/Server-Config/serverConfig.cfg"

SocketHelper* socketHelper = new SocketHelper;

int main() {
    WSADATA w;
    WSAStartup(MAKEWORD(2, 2), &w);

    std::cout << "[*] Loading cfg...\n";
    if (!socketHelper->LoadConfig(serverConfigPath)) {
        std::cout << "[!] Failed config\n";
        return 1;
    }

    std::cout << "[*] Create socket\n";
    if (!socketHelper->OpenSocket()) return 1;

    std::cout << "[*] Bind\n";
    if (!socketHelper->BindFromConfig()) return 1;

    std::cout << "[*] Listen\n";
    if (!socketHelper->Listen()) return 1;

    std::cout << "[+] Server running on: " << socketHelper->GetConfigValues(1) << ":" << socketHelper->GetConfigValues(2) << "\n";

    while (true) {
        SOCKET client = socketHelper->AcceptClient();
        if (client == INVALID_SOCKET) continue;

        std::string request = socketHelper->ReadHTTPRequest(client);
        std::cout << "[REQ]\n" << request << "\n";

        //Building Routes here
        if (request.find("GET /hello") != std::string::npos) {
            socketHelper->SendHTTPResponse(client, "/hello- Route!");
        }
        else {
            socketHelper->SendHTTPResponse(client, "No Route Selected!");
        }

        closesocket(client);
    }

    return 0;
}
