#ifndef DISK_MONITOR_H
#define DISK_MONITOR_H

struct DiskUsage {

    double total;
    double used;
    double free;
    double percentage;

};


DiskUsage getDiskUsage();


#endif