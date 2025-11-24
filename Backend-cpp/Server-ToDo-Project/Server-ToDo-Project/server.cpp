#include <iostream>
#include "Helper/socketHelper.hpp"

SocketHelper* socketHelper = new SocketHelper;


int main() {
    WSADATA w;
    WSAStartup(MAKEWORD(2, 2), &w);

    std::cout << "\033[34m[*] Loading Server-Config" << "\n";
    if (!socketHelper->LoadConfig("DataStorage/Server-Config/serverConfig.cfg")) {
        std::cout << "\033[35m[!] Error loading Server-Config" << "\n";
        return 1;
    }

    std::cout << "\033[34m[*] Create Socket" << "\n";
    if (!socketHelper->OpenSocket()) {
        std::cout << "\033[35m[!] Socket creation failed" << "\n";
        return 1;
    }

    std::cout << "\033[34m[*] BindSocket" << "\n";
    if (!socketHelper->BindFromConfig()) {
        std::cout << "\033[35m[!] Socket binding failed" << "\n";
        return 1;
    }

    std::cout << "\033[32m[~] Socket-Info: " << socketHelper->GetLocalInfo() << "\n";

    while (socketHelper->IsSocketValid()) {





        Sleep(100);
    }



    system("pause");
    return 0;
}
