export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            </div>
            {children}
        </div>
    );
}