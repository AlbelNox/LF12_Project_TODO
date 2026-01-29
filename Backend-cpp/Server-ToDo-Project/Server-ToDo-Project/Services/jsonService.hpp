#pragma once // Verhindert mehrfaches Einbinden der Header-Datei

#include <string>
#include <fstream>
#include <mutex>
#include <algorithm>
#include <cctype>
#include <filesystem>
#include <nlohmann/json.hpp>

class JsonService {
public:
    using json = nlohmann::json; // Alias für die JSON-Bibliothek

    // Konstruktor: Initialisiert den Service mit dem Pfad zur JSON-Datei
    explicit JsonService(const std::string& jsonFilePath)
        : path_(jsonFilePath)
    {
        EnsureFileExists(); // Falls Datei nicht existiert, wird sie erstellt
        Load();             // Lädt die Daten aus der Datei in db_
    }
    // Getter für den Namen der Liste
    std::string GetListName() {
        std::lock_guard<std::mutex> lock(mtx_); // Thread-Sicherheit
        return db_.value("name", std::string(""));
    }
    // Getter für die ID der Liste
    int GetListId() {
        std::lock_guard<std::mutex> lock(mtx_);
        return db_.value("id", 0);
    }
    // Setter für den Namen der Liste
    bool SetListName(const std::string& name) {
        std::lock_guard<std::mutex> lock(mtx_);
        db_["name"] = name;
        return SaveUnlocked(); // Speichert Änderungen in die Datei
    }
    // Setter für die ID der Liste
    bool SetListId(int id) {
        std::lock_guard<std::mutex> lock(mtx_);
        db_["id"] = id;
        return SaveUnlocked();
    }
    // Gibt alle Todos zurück
    json GetTodos() {
        std::lock_guard<std::mutex> lock(mtx_);
        return db_.value("todos", json::array());
    }
    // Gibt ein Todo anhand der ID zurück
    json GetTodoById(int todoId) {
        std::lock_guard<std::mutex> lock(mtx_);
        if (!db_.contains("todos") || !db_["todos"].is_array())
            return json();

        for (const auto& t : db_["todos"]) {
            if (t.value("id", -1) == todoId) return t;
        }
        return json();
    }
    // Fügt ein neues Todo hinzu
    json AddTodo(const std::string& title,
        const std::string& priority,
        const std::string& dueDate)
    {
        std::lock_guard<std::mutex> lock(mtx_);
        int newId = NextTodoIdUnlocked(); // Ermittelt die nächste freie ID

        json todo = {
            {"checked", false},
            {"priority", NormalizePriority(priority)},
            {"dueDate", dueDate},
            {"title", title},
            {"id", newId}
        };

        db_["todos"].push_back(todo); // Fügt Todo zur Liste hinzu
        SaveUnlocked();               // Speichert Änderungen
        return todo;
    }
    // Setzt den Status "checked" eines Todos
    bool SetChecked(int todoId, bool checked) {
        std::lock_guard<std::mutex> lock(mtx_);
        if (!db_.contains("todos") || !db_["todos"].is_array())
            return false;

        for (auto& t : db_["todos"]) {
            if (t.value("id", -1) == todoId) {
                t["checked"] = checked;
                return SaveUnlocked();
            }
        }
        return false;
    }
    // Aktualisiert ein bestehendes Todo
    bool UpdateTodo(int todoId,
        const std::string& title,
        const std::string& priority,
        const std::string& dueDate,
        bool checked)
    {
        std::lock_guard<std::mutex> lock(mtx_);
        if (!db_.contains("todos") || !db_["todos"].is_array())
            return false;

        for (auto& t : db_["todos"]) {
            if (t.value("id", -1) == todoId) {
                t["title"] = title;
                t["priority"] = NormalizePriority(priority);
                t["dueDate"] = dueDate;
                t["checked"] = checked;
                return SaveUnlocked();
            }
        }
        return false;
    }
    // Löscht ein Todo anhand der ID
    bool DeleteTodo(int todoId) {
        std::lock_guard<std::mutex> lock(mtx_);
        auto& arr = db_["todos"];
        if (!arr.is_array()) return false;

        for (size_t i = 0; i < arr.size(); ++i) {
            if (arr[i].value("id", -1) == todoId) {
                arr.erase(arr.begin() + static_cast<std::ptrdiff_t>(i));
                return SaveUnlocked();
            }
        }
        return false;
    }
    // Versucht, einen String als JSON zu parsen
    static json TryParseJson(const std::string& s) {
        try { return json::parse(s); }
        catch (...) { return json(); }
    }
    // Gibt JSON als formatierten String zurück
    static std::string ToPrettyString(const json& j) {
        return j.dump(2);
    }

private:
    std::string path_; // Pfad zur JSON-Datei
    json db_;          // In-Memory-Datenbank
    std::mutex mtx_;  // Mutex für Thread-Sicherheit

    // Erstellt die Datei, falls sie nicht existiert
    void EnsureFileExists() {
        std::filesystem::create_directories(std::filesystem::path(path_).parent_path());

        std::ifstream in(path_);
        if (in.good()) return;

        json def = { {"name",""}, {"id",0}, {"todos", json::array()} };
        std::ofstream out(path_, std::ios::trunc);
        if (out.is_open()) out << def.dump(2);
    }
    // Lädt die Daten aus der Datei
    bool Load() {
        std::ifstream file(path_);
        if (!file.is_open()) {
            db_ = json{ {"name",""}, {"id",0}, {"todos", json::array()} };
            return false;
        }

        try { file >> db_; }
        catch (...) {
            db_ = json{ {"name",""}, {"id",0}, {"todos", json::array()} };
            SaveUnlocked();
            return false;
        }
        // Sicherstellen, dass alle Schlüssel vorhanden sind
        if (!db_.contains("name")) db_["name"] = "";
        if (!db_.contains("id")) db_["id"] = 0;
        if (!db_.contains("todos") || !db_["todos"].is_array())
            db_["todos"] = json::array();

        // Konvertiert "checked" von String zu bool, falls nötig
        for (auto& t : db_["todos"]) {
            if (t.contains("checked") && t["checked"].is_string()) {
                std::string v = t["checked"].get<std::string>();
                for (auto& c : v) c = (char)std::tolower((unsigned char)c);
                t["checked"] = (v == "true");
            }
        }

        return true;
    }
    // Speichert die Daten in die Datei
    bool SaveUnlocked() {
        std::ofstream file(path_, std::ios::trunc);
        if (!file.is_open()) return false;
        file << db_.dump(2);
        return true;
    }
    // Ermittelt die nächste freie Todo-ID
    int NextTodoIdUnlocked() const {
        int maxId = 0;
        if (db_.contains("todos") && db_["todos"].is_array()) {
            for (const auto& t : db_["todos"])
                maxId = std::max(maxId, t.value("id", 0));
        }
        return maxId + 1;
    }
    // Normalisiert die Priorität (LOW, MEDIUM, HIGH)
    static std::string NormalizePriority(std::string p) {
        for (auto& c : p) c = (char)std::toupper((unsigned char)c);
        if (p == "LOW" || p == "MEDIUM" || p == "HIGH") return p;
        return "MEDIUM"; // Standardwert
    }
};
``
