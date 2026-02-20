import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { API_ENDPOINTS } from "@/config/api";
import Link from "next/link";
import ResidentRow from "./ResidentRow";
import TableBodySkeleton from "./TableBodySkeleton";
import { Suspense } from "react";
import { fetchWithAuth } from "@/lib/auth";
import ResidentTableHeader from "./ResidentTableHeader";

async function ResidentList({ page }: { page: number }) {
    try {
        const res = await fetchWithAuth(`${API_ENDPOINTS.USERS.GET_ALL}?page=${page}`, { cache: "no-store" });
        const response = await res.json();
        const dataList = response?.data || [];
        return dataList.map((r: any) => <ResidentRow key={r.id} r={r} />);
    } catch (error) {
        return <TableRow><TableCell colSpan={6} className="text-center text-red-400">Error load data</TableCell></TableRow>;
    }
}

export default async function ResidentTable({ currentPage = 1, searchParams }: any) {
    const resMeta = await fetchWithAuth(`${API_ENDPOINTS.USERS.GET_ALL}?page=${currentPage}`, { cache: "no-store" });
    const metaData = await resMeta.json();
    const totalPages = metaData?.meta?.totalPages || 1;
    const isNextDisabled = currentPage >= totalPages;

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(
            Object.entries(searchParams || {}).map(([k, v]) => [k, String(v)])
        );
        params.set("residentPage", pageNumber.toString());
        return `?${params.toString()}`;
    };

    return (
        <div className="glass rounded-xl flex flex-col overflow-hidden h-full hover:scale-[1.009] hover:z-10">
            <ResidentTableHeader />

            <div className="overflow-y-auto flex-1">
                <Table className="table-fixed w-full">
                    <TableHeader>
                        <TableRow className="border-border/30">
                            <TableHead className="text-[10px] h-7 w-[12%]">PID</TableHead>
                            <TableHead className="text-[10px] h-7 w-[23%]">Nama</TableHead>
                            <TableHead className="text-[10px] h-7 w-[23%]">Email</TableHead>
                            <TableHead className="text-[10px] h-7 w-[17%]">TNKB</TableHead>
                            <TableHead className="text-[10px] h-7 w-[12%] text-center">Status</TableHead>
                            <TableHead className="text-[10px] h-7 w-[13%] text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <Suspense key={currentPage} fallback={<TableBodySkeleton cols={6} />}>
                            <ResidentList page={currentPage} />
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