import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export default function TableBodySkeleton({ rows = 7, cols = 6 }: { rows?: number, cols?: number }) {
    return (
        <>
            {[...Array(rows)].map((_, i) => (
                <TableRow key={i} className="border-border/10 hover:bg-transparent">
                    {[...Array(cols)].map((_, j) => (
                        <TableCell key={j} className="py-2">
                            <Skeleton className="h-2.5 w-full opacity-30 animate-pulse" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
}