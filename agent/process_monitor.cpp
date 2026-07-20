#include "process_monitor.h"

#include <filesystem>
#include <fstream>
#include <algorithm>


namespace fs = std::filesystem;



std::vector<ProcessInfo> getProcesses()
{

    std::vector<ProcessInfo> processes;



    for(auto &entry : fs::directory_iterator("/proc"))
    {

        if(!entry.is_directory())
            continue;


        std::string pidString = entry.path().filename();



        // only process folders are numbers
        if(pidString.find_first_not_of("0123456789") != std::string::npos)
            continue;



        int pid = std::stoi(pidString);



        std::ifstream file(
            "/proc/" + pidString + "/status"
        );


        std::string line;

        std::string name;

        double memory = 0;



        while(std::getline(file,line))
        {

            if(line.find("Name:") == 0)
            {
                name =
                line.substr(6);
            }


            if(line.find("VmRSS:") == 0)
            {

                sscanf(
                    line.c_str(),
                    "VmRSS: %lf",
                    &memory
                );

                break;
            }

        }



        processes.push_back(
            {
                pid,
                name,
                0.0,
                memory / 1024.0
            }
        );

    }



    std::sort(
        processes.begin(),
        processes.end(),
        [](auto&a, auto&b)
        {
            return a.memoryUsage > b.memoryUsage;
        }
    );


    return processes;

}