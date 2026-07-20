#include <iostream>
#include <string>
#include <unistd.h>
#include <fstream>
#include <sstream>
#include <sys/statvfs.h>
#include <curl/curl.h>
#include <nlohmann/json.hpp>
#include "process_monitor.h"
#include "network_monitor.h"

using namespace std;
using json = nlohmann::json;
using Process = ProcessInfo;
using Network = NetworkUsage;


// ── Callback so libcurl can collect the response ──────────────────────────
static size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* s) {
    s->append((char*)contents, size * nmemb);
    return size * nmemb;
}

// ── Read CPU usage from Linux ─────────────────────────────────────────────

double getCpuUsage() {
    static long long prevIdle = 0;
    static long long prevTotal = 0;

    std::ifstream file("/proc/stat");

    std::string cpu;
    long long user, nice, system, idle, iowait, irq, softirq, steal;

    file >> cpu >> user >> nice >> system >> idle >> iowait >> irq >> softirq >> steal;

    long long idleTime = idle + iowait;

    long long totalTime =
        user + nice + system + idle + iowait + irq + softirq + steal;

    long long diffIdle = idleTime - prevIdle;
    long long diffTotal = totalTime - prevTotal;

    prevIdle = idleTime;
    prevTotal = totalTime;

    if (diffTotal == 0)
        return 0.0;

    return (double)(diffTotal - diffIdle) / diffTotal * 100.0;
}
   

// ── Read RAM usage from Linux ─────────────────────────────────────────────

void getRamUsage(double &ramUsed, double &ramTotal)
{
    std::ifstream file("/proc/meminfo");

    std::string label;
    long value;
    std::string unit;

    long memTotal = 0;
    long memAvailable = 0;

    while (file >> label >> value >> unit)
    {
        if (label == "MemTotal:")
        {
            memTotal = value;
        }

        else if (label == "MemAvailable:")
        {
            memAvailable = value;
        }

        if (memTotal && memAvailable)
            break;

            
    }

    file.close();


    // Convert KB to MB
    ramTotal = memTotal / 1024.0;

    double available = memAvailable / 1024.0;

    ramUsed = ramTotal - available;
}
// ── Read Disk usage from Linux ─────────────────────────────────────────────

void getDiskUsage(double& usedGB, double& totalGB) {

    struct statvfs disk;

    statvfs("/", &disk);


    totalGB =
        (double)(disk.f_blocks * disk.f_frsize)
        / (1024 * 1024 * 1024);


    double freeGB =
        (double)(disk.f_bfree * disk.f_frsize)
        / (1024 * 1024 * 1024);


    usedGB = totalGB - freeGB;
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

void postProcess(
    int serverId,
    ProcessInfo p
){

    CURL* curl = curl_easy_init();

    if(!curl)
        return;


    json body;

    body["server_id"] = serverId;
    body["process_name"] = p.name;
    body["pid"] = p.pid;
    body["cpu_usage"] = p.cpuUsage;
    body["memory_usage"] = p.memoryUsage;


    std::string jsonStr = body.dump();


    struct curl_slist* headers = nullptr;

    headers = curl_slist_append(
        headers,
        "Content-Type: application/json"
    );


    curl_easy_setopt(
        curl,
        CURLOPT_URL,
        "http://localhost:3000/process-readings"
    );


    curl_easy_setopt(
        curl,
        CURLOPT_POSTFIELDS,
        jsonStr.c_str()
    );


    curl_easy_setopt(
        curl,
        CURLOPT_HTTPHEADER,
        headers
    );


    CURLcode res = curl_easy_perform(curl);


    if(res != CURLE_OK)
    {
        std::cerr 
        << "Process POST failed: "
        << curl_easy_strerror(res)
        << std::endl;
    }
    else
    {
        std::cout
        << "Posted process "
        << p.name
        << " PID:"
        << p.pid
        << " -> OK"
        << std::endl;
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
    int networkComponentId = 4;

    // server_id row (from the "servers" table) this agent reports processes for
    int serverId = 1;

    std::cout << "Data Center Monitor Agent started..." << std::endl;
    std::cout << "Sending metrics every 30 seconds." << std::endl;

    while (true) {
        // ── CPU ──────────────────────────────────────────────────────────
        double cpuUsage = getCpuUsage();
        sleep(1); // wait 1 second then read again for accurate reading
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

        // ── NETWORK ─────────────────────────────────────────────

        auto network = getNetworkUsage();


        postMetric(
            networkComponentId,
            "received",
            network.receivedMB,
            "MB",
            "OK"
        );


        postMetric(
            networkComponentId,
            "transmitted",
            network.transmittedMB,
            "MB",
            "OK"
        );


        std::cout
            << "Network "
            << network.interfaceName
            << " RX:"
            << network.receivedMB
            << " MB TX:"
            << network.transmittedMB
            << " MB"
            << std::endl;
        // ── DISK ─────────────────────────────────────────────────────────
        double diskUsed, diskTotal;
        getDiskUsage(diskUsed, diskTotal);
        double diskPercent = (diskUsed / diskTotal) * 100.0;
            
        postMetric(
            diskComponentId,
            "usage",
            diskPercent,
            "percent",
            getHealthStatus(diskPercent,70.0,90.0)
    );                   

         auto processes = getProcesses();


        std::cout << "\nTop Processes\n";


        for(size_t i = 0;
            i < std::min((size_t)10, processes.size());
            i++)
        {

            const auto& p = processes[i];


            std::cout
                << p.name
                << " PID:"
                << p.pid
                << " CPU:"
                << p.cpuUsage
                << "% RAM:"
                << p.memoryUsage
                << " MB"
                << std::endl;

            postProcess(serverId, p);
        }
        std::cout << "--- Waiting 30 seconds ---" << std::endl;
        sleep(30); // wait 30 seconds before next reading

    }

    curl_global_cleanup();
    return 0;
}