import HeaderInfo from "@/components/HeaderInfo";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col lg:h-screen lg:overflow-hidden">
            <HeaderInfo />
            <main className="flex-1 px-3 py-3 w-full mx-auto max-w-400 overflow-y-auto lg:overflow-hidden lg:flex-1 lg:min-h-0">
                {children}
            </main>
        </div>
    );
}