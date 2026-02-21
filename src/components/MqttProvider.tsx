"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import mqtt from "mqtt";

interface MqttContextType {
    isConnected: boolean;
    isDeviceOnline: boolean;
    deviceStatus: {
        gate_status: string;
        mode: string;
        distance: number | null;
        threshold: number | null;
    };
    logs: string[];
    latestRfid: string | null;
    setLatestRfid: (pid: string | null) => void;
    publish: (topic: string, message: object, logText: string) => void;
}

const MqttContext = createContext<MqttContextType | null>(null);

export const useMqtt = () => {
    const context = useContext(MqttContext);
    if (!context) throw new Error("");
    return context;
};

export default function MqttProvider({ children }: { children: React.ReactNode }) {
    const [isConnected, setIsConnected] = useState(false);
    const [isDeviceOnline, setIsDeviceOnline] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [latestRfid, setLatestRfid] = useState<string | null>(null);
    const [deviceStatus, setDeviceStatus] = useState({
        gate_status: "UNKNOWN",
        mode: "MANUAL",
        distance: null,
        threshold: null,
    });

    const clientRef = useRef<mqtt.MqttClient | null>(null);
    const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const addLog = (type: "PUB" | "SUB", topic: string, payload: string) => {
        const time = new Date().toLocaleTimeString("id-ID", { hour12: false });
        setLogs((prev) => [`[${time}] ${type} → ${topic}: ${payload}`, ...prev].slice(0, 50));
    };

    useEffect(() => {
        const host = process.env.NEXT_PUBLIC_MQTT_HOST;
        const port = process.env.NEXT_PUBLIC_MQTT_PORT;
        const path = process.env.NEXT_PUBLIC_MQTT_PATH || "";
            
        const isSSL = process.env.NEXT_PUBLIC_MQTT_SSL === 'true';
        const protocol = isSSL ? 'wss' : 'ws';
            
        const brokerUrl = `${protocol}://${host}:${port}${path.startsWith('/') ? path : '/' + path}`;

        const client = mqtt.connect(brokerUrl, {
            username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
            password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
            clean: true,
            reconnectPeriod: 3000,
            clientId: `sg_dash_${Math.random().toString(16).slice(2, 8)}`,
        });

        clientRef.current = client;

        client.on("connect", () => {
            setIsConnected(true);
            client.subscribe(process.env.NEXT_PUBLIC_MQTT_TOPIC_STATUS!);
            client.subscribe(process.env.NEXT_PUBLIC_MQTT_TOPIC_RFID!);
        });

        client.on("message", (topic, message) => {
            const payload = message.toString();

            if (topic === process.env.NEXT_PUBLIC_MQTT_TOPIC_STATUS) {
                setIsDeviceOnline(true);
                
                if (heartbeatTimeoutRef.current) clearTimeout(heartbeatTimeoutRef.current);
                heartbeatTimeoutRef.current = setTimeout(() => setIsDeviceOnline(false), 5000);

                try {
                    const parsed = JSON.parse(payload);
                    setDeviceStatus((prev) => ({ ...prev, ...parsed }));

                    const logParts = [];
                    if (parsed.gate_status) logParts.push(`gate:${parsed.gate_status}`);
                    if (parsed.mode) logParts.push(`mode:${parsed.mode}`);
                    if (parsed.distance !== undefined) logParts.push(`dist:${parsed.distance}`);
                    if (parsed.threshold !== undefined) logParts.push(`thr:${parsed.threshold}`);
                    
                    addLog("SUB", topic, logParts.join(", "));
                } catch (e) {
                    addLog("SUB", topic, payload);
                }
            } else if (topic === process.env.NEXT_PUBLIC_MQTT_TOPIC_RFID) {
                try {
                    const parsed = JSON.parse(payload);
                    if (parsed.pid) {
                        addLog("SUB", topic, `PID:${parsed.pid}`);
                        setLatestRfid(parsed.pid);
                    }
                } catch (e) {
                    addLog("SUB", topic, payload);
                }
            } else {
                addLog("SUB", topic, payload);
            }
        });

        client.on("disconnect", () => {
            setIsConnected(false);
            setIsDeviceOnline(false);
        });
        
        client.on("offline", () => {
            setIsConnected(false);
            setIsDeviceOnline(false);
        });

        return () => {
            if (heartbeatTimeoutRef.current) clearTimeout(heartbeatTimeoutRef.current);
            if (client) client.end();
        };
    }, []);

    const publish = (topic: string, message: object, logText: string) => {
        if (clientRef.current && isConnected) {
            clientRef.current.publish(topic, JSON.stringify(message));
            addLog("PUB", topic, logText);
        } else {
            addLog("PUB", topic, "FAILED (Not Connected)");
        }
    };

    return (
        <MqttContext.Provider value={{ isConnected, isDeviceOnline, deviceStatus, logs, latestRfid, setLatestRfid, publish }}>
            {children}
        </MqttContext.Provider>
    );
}