#include "disk_monitor.h"

#include <sys/statvfs.h>


DiskUsage getDiskUsage(){

    struct statvfs stat;


    statvfs("/", &stat);


    double total =
        stat.f_blocks * stat.f_frsize;


    double free =
        stat.f_bfree * stat.f_frsize;


    double used =
        total - free;



    DiskUsage disk;


    disk.total = total / (1024*1024*1024);

    disk.used = used / (1024*1024*1024);

    disk.free = free / (1024*1024*1024);


    disk.percentage =
        (used / total) * 100;



    return disk;

}