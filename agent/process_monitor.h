#ifndef PROCESS_MONITOR_H
#define PROCESS_MONITOR_H

#include <string>
#include <vector>


struct ProcessInfo
{
    int pid;
    std::string name;
    double cpuUsage;
    double memoryUsage;
};


std::vector<ProcessInfo> getProcesses();


#endif