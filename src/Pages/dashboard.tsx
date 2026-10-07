import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";

// const API_URL = import.meta.env.VITE_API_URL;

interface UserInfo {
    name: string;
    membership: string;
    price: number;
    startDate: string;
    dueDate: string;
    status: string;
}

const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC", // remove if API returns full timestamps
    }).format(new Date(date));

const statusStyles: Record<string, { dot: string; text: string; bg: string; label: string }> = {
    active: { dot: "bg-secondary", text: "text-secondary", bg: "bg-secondary/10 border-secondary/30", label: "Active" },
    due_soon: { dot: "bg-yellow-400", text: "text-yellow-400", bg: "bg-yellow-200/10 border-yellow-200/30", label: "Due Soon" },
    expired: { dot: "bg-danger", text: "text-danger", bg: "bg-danger/10 border-danger/30", label: "Expired" },
    canceled: { dot: "bg-slate-500", text: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/30", label: "Canceled" },
};

function StatusBadge({ status }: { status: string }) {
    const s = statusStyles[status] ?? statusStyles.canceled;
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${s.bg} ${s.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {s.label ?? status}
        </span>
    );
}

interface ShellProps {
    children: React.ReactNode;
    isAdmin: boolean;
    logOut: () => void;
}

// Top-bar shell wraps every render path, including the loading gate,
// so the page never flashes unstyled text before hydrating.
const Shell = ({ children, isAdmin, logOut }: ShellProps) => (
    <div className="min-h-screen bg-background">
        <header className="border-b border-border">
            <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
                <span className="text-sm font-black uppercase tracking-widest text-white">
                    Tazzmania <span className="text-secondary">Fitness</span>
                    {isAdmin && (
                        <span className="ml-3 text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 rounded-full align-middle">
                            Admin
                        </span>
                    )}
                </span>
                <button
                    onClick={logOut}
                    className="text-xs font-bold uppercase tracking-wider text-slate-400 border border-border rounded-full px-4 py-2 hover:text-white hover:border-slate-600 transition-colors"
                >
                    Log Out
                </button>
            </div>
        </header>
        <main className="max-w-6xl mx-auto px-6 py-12">{children}</main>
    </div>
);

const Dashboard: React.FC = () => {
    const { userObj, setUserObj, isLoading } = useAuth();
    const [price, setPrice] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState("");
    const [hasMembership, setHasMembership] = useState(true);
    const [usersInfo, setUsersInfo] = useState<UserInfo[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading) return;

        if (!userObj) {
            navigate("/login", { replace: true });
            return;
        }

        const controller = new AbortController();
        const isAdmin = userObj.role === "admin";

        async function load() {
            try {
                const url = isAdmin
                    ? `/api/admin/admin`
                    : `/api/membership/userInfo`;

                const res = await fetch(url, {
                    credentials: "include",
                    signal: controller.signal,
                });

                if (res.status === 404 && !isAdmin) {
                    setHasMembership(false);
                    return;
                }
                if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

                const data = await res.json();

                if (isAdmin) {
                    setUsersInfo(data.usersInfo);
                } else {
                    setDueDate(data.due_date);
                    setPrice(data.price);
                    setStatus(data.status);
                }
            } catch (error) {
                if ((error as Error).name === "AbortError") return;
                console.error(error);
            } finally {
                setDataLoading(false);
            }
        }

        load();
        return () => controller.abort();
    }, [userObj, navigate, isLoading]);

    async function logOut() {
        try {
            await fetch(`/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
            setUserObj(null);
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    }

    const isAdmin = userObj?.role === "admin";

    if (isLoading || !userObj) {
        return (
            <Shell isAdmin={isAdmin} logOut={logOut}>
                <div className="animate-pulse space-y-4 max-w-xl">
                    <div className="h-4 w-32 bg-white/5 rounded-md" />
                    <div className="h-9 w-72 bg-white/5 rounded-md" />
                </div>
            </Shell>
        );
    }

    return (
        <Shell isAdmin={isAdmin} logOut={logOut}>
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">
                    {isAdmin ? "Membership Overview" : "Members Portal"}
                </p>
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-10">
                    Welcome back, {userObj.name}
                </h1>

                {isAdmin ? (
                    // ── Admin: operations table ──────────────────────────
                    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                All Members
                            </h2>
                            <span className="text-xs text-slate-500">
                                {usersInfo.length} {usersInfo.length === 1 ? "member" : "members"}
                            </span>
                        </div>

                        {dataLoading ? (
                            <div className="p-6 space-y-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-10 bg-white/5 rounded-md animate-pulse" />
                                ))}
                            </div>
                        ) : usersInfo.length === 0 ? (
                            <p className="text-sm text-slate-400 px-6 py-10 text-center">
                                No members to show yet.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-border">
                                            <th className="px-6 py-3 font-bold">Name</th>
                                            <th className="px-6 py-3 font-bold">Plan</th>
                                            <th className="px-6 py-3 font-bold">Price</th>
                                            <th className="px-6 py-3 font-bold">Due</th>
                                            <th className="px-6 py-3 font-bold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usersInfo.map((u, i) => (
                                            <tr key={i} className="border-b border-border last:border-0 hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4 text-white font-medium">{u.name}</td>
                                                <td className="px-6 py-4 text-slate-400">{u.membership}</td>
                                                <td className="px-6 py-4 text-slate-300">${u.price}</td>
                                                <td className="px-6 py-4 text-slate-400">{u.dueDate ? formatDate(u.dueDate) : "—"}</td>
                                                <td className="px-6 py-4"><StatusBadge status={u.status} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : (
                    // ── Member: single payment card ──────────────────────
                    <div className="p-[2px] rounded-2xl bg-gradient-to-b from-primary to-secondary max-w-xl">
                        <div className="bg-surface rounded-[14px] p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                    Next Payment
                                </h2>
                                {!dataLoading && hasMembership && <StatusBadge status={status} />}
                            </div>

                            {dataLoading ? (
                                <div className="animate-pulse space-y-3">
                                    <div className="h-8 w-40 bg-white/5 rounded-md" />
                                    <div className="h-4 w-56 bg-white/5 rounded-md" />
                                </div>
                            ) : hasMembership ? (
                                <div>
                                    <p className="text-3xl font-black text-white">${price}</p>
                                    <p className="text-sm text-slate-400 mt-1">
                                        due {dueDate ? formatDate(dueDate) : "—"}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm text-slate-400 mb-4">
                                        You don't have an active membership yet.
                                    </p>
                                    <Link
                                        to="/#membership"
                                        className="inline-block bg-gradient-to-r from-primary to-secondary text-white font-bold py-2.5 px-5 rounded-xl text-xs uppercase tracking-wider hover:scale-[1.02] transition-transform"
                                    >
                                        View Plans
                                    </Link>
                                </div>
                            )}
                            <div className="mt-6 relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/5 p-4">
                                <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
                                <div className="absolute -bottom-10 -left-10 h-20 w-20 rounded-full bg-secondary/20 blur-2xl" />

                                <div className="relative flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20">
                                        <span className="text-base"></span>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-white">
                                                More features coming soon
                                            </p>
                                            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                                                Stay tuned
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-xs text-slate-400">
                                            We're working on exciting new ways to improve your experience.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </motion.div>
        </Shell>
    );
};

export default Dashboard;