#include "network_monitor.h"

#include <fstream>
#include <sstream>


NetworkUsage getNetworkUsage()
{

    NetworkUsage usage;


    std::ifstream file("/proc/net/dev");


    std::string line;


    while(getline(file,line))
    {

        if(line.find(":") != std::string::npos)
        {

            std::stringstream ss(line);


            std::string iface;


            ss >> iface;


            iface.pop_back();


            unsigned long rxBytes;


            ss >> rxBytes;


            usage.interfaceName = iface;


            usage.receivedMB =
                rxBytes / 1024.0 / 1024.0;


            break;
        }
    }


    return usage;

}