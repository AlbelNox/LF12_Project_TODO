#pragma once


#pragma once

#include <string>
#include <fstream>
#include <mutex>
#include <algorithm>
#include <cctype>
#include <filesystem>
#include <nlohmann/json.hpp>

class JsonService {
public:
    using json = nlohmann::json;

    explicit JsonService(const std::string& jsonFilePath)
        : path_(jsonFilePath)
    {
        EnsureFileExists();
        Load();
    }

    std::string GetListName() {
        std::lock_guard<std::mutex> lock(mtx_);
        return db_.value("name", std::string(""));
    }

    int GetListId() {
        std::lock_guard<std::mutex> lock(mtx_);
        return db_.value("id", 0);
    }

    bool SetListName(const std::string& name) {
        std::lock_guard<std::mutex> lock(mtx_);
        db_["name"] = name;
        return SaveUnlocked();
    }

    bool SetListId(int id) {
        std::lock_guard<std::mutex> lock(mtx_);
        db_["id"] = id;
        return SaveUnlocked();
    }

    json GetTodos() {
        std::lock_guard<std::mutex> lock(mtx_);
        return db_.value("todos", json::array());
    }

    json GetTodoById(int todoId) {
        std::lock_guard<std::mutex> lock(mtx_);
        if (!db_.contains("todos") || !db_["todos"].is_array())
            return json();

        for (const auto& t : db_["todos"]) {
            if (t.value("id", -1) == todoId) return t;
        }
        return json();
    }

    json AddTodo(const std::string& title,
        const std::string& priority,
        const std::string& dueDate)
    {
        std::lock_guard<std::mutex> lock(mtx_);
        int newId = NextTodoIdUnlocked();

        json todo = {
            {"checked", false},
            {"priority", NormalizePriority(priority)},
            {"dueDate", dueDate},
            {"title", title},
            {"id", newId}
        };

        db_["todos"].push_back(todo);
        SaveUnlocked();
        return todo;
    }

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

    static json TryParseJson(const std::string& s) {
        try { return json::parse(s); }
        catch (...) { return json(); }
    }

    static std::string ToPrettyString(const json& j) {
        return j.dump(2);
    }

private:
    std::string path_;
    json db_;
    std::mutex mtx_;

    void EnsureFileExists() {
        std::filesystem::create_directories(std::filesystem::path(path_).parent_path());

        std::ifstream in(path_);
        if (in.good()) return;

        json def = { {"name",""}, {"id",0}, {"todos", json::array()} };
        std::ofstream out(path_, std::ios::trunc);
        if (out.is_open()) out << def.dump(2);
    }

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

        if (!db_.contains("name")) db_["name"] = "";
        if (!db_.contains("id")) db_["id"] = 0;
        if (!db_.contains("todos") || !db_["todos"].is_array())
            db_["todos"] = json::array();

        for (auto& t : db_["todos"]) {
            if (t.contains("checked") && t["checked"].is_string()) {
                std::string v = t["checked"].get<std::string>();
                for (auto& c : v) c = (char)std::tolower((unsigned char)c);
                t["checked"] = (v == "true");
            }
        }

        return true;
    }

    bool SaveUnlocked() {
        std::ofstream file(path_, std::ios::trunc);
        if (!file.is_open()) return false;
        file << db_.dump(2);
        return true;
    }

    int NextTodoIdUnlocked() const {
        int maxId = 0;
        if (db_.contains("todos") && db_["todos"].is_array()) {
            for (const auto& t : db_["todos"])
                maxId = std::max(maxId, t.value("id", 0));
        }
        return maxId + 1;
    }

    static std::string NormalizePriority(std::string p) {
        for (auto& c : p) c = (char)std::toupper((unsigned char)c);
        if (p == "LOW" || p == "MEDIUM" || p == "HIGH") return p;
        return "MEDIUM";
    }
};
``
