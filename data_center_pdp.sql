CREATE TABLE components (
    component_id   NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    server_id      NUMBER NOT NULL,
    component_type VARCHAR2(20) NOT NULL,
    component_name VARCHAR2(100),
    CONSTRAINT fk_comp_server FOREIGN KEY (server_id) REFERENCES servers(server_id)
);

CREATE TABLE components (
    component_id   NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    server_id      NUMBER NOT NULL,
    component_type VARCHAR2(20) NOT NULL,
    component_name VARCHAR2(100),
    CONSTRAINT fk_comp_server FOREIGN KEY (server_id) REFERENCES servers(server_id)
);

CREATE TABLE metric_readings (
    reading_id    NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    component_id  NUMBER NOT NULL,
    metric_type   VARCHAR2(30) NOT NULL,
    metric_value  NUMBER(10,2) NOT NULL,
    metric_unit   VARCHAR2(20) NOT NULL,
    health_status VARCHAR2(20) DEFAULT 'OK',
    recorded_at   TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT fk_reading_comp FOREIGN KEY (component_id) REFERENCES components(component_id)
);

