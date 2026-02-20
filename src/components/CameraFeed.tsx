"use client";

import { useState, useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, VideoOff } from "lucide-react";
import { useMqtt } from "./MqttProvider";
import { API_ENDPOINTS } from "@/config/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function CameraFeed() {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
    const [time, setTime] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const { latestRfid, setLatestRfid, publish } = useMqtt();
    const router = useRouter();

    useEffect(() => {
        const getDevices = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true });
                const allDevices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = allDevices.filter(device => device.kind === "videoinput");
                setDevices(videoDevices);
                
                if (videoDevices.length > 0) {
                    setSelectedDeviceId(videoDevices[0].deviceId);
                }
            } catch (err) {
                console.error("Gagal akses kamera:", err);
            }
        };

        getDevices();
    }, []);

    useEffect(() => {
        let stream: MediaStream | null = null;

        const startVideo = async () => {
            if (!selectedDeviceId) return;
            
            try {
                if (videoRef.current && videoRef.current.srcObject) {
                    const oldStream = videoRef.current.srcObject as MediaStream;
                    oldStream.getTracks().forEach(track => track.stop());
                }

                stream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: { exact: selectedDeviceId } }
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Gagal memutar video:", err);
            }
        };

        startVideo();

        return () => {
            stream?.getTracks().forEach(track => track.stop());
        };
    }, [selectedDeviceId]);

    useEffect(() => {
        const update = () => {
            setTime(new Date().toLocaleTimeString("id-ID", {
                hour: "2-digit", minute: "2-digit", second: "2-digit",
            }));
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!latestRfid) return;

        const processAccess = async () => {
            const pidToProcess = latestRfid;
            setLatestRfid(null); 
            setIsProcessing(true);

            let imageBlob: Blob | null = null;

            if (videoRef.current && videoRef.current.readyState >= 2) {
                const canvas = document.createElement("canvas");
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                const ctx = canvas.getContext("2d");
                
                if (ctx) {
                    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                    imageBlob = await new Promise<Blob | null>((resolve) => {
                        canvas.toBlob(resolve, "image/jpeg", 1.0);
                    });
                }
            }

            try {
                const formData = new FormData();
                formData.append("pid", pidToProcess);
                if (imageBlob) {
                    formData.append("image", imageBlob, `capture_${pidToProcess}.jpg`);
                }

                const res = await fetch(API_ENDPOINTS.ACCESS_LOGS.PROCESS, {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                });

                const result = await res.json();
                
                router.refresh();

                if (res.ok && result.data?.access) {
                    toast.success("Akses Diterima", { 
                        description: `PID: ${pidToProcess}` 
                    });
                    
                    publish(
                        process.env.NEXT_PUBLIC_MQTT_TOPIC_CONTROL!,
                        { servo: "open", auto_mode: "auto", threshold: 10, ping: false },
                        "servo:open (Akses Diterima)"
                    );
                } else {
                    toast.error("Akses Ditolak", { 
                        description: result.message || `PID: ${pidToProcess}` 
                    });
                }

            } catch (error) {
                toast.error("Error", { 
                    description: "Gagal memverifikasi RFID ke server" 
                });
            } finally {
                setIsProcessing(false);
            }
        };

        processAccess();
    }, [latestRfid, setLatestRfid, publish, router]);

    return (
        <div className="glass rounded-xl overflow-hidden flex flex-col transition-transform duration-200 ease-out hover:scale-[1.01] hover:z-10 h-full min-h-65 lg:min-h-0">
            <div className="relative flex-1 bg-black min-h-50 lg:min-h-0 flex items-center justify-center overflow-hidden">
                {selectedDeviceId ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                        <VideoOff className="w-10 h-10 opacity-20" />
                        <p className="text-[10px] opacity-40 mt-2">Kamera tidak ditemukan</p>
                    </div>
                )}
                
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-red-500/80 text-white text-[10px] px-2 py-0.5 rounded-full z-20">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    LIVE
                </div>

                {isProcessing && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
                        <div className="w-40 h-40 relative flex items-center justify-center overflow-hidden">
                            <DotLottieReact
                                src="/L2BozDYGb0.lottie"
                                loop
                                autoplay
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                        <p className="mt-2 text-white font-mono text-xs tracking-widest uppercase animate-pulse drop-shadow-md">
                            Verifikasi Data...
                        </p>
                    </div>
                )}
            </div>

            <div className="shrink-0 p-2 flex items-center gap-2 border-t border-border/30 bg-background/50">
                <Select value={selectedDeviceId} onValueChange={setSelectedDeviceId}>
                    <SelectTrigger className="flex-1 h-7 text-[10px] border-border/40 bg-transparent">
                        <SelectValue placeholder="Pilih Kamera" />
                    </SelectTrigger>
                    <SelectContent>
                        {devices.map((device) => (
                            <SelectItem key={device.deviceId} value={device.deviceId} className="text-[10px]">
                                {device.label || `Kamera ${device.deviceId.slice(0, 5)}`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                
                <div className="flex items-center gap-1 text-muted-foreground whitespace-nowrap pr-1">
                    <Clock className="w-3 h-3" />
                    <span className="font-mono text-[10px]">{time}</span>
                </div>
            </div>
        </div>
    );
}