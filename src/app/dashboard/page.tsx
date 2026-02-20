import CameraFeed from "@/components/CameraFeed";
import StatusCards from "@/components/StatusCards";
import GateControl from "@/components/GateControl";
import AccessLogTable from "@/components/AccessLogTable";
import ResidentTable from "@/components/ResidentTable";
import MqttProvider from "@/components/MqttProvider"; // Import Provider Baru
import { Suspense } from "react";
import TableSkeleton from "@/components/TableSkeleton";
import { API_ENDPOINTS } from "@/config/api";
import { fetchWithAuth } from "@/lib/auth";

async function getAccessSummary() {
    try {
        const res = await fetchWithAuth(API_ENDPOINTS.ACCESS_LOGS.SUMMARY, { cache: "no-store" });
        if (!res.ok) throw new Error("Error fetch summary");
        const json = await res.json();
        return json.data;
    } catch {
        return { total: 0, granted: 0, denied: 0 };
    }
}

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const params = await searchParams;
    const residentPage = Number(params?.residentPage) || 1;
    const logPage = Number(params?.logPage) || 1;

    const summaryData = await getAccessSummary();

    return (
        <div className="flex flex-col gap-3 lg:h-full lg:grid lg:grid-rows-[58%_42%]">
            <MqttProvider>
                <div className="grid grid-cols-1 gap-3 min-h-100 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] lg:min-h-0">
                    <CameraFeed />
                    
                    <StatusCards initialSummary={summaryData} />
                    
                    <GateControl />
                </div>
            </MqttProvider>

            <div className="grid grid-cols-1 gap-3 min-h-75 sm:grid-cols-2 lg:min-h-0">
                <Suspense 
                    key={`access-log-p${logPage}`} 
                    fallback={<TableSkeleton columns={6} title="Log Akses" />}
                >
                    <AccessLogTable currentPage={logPage} searchParams={params} />
                </Suspense>

                <Suspense 
                    key={`resident-p${residentPage}`} 
                    fallback={<TableSkeleton columns={6} title="Penghuni" />}
                >
                    <ResidentTable currentPage={residentPage} searchParams={params} />
                </Suspense>
            </div>
        </div>
    );
}