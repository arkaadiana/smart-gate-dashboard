import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { API_ENDPOINTS } from "@/config/api";
import Link from "next/link";
import AccessLogRow from "./AccessLogRow";
import TableBodySkeleton from "./TableBodySkeleton";
import { Suspense } from "react";
import { fetchWithAuth } from "@/lib/auth";

async function AccessLogList({ page }: { page: number }) {
    try {
        const res = await fetchWithAuth(`${API_ENDPOINTS.ACCESS_LOGS.GET_ALL}?page=${page}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Gagal fetch");
        const response = await res.json();
        const dataList = response?.data || [];

        if (dataList.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={6} className="text-center text-[10px] py-4 text-muted-foreground">Tidak ada riwayat.</TableCell>
                </TableRow>
            );
        }
        return dataList.map((log: any) => <AccessLogRow key={log.id} log={log} />);
    } catch (error) {
        return <TableRow><TableCell colSpan={6} className="text-center text-red-400">Error load data</TableCell></TableRow>;
    }
}

export default async function AccessLogTable({ currentPage = 1, searchParams }: any) {
    const resMeta = await fetchWithAuth(`${API_ENDPOINTS.ACCESS_LOGS.GET_ALL}?page=${currentPage}`, { cache: "no-store" });
    const metaData = await resMeta.json();
    const totalPages = metaData?.meta?.totalPages || 1;
    const isNextDisabled = currentPage >= totalPages;

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("logPage", pageNumber.toString());
        return `?${params.toString()}`;
    };

    return (
        <div className="glass rounded-xl flex flex-col overflow-hidden h-full hover:scale-[1.009] hover:z-10">
            <div className="px-3 py-2 border-b border-border/30 shrink-0">
                <h3 className="font-semibold text-[10px] uppercase tracking-widest text-muted-foreground text-center">Log Akses</h3>
            </div>
            <div className="overflow-y-auto flex-1">
                <Table className="table-fixed w-full">
                    <TableHeader>
                        <TableRow className="border-border/30 hover:bg-transparent">
                            <TableHead className="text-[10px] h-7 w-[15%]">Waktu</TableHead>
                            <TableHead className="text-[10px] h-7 w-[15%]">PID</TableHead>
                            <TableHead className="text-[10px] h-7 w-[25%]">Nama</TableHead>
                            <TableHead className="text-[10px] h-7 w-[15%]">TNKB</TableHead>
                            <TableHead className="text-[10px] h-7 w-[15%] text-center">Status</TableHead>
                            <TableHead className="text-[10px] h-7 w-[10%] text-center">Detail</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <Suspense key={currentPage} fallback={<TableBodySkeleton cols={6} />}>
                            <AccessLogList page={currentPage} />
                        </Suspense>
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between px-3 py-1.5 border-t border-border/30 bg-background/50 text-[10px]">
                <span className="text-muted-foreground">Hal {currentPage}/{totalPages}</span>
                <div className="flex gap-1">
                    <Link href={currentPage <= 1 ? "#" : createPageURL(currentPage - 1)} className={`px-2 py-0.5 rounded border border-border/50 ${currentPage <= 1 ? "opacity-30 pointer-events-none" : "hover:bg-white/5"}`}>Prev</Link>
                    <Link href={isNextDisabled ? "#" : createPageURL(currentPage + 1)} className={`px-2 py-0.5 rounded border border-border/50 ${isNextDisabled ? "opacity-30 pointer-events-none" : "hover:bg-white/5"}`}>Next</Link>
                </div>
            </div>
        </div>
    );
}