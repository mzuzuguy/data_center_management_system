#ifndef NETWORK_MONITOR_H
#define NETWORK_MONITOR_H

#include <string>


struct NetworkUsage {

    std::string interfaceName;

    double receivedMB;

    double transmittedMB;

};


NetworkUsage getNetworkUsage();


#endif