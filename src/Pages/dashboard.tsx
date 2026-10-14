import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import {
    UsersIcon,
    CurrencyDollarIcon,
    ShieldCheckIcon,
    ArrowRightOnRectangleIcon,
    CalendarDaysIcon,
    CreditCardIcon,
    CheckBadgeIcon,
} from "@heroicons/react/24/outline";

interface UserInfo {
    name: string;
    membership: string;
    price: number;
    startDate: string;
    dueDate: string;
    status: string;
}

interface MembershipRow {
    name: string;
    membership_name: string;
    price: string | number;
    start_date: string;
    due_date: string;
    status: string;
}

const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
    }).format(new Date(date));

const statusStyles: Record<string, { dot: string; text: string; bg: string; label: string }> = {
    active: { dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30", label: "Active" },
    due_soon: { dot: "bg-amber-400", text: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30", label: "Due Soon" },
    expired: { dot: "bg-rose-500", text: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/30", label: "Expired" },
    canceled: { dot: "bg-slate-500", text: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/30", label: "Canceled" },
};

function StatusBadge({ status }: { status: string }) {
    const s = statusStyles[status] ?? statusStyles.canceled;
    return (
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${s.bg} ${s.text}`}>
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

const Shell = ({ children, isAdmin, logOut }: ShellProps) => (
    <div className="min-h-screen bg-background text-text selection:bg-primary selection:text-white relative overflow-hidden">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Header */}
        <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <span className="text-base font-black uppercase tracking-wider text-white">
                        Tzzmania <span className="text-primary">Fitness</span>
                    </span>
                    {isAdmin && (
                        <span className="ml-2 text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/15 border border-primary/30 px-2.5 py-0.5 rounded-full">
                            Admin Suite
                        </span>
                    )}
                </Link>

                <button
                    onClick={logOut}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text/70 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-5 py-2.5 hover:text-white transition-all duration-300"
                >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    <span>Log Out</span>
                </button>
            </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">{children}</main>
    </div>
);

const Dashboard: React.FC = () => {
    const { userObj, setUserObj, isLoading } = useAuth();
    const [price, setPrice] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState("");
    const [hasMembership, setHasMembership] = useState(false);
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
                const url = isAdmin ? `/api/admin/admin` : `/api/membership/userInfo`;

                const res = await fetch(url, {
                    credentials: "include",
                    signal: controller.signal,
                });
                if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

                const data = await res.json();

                if (isAdmin) {
                    const rows: UserInfo[] = data.rows ?? [];
                    setUsersInfo(
                        rows.map((row) => ({
                            name: row.name,
                            membership: row.membership,
                            price: Number(row.price),
                            startDate: row.startDate,
                            dueDate: row.dueDate,
                            status: row.status,
                        }))
                    );
                } else {
                    const rows: MembershipRow[] = data.rows ?? [];
                    const current =
                        rows.find((r) => r.status === "active" || r.status === "due_soon") ?? rows[0];

                    if (!current || !current.membership_name) {
                        setHasMembership(false);
                        return;
                    }

                    setHasMembership(true);
                    setDueDate(current.due_date ?? "");
                    setPrice(String(current.price ?? ""));
                    setStatus(current.status ?? "canceled");
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
            <Shell isAdmin={false} logOut={logOut}>
                <div className="animate-pulse space-y-6 max-w-xl">
                    <div className="h-4 w-32 bg-white/10 rounded-full" />
                    <div className="h-10 w-72 bg-white/10 rounded-xl" />
                </div>
            </Shell>
        );
    }

    // Calculate quick metrics for Admin
    const totalRevenue = usersInfo.reduce((acc, curr) => acc + (curr.price || 0), 0);
    const activeMembersCount = usersInfo.filter((u) => u.status === "active").length;

    return (
        <Shell isAdmin={isAdmin} logOut={logOut}>
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                {/* Welcome Section */}
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-secondary bg-secondary/10 px-4 py-1.5 rounded-full border border-secondary/30 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>

                        <span>{isAdmin ? "Admin Overview" : "Member Portal"}</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{userObj.name}</span>
                    </h1>
                </div>

                {isAdmin ? (
                    /* ── Admin Dashboard View ── */
                    <div className="space-y-8">
                        {/* Quick Metrics Bar */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <div className="bg-surface/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex items-center gap-4 shadow-xl">
                                <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                                    <UsersIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-text/50">Total Members</p>
                                    <p className="text-2xl font-black text-white mt-0.5">{usersInfo.length}</p>
                                </div>
                            </div>

                            <div className="bg-surface/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex items-center gap-4 shadow-xl">
                                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                    <ShieldCheckIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-text/50">Active Subscriptions</p>
                                    <p className="text-2xl font-black text-white mt-0.5">{activeMembersCount}</p>
                                </div>
                            </div>

                            <div className="bg-surface/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex items-center gap-4 shadow-xl">
                                <div className="p-3.5 rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary">
                                    <CurrencyDollarIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-text/50">Total Value</p>
                                    <p className="text-2xl font-black text-white mt-0.5">${totalRevenue.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Members Table Card */}
                        <div className="rounded-3xl border border-white/10 bg-surface/60 backdrop-blur-xl overflow-hidden shadow-2xl">
                            <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
                                <h2 className="text-sm font-extrabold uppercase tracking-widest text-white">
                                    Member Directory
                                </h2>
                                <span className="text-xs font-medium text-text/60 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                                    {usersInfo.length} registered
                                </span>
                            </div>

                            {dataLoading ? (
                                <div className="p-8 space-y-4">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            ) : usersInfo.length === 0 ? (
                                <div className="py-16 text-center">
                                    <p className="text-sm text-text/60">No members found in the database.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="text-[11px] font-extrabold uppercase tracking-widest text-text/50 border-b border-white/10 bg-white/[0.02]">
                                                <th className="px-8 py-4">Name</th>
                                                <th className="px-8 py-4">Plan</th>
                                                <th className="px-8 py-4">Price</th>
                                                <th className="px-8 py-4">Due Date</th>
                                                <th className="px-8 py-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-sm">
                                            {usersInfo.map((u, i) => (
                                                <tr key={i} className="hover:bg-white/[0.04] transition-colors">
                                                    <td className="px-8 py-5 text-white font-bold flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-xs font-black text-white">
                                                            {u.name.charAt(0)}
                                                        </div>
                                                        {u.name}
                                                    </td>
                                                    <td className="px-8 py-5 text-text/80 font-medium">{u.membership}</td>
                                                    <td className="px-8 py-5 text-white font-extrabold">${u.price}</td>
                                                    <td className="px-8 py-5 text-text/70">{u.dueDate ? formatDate(u.dueDate) : "—"}</td>
                                                    <td className="px-8 py-5"><StatusBadge status={u.status} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* ── Member Portal View ── */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-7">
                            <div className="rounded-3xl bg-surface/80 border border-white/15 backdrop-blur-2xl p-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl pointer-events-none" />

                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary">
                                            <CreditCardIcon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-extrabold uppercase tracking-widest text-text/60">
                                                Subscription Status
                                            </h2>
                                            <p className="text-lg font-black text-white">Current Billing Cycle</p>
                                        </div>
                                    </div>
                                    {!dataLoading && hasMembership && <StatusBadge status={status} />}
                                </div>

                                {dataLoading ? (
                                    <div className="animate-pulse space-y-4 py-6">
                                        <div className="h-10 w-48 bg-white/10 rounded-xl" />
                                        <div className="h-5 w-64 bg-white/10 rounded-lg" />
                                    </div>
                                ) : hasMembership ? (
                                    <div className="space-y-6 relative z-10">
                                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-baseline justify-between">
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-text/50">Amount Due</p>
                                                <p className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mt-1">
                                                    ${price}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold uppercase tracking-wider text-text/50">Renewal Date</p>
                                                <p className="text-sm sm:text-base font-bold text-white mt-1">
                                                    {dueDate ? formatDate(dueDate) : "—"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-6 space-y-6 relative z-10">
                                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                            <p className="text-sm font-medium text-text/80 mb-2">
                                                You do not have an active membership plan assigned right now.
                                            </p>
                                            <p className="text-xs text-text/50">
                                                Select a tier to unlock full gym equipment and class access.
                                            </p>
                                        </div>
                                        <Link
                                            to="/#membership"
                                            className="inline-flex items-center justify-center w-full bg-gradient-to-r from-primary to-secondary text-white font-extrabold py-4 px-6 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-primary/25 hover:scale-[1.01] transition-all"
                                        >
                                            Browse Membership Plans
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Promo Card */}
                        <div className="lg:col-span-5">
                            <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-surface/60 to-secondary/10 p-8 backdrop-blur-2xl shadow-xl h-full flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-primary/25 blur-3xl pointer-events-none" />

                                <div>
                                    <div className="inline-flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-4">
                                        <CheckBadgeIcon className="h-4 w-4" />
                                        <span>Member Benefits</span>
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
                                        More Features Coming Soon
                                    </h3>
                                    <p className="text-sm text-text/70 leading-relaxed">
                                        We are building advanced workout trackers, personal trainer booking tools, and class scheduling directly into your dashboard.
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary shrink-0">
                                        <CalendarDaysIcon className="h-5 w-5" />
                                    </div>
                                    <span className="text-xs font-semibold text-text/90">
                                        Stay tuned for updates on your member portal.
                                    </span>
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