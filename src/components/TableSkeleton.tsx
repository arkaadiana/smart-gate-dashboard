import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TableSkeleton({ columns = 6, title = "Loading" }: { columns?: number, title?: string }) {
    return (
        <div className="glass rounded-xl flex flex-col overflow-hidden h-full">
            <div className="px-3 py-2 border-b border-border/30 shrink-0 text-center">
                <h3 className="font-semibold text-[10px] uppercase tracking-widest text-muted-foreground">
                    {title}
                </h3>
            </div>

            <div className="overflow-y-auto flex-1">
                <Table className="table-fixed w-full">
                    <TableHeader>
                        <TableRow className="border-border/30 hover:bg-transparent">
                            {[...Array(columns)].map((_, i) => (
                                <TableHead key={i} className="h-7">
                                    <Skeleton className="h-2 w-full opacity-50" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(7)].map((_, i) => (
                            <TableRow key={i} className="border-border/10">
                                {[...Array(columns)].map((_, j) => (
                                    <TableCell key={j} className="py-2">
                                        <Skeleton className="h-2.5 w-full opacity-30 animate-pulse" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}