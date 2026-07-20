let autoInterval = null;
let autoOn = false;


// ===============================
// API URL
// ===============================

function getBase(){

    let value =
        document.getElementById("apiUrl")
        .value
        .trim();


    if(!value){
        value = "localhost:3000";
    }


    if(!value.startsWith("http")){
        value = "http://" + value;
    }


    return value;

}



// ===============================
// STATUS HELPERS
// ===============================


function overallStatus(readings){

    if(!readings.length)
        return "OK";


    if(
        readings.some(
            r =>
            r.health_status === "CRITICAL"
        )
    )
        return "CRITICAL";


    if(
        readings.some(
            r =>
            r.health_status === "WARNING"
        )
    )
        return "WARNING";


    return "OK";

}


function statusColor(status){


    if(status==="CRITICAL")
        return "var(--crit)";


    if(status==="WARNING")
        return "var(--warn)";


    return "var(--ok)";

}



function statusClass(status){


    if(status==="CRITICAL")
        return "crit";


    if(status==="WARNING")
        return "warn";


    return "ok";

}



// ===============================
// METRIC FINDER
// ===============================


function getMetric(
    readings,
    componentId,
    metricType
){


    return readings.find(
        r =>
        r.component_id === componentId &&
        r.metric_type === metricType
    );

}



// ===============================
// METRIC BAR
// ===============================


function renderBar(
    label,
    reading
){


    if(!reading)
        return "";


    const value =
        Number(
            reading.metric_value
        ).toFixed(1);



    const color =
        statusColor(
            reading.health_status
        );



    return `

    <div class="metric">

        <div class="metric-header">

            <span>
            ${label}
            </span>

            <span style="color:${color}">
            ${value}%
            </span>

        </div>


        <div class="bar-track">

            <div 
            class="bar-fill"
            style="
            width:${value}%;
            background:${color};
            ">
            </div>

        </div>


    </div>

    `;

}
function renderServers(
    servers,
    components,
    readings
){

    const grid =
        document.getElementById(
            "serversGrid"
        );


    if(!servers.length){

        grid.innerHTML =
        `
        <div class="empty-state">
            No servers registered
        </div>
        `;

        return;
    }



    let ok = 0;
    let warn = 0;
    let crit = 0;



    grid.innerHTML =
    servers.map(server => {


        const serverComponents =
            components.filter(
                c =>
                c.server_id === server.server_id
            );



        const serverReadings =
            readings.filter(
                r =>
                serverComponents.some(
                    c =>
                    c.component_id === r.component_id
                )
            );



        const cpu =
            serverComponents.find(
                c =>
                c.component_type.toLowerCase()
                === "cpu"
            );



        const ram =
            serverComponents.find(
                c =>
                c.component_type.toLowerCase()
                === "ram"
            );



        const disk =
            serverComponents.find(
                c =>
                c.component_type.toLowerCase()
                === "disk"
            );



        const status =
            overallStatus(
                serverReadings
            );



        if(status==="OK")
            ok++;

        if(status==="WARNING")
            warn++;

        if(status==="CRITICAL")
            crit++;




        const statusText =
            status==="OK"
            ?
            "ONLINE"
            :
            status;




        let lastUpdate =
            "No data";



        if(serverReadings.length){

            lastUpdate =
            new Date(

                Math.max(
                    ...serverReadings.map(
                        r =>
                        new Date(
                            r.recorded_at
                        )
                    )
                )

            )
            .toLocaleTimeString();

        }



        return `


        <div class="server-card">


            <div class="card-top">


                <div>


                    <div class="card-name">

                        ${server.server_name}

                    </div>



                    <div class="card-location">

                        📍 ${server.location || "Unknown"}

                    </div>


                </div>



                <div class="status-badge badge-${statusClass(status)}">


                    <span
                    class="badge-dot"
                    style="
                    background:${statusColor(status)}
                    ">
                    </span>



                    ${statusText}


                </div>


            </div>




            <div class="server-info">


                <div>
                    Components:
                    ${serverComponents.length}
                </div>



                <div>
                    Last update:
                    ${lastUpdate}
                </div>


            </div>





            ${
                renderBar(
                    "CPU",
                    cpu
                    ?
                    getMetric(
                        readings,
                        cpu.component_id,
                        "usage"
                    )
                    :
                    null
                )
            }





            ${
                renderBar(
                    "RAM",
                    ram
                    ?
                    getMetric(
                        readings,
                        ram.component_id,
                        "usage"
                    )
                    :
                    null
                )
            }





            ${
                renderBar(
                    "DISK",
                    disk
                    ?
                    getMetric(
                        readings,
                        disk.component_id,
                        "usage"
                    )
                    :
                    null
                )
            }



        </div>


        `;


    })
    .join("");




    document.getElementById("statTotal")
    .textContent =
    servers.length;



    document.getElementById("statOk")
    .textContent =
    ok;



    document.getElementById("statWarn")
    .textContent =
    warn;



    document.getElementById("statCrit")
    .textContent =
    crit;


}





// ===============================
// ALERTS
// ===============================


function renderAlerts(
    readings,
    components,
    servers
){

    const list =
        document.getElementById(
            "alertsList"
        );



    const alerts =
        readings.filter(
            r =>
            r.health_status !== "OK"
        );



    if(!alerts.length){

        list.innerHTML =
        `
        <div class="empty-state">
            No alerts
        </div>
        `;

        return;

    }




    list.innerHTML =
    alerts.map(r => {


        const component =
            components.find(
                c =>
                c.component_id === r.component_id
            );



        const severity =
            statusClass(
                r.health_status
            );



        return `


        <div class="alert-item ${severity}">


            <div class="alert-icon ${severity}">


                ${
                    r.health_status==="CRITICAL"
                    ?
                    "⚠"
                    :
                    "!"
                }


            </div>



            <div class="alert-body">


                <div class="alert-title">


                    ${component?.component_type || "System"}

                    usage reached

                    ${Number(
                        r.metric_value
                    ).toFixed(1)}%


                </div>




                <div class="alert-time">


                    ${new Date(
                        r.recorded_at
                    )
                    .toLocaleString()}


                </div>


            </div>




            <div class="alert-sev">

                ${r.health_status}

            </div>


        </div>


        `;


    })
    .join("");

}

// ===============================
// FETCH DATA
// ===============================


async function fetchData(){

    const base = getBase();


    document.getElementById("connStatus")
        .textContent = "Connecting...";


    try {


        const [
            serverResponse,
            componentResponse,
            metricResponse,
            processResponse

        ] = await Promise.all([


            fetch(`${base}/servers`),

            fetch(`${base}/components`),

            fetch(`${base}/metric-readings`),

            fetch(`${base}/process-readings`)
            .catch(()=>null)

        ]);



        if(
            !serverResponse.ok ||
            !componentResponse.ok ||
            !metricResponse.ok
        ){

            throw new Error(
                "API request failed"
            );

        }



        const servers =
            await serverResponse.json();



        const components =
            await componentResponse.json();



        const readings =
            await metricResponse.json();



        let processes = [];



        if(processResponse){

            processes =
                await processResponse.json();

        }




        renderServers(
            servers,
            components,
            readings
        );



        renderAlerts(
            readings,
            components,
            servers
        );



        renderProcesses(
            processes
        );



        document.getElementById("connStatus")
            .textContent =
            "Connected";



        document.getElementById("connDot")
            .style.background =
            "var(--ok)";



        document.getElementById("lastUpdated")
            .textContent =
            "Updated " +
            new Date()
            .toLocaleTimeString();


    }


    catch(error){


        console.error(
            "Dashboard error:",
            error
        );


        document.getElementById("connStatus")
            .textContent =
            "Connection failed";


        document.getElementById("connDot")
            .style.background =
            "var(--crit)";


    }


}





// ===============================
// PROCESS DISPLAY
// ===============================


function renderProcesses(processes){


    const section =
        document.getElementById(
            "processList"
        );



    if(!section)
        return;



    if(!processes.length){


        section.innerHTML =
        `
        <div class="empty-state">
            No processes available
        </div>
        `;


        return;

    }




    section.innerHTML =
    processes.map(
        p => `


        <div class="alert-item">


            <div class="alert-body">


                <div class="alert-title">

                    ${p.process_name}

                </div>



                <div class="alert-time">

                    PID:
                    ${p.pid}

                    CPU:
                    ${Number(
                        p.cpu_usage
                    ).toFixed(1)}%

                    RAM:
                    ${Number(
                        p.memory_usage
                    ).toFixed(1)} MB

                </div>


            </div>


        </div>


        `
    )
    .join("");

}





// ===============================
// AUTO REFRESH
// ===============================


function toggleAutoRefresh(){


    autoOn = !autoOn;



    if(autoOn){


        autoInterval =
            setInterval(
                fetchData,
                5000
            );


    }
    else{


        clearInterval(
            autoInterval
        );


        autoInterval = null;

    }

}





// ===============================
// START DASHBOARD
// ===============================


document.addEventListener(
    "DOMContentLoaded",
    ()=>{


        fetchData();


    }
);

       