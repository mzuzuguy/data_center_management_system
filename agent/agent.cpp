#include <iostream>
#include <string>
#include <windows.h>
#include <curl/curl.h>
#include "C:/json/json.hpp"

using json = nlohmann::json;

// ── Callback so libcurl can collect the response ──────────────────────────
static size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* s) {
    s->append((char*)contents, size * nmemb);
    return size * nmemb;
}

// ── Read CPU usage from Windows ───────────────────────────────────────────
double getCpuUsage() {
    FILETIME idleTime, kernelTime, userTime;
    GetSystemTimes(&idleTime, &kernelTime, &userTime);

    static ULONGLONG prevIdle = 0, prevKernel = 0, prevUser = 0;

    ULONGLONG idle   = ((ULONGLONG)idleTime.dwHighDateTime   << 32) | idleTime.dwLowDateTime;
    ULONGLONG kernel = ((ULONGLONG)kernelTime.dwHighDateTime << 32) | kernelTime.dwLowDateTime;
    ULONGLONG user   = ((ULONGLONG)userTime.dwHighDateTime   << 32) | userTime.dwLowDateTime;

    ULONGLONG diffIdle   = idle   - prevIdle;
    ULONGLONG diffKernel = kernel - prevKernel;
    ULONGLONG diffUser   = user   - prevUser;

    prevIdle   = idle;
    prevKernel = kernel;
    prevUser   = user;

    ULONGLONG total = diffKernel + diffUser;
    if (total == 0) return 0.0;

    return (double)(total - diffIdle) / total * 100.0;
}

// ── Read RAM usage from Windows ───────────────────────────────────────────
void getRamUsage(double& usedMB, double& totalMB) {
    MEMORYSTATUSEX memStatus;
    memStatus.dwLength = sizeof(memStatus);
    GlobalMemoryStatusEx(&memStatus);

    totalMB = memStatus.ullTotalPhys / (1024.0 * 1024.0);
    usedMB  = (memStatus.ullTotalPhys - memStatus.ullAvailPhys) / (1024.0 * 1024.0);
}

// ── Read Disk usage from Windows ──────────────────────────────────────────
void getDiskUsage(double& usedGB, double& totalGB) {
    ULARGE_INTEGER freeBytesAvailable, totalBytes, totalFreeBytes;
    GetDiskFreeSpaceEx("C:\\", &freeBytesAvailable, &totalBytes, &totalFreeBytes);

    totalGB = totalBytes.QuadPart / (1024.0 * 1024.0 * 1024.0);
    usedGB  = (totalBytes.QuadPart - totalFreeBytes.QuadPart) / (1024.0 * 1024.0 * 1024.0);
}

// ── POST a metric reading to your NestJS API ──────────────────────────────
void postMetric(int componentId, const std::string& metricType,
                double metricValue, const std::string& metricUnit,
                const std::string& healthStatus) {

    CURL* curl = curl_easy_init();
    if (!curl) return;

    // Build JSON body
    json body;
    body["component_id"]  = componentId;
    body["metric_type"]   = metricType;
    body["metric_value"]  = metricValue;
    body["metric_unit"]   = metricUnit;
    body["health_status"] = healthStatus;
    std::string jsonStr   = body.dump();

    std::string response;
    struct curl_slist* headers = nullptr;
    headers = curl_slist_append(headers, "Content-Type: application/json");

    curl_easy_setopt(curl, CURLOPT_URL, "http://localhost:3000/metric-readings");
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, jsonStr.c_str());
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

    CURLcode res = curl_easy_perform(curl);

    if (res != CURLE_OK) {
        std::cerr << "POST failed: " << curl_easy_strerror(res) << std::endl;
    } else {
        std::cout << "Posted " << metricType << " (" << metricValue
                  << " " << metricUnit << ") -> " << healthStatus << std::endl;
    }

    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);
}

// ── Determine health status from value and thresholds ────────────────────
std::string getHealthStatus(double value, double warningThreshold, double criticalThreshold) {
    if (value >= criticalThreshold) return "CRITICAL";
    if (value >= warningThreshold)  return "WARNING";
    return "OK";
}

// ── Main loop ─────────────────────────────────────────────────────────────
int main() {
    curl_global_init(CURL_GLOBAL_ALL);

    // Component IDs from your database
    // Change these to match your actual component_ids after inserting components
    int cpuComponentId  = 1;
    int ramComponentId  = 2;
    int diskComponentId = 3;

    std::cout << "Data Center Monitor Agent started..." << std::endl;
    std::cout << "Sending metrics every 30 seconds." << std::endl;

    while (true) {
        // ── CPU ──────────────────────────────────────────────────────────
        double cpuUsage = getCpuUsage();
        Sleep(1000); // wait 1 second then read again for accurate reading
        cpuUsage = getCpuUsage();

        postMetric(cpuComponentId, "usage", cpuUsage, "percent",
                   getHealthStatus(cpuUsage, 70.0, 90.0));

        // ── RAM ──────────────────────────────────────────────────────────
        double ramUsed, ramTotal;
        getRamUsage(ramUsed, ramTotal);
        double ramPercent = (ramUsed / ramTotal) * 100.0;

        postMetric(ramComponentId, "usage", ramPercent, "percent",
                   getHealthStatus(ramPercent, 75.0, 90.0));

        postMetric(ramComponentId, "used_mb", ramUsed, "mb", "OK");

        // ── DISK ─────────────────────────────────────────────────────────
        double diskUsed, diskTotal;
        getDiskUsage(diskUsed, diskTotal);
        double diskPercent = (diskUsed / diskTotal) * 100.0;

        postMetric(diskComponentId, "usage", diskPercent, "percent",
                   getHealthStatus(diskPercent, 70.0, 90.0));

        std::cout << "--- Waiting 30 seconds ---" << std::endl;
        Sleep(30000); // wait 30 seconds before next reading
    }

    curl_global_cleanup();
    return 0;
}         