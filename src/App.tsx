import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, LogOut, Plus, Search } from "lucide-react";

type Charge = {
    id: string;
    date: string;
    provider: string;
    amount: number;
    notes?: string;
};

type Benefit = {
    id: string;
    name: string;
    total: number;
    remaining: number;
    renewDate: string;
    charges: Charge[];
};

const MOCK_BENEFITS: Benefit[] = [
    {
        id: "b1",
        name: "Psychiatrist",
        total: 1000,
        remaining: 600,
        renewDate: "2026-01-01",
        charges: [
            { id: "c1", date: "2025-03-04", provider: "Dr. M. Rivers", amount: 160, notes: "Initial consult" },
            { id: "c2", date: "2025-05-01", provider: "Dr. M. Rivers", amount: 120, notes: "Follow-up" },
        ],
    },
    {
        id: "b2",
        name: "Physiotherapy",
        total: 500,
        remaining: 120,
        renewDate: "2026-01-01",
        charges: [
            { id: "c3", date: "2025-02-18", provider: "City Physio", amount: 90 },
            { id: "c4", date: "2025-06-22", provider: "City Physio", amount: 110, notes: "Shoulder" },
            { id: "c5", date: "2025-09-01", provider: "Peak Performance", amount: 180, notes: "Ankle" },
        ],
    },
    {
        id: "b3",
        name: "Chiropractor",
        total: 300,
        remaining: 300,
        renewDate: "2026-01-01",
        charges: [],
    },
    {
        id: "b4",
        name: "Dental",
        total: 1500,
        remaining: 900,
        renewDate: "2026-01-01",
        charges: [
            { id: "c6", date: "2025-04-10", provider: "Yaletown Dental", amount: 250, notes: "Cleaning + x-rays" },
            { id: "c7", date: "2025-07-15", provider: "Yaletown Dental", amount: 350, notes: "Filling" },
        ],
    },
];

const fmtCurrency = (n: number) =>
    n.toLocaleString(undefined, { style: "currency", currency: "CAD", maximumFractionDigits: 0 });

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString();

export default function ManulifeBenefitsApp() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [query, setQuery] = useState("");

    const benefits = useMemo(() => {
        if (!query.trim()) return MOCK_BENEFITS;
        const q = query.toLowerCase();
        return MOCK_BENEFITS.filter((b) => b.name.toLowerCase().includes(q));
    }, [query]);

    const totals = useMemo(() => {
        const total = MOCK_BENEFITS.reduce((acc, b) => acc + b.total, 0);
        const remaining = MOCK_BENEFITS.reduce((acc, b) => acc + b.remaining, 0);
        const used = total - remaining;
        return { total, remaining, used, pctRemaining: (remaining / total) * 100 };
    }, []);

    if (!loggedIn) {
        return (
            <div className="min-h-screen w-full grid place-items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-[#f8f5e9] p-4">
                <Card className="w-full max-w-md shadow-2xl border-slate-700 bg-slate-900/60 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl text-[#f8f5e9]">Welcome to your Manulife Benefits Tracker</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-[#f8f5e9]">Username</Label>
                            <Input
                                id="username"
                                placeholder="you@example.com"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="text-[#f8f5e9] placeholder:text-[#dcd8cc] border-[#f8f5e9]/30 focus:border-[#f8f5e9] bg-transparent"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-[#f8f5e9]">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="text-[#f8f5e9] placeholder:text-[#dcd8cc] border-[#f8f5e9]/30 focus:border-[#f8f5e9] bg-transparent"
                            />
                        </div>
                        <Button
                            className="w-full bg-[#f8f5e9] text-slate-900 border border-[#f8f5e9] hover:bg-[#f8f5e9]/90 hover:text-slate-900"
                            onClick={() => {
                                if (username.trim() && password.trim()) setLoggedIn(true);
                            }}
                        >
                            Sign in
                        </Button>
                        <p className="text-xs text-[#dcd8cc] text-center">Demo login — any credentials will work for now.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center font-semibold">MB</div>
                        <h1 className="text-lg font-semibold">Manulife Benefits Tracker</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search benefits..."
                                className="pl-9 w-64"
                            />
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="gap-2 text-[#f8f5e9] bg-slate-900 border-[#f8f5e9] hover:bg-slate-900 hover:text-[#f8f5e9]">
                                    <CalendarIcon className="h-4 w-4 text-[#f8f5e9]" />
                                    Renewals
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <p className="text-sm text-slate-600 mb-2">Upcoming renewals</p>
                                <ul className="space-y-2">
                                    {MOCK_BENEFITS.map((b) => (
                                        <li key={b.id} className="flex items-center justify-between">
                                            <span>{b.name}</span>
                                            <span className="text-slate-500 text-sm">{fmtDate(b.renewDate)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </PopoverContent>
                        </Popover>
                        <Button variant="ghost" size="icon" title="Sign out" onClick={() => setLoggedIn(false)} className="text-[#f8f5e9] bg-slate-900 border border-[#f8f5e9] hover:bg-slate-900 hover:text-[#f8f5e9]">
                            <LogOut className="h-5 w-5 text-[#f8f5e9]" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="col-span-1 sm:col-span-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Coverage Remaining</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end justify-between mb-2">
                                <div className="text-2xl font-semibold">{fmtCurrency(totals.remaining)}</div>
                                <div className="text-sm text-slate-500">of {fmtCurrency(totals.total)}</div>
                            </div>
                            <Progress value={totals.pctRemaining} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Used This Year</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">{fmtCurrency(totals.used)}</div>
                            <p className="text-xs text-slate-500 mt-1">Across all benefits</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Benefits</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">{MOCK_BENEFITS.length}</div>
                            <p className="text-xs text-slate-500 mt-1">Active</p>
                        </CardContent>
                    </Card>
                </section>

                <section className="bg-white rounded-2xl shadow border border-slate-200">
                    <div className="p-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Your Benefits</h2>
                        <Button variant="outline" className="gap-2 text-[#f8f5e9] bg-slate-900 border-[#f8f5e9] hover:bg-slate-900 hover:text-[#f8f5e9]">
                            <Plus className="h-4 w-4 text-[#f8f5e9]" /> Add benefit (placeholder)
                        </Button>
                    </div>
                    <div className="px-4 pb-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Benefit</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="text-right">Remaining</TableHead>
                                    <TableHead className="w-[280px]">Progress</TableHead>
                                    <TableHead>Renews</TableHead>
                                    <TableHead className="text-right">History</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {benefits.map((b) => {
                                    const used = b.total - b.remaining;
                                    const pct = b.total === 0 ? 0 : (used / b.total) * 100;
                                    return (
                                        <TableRow key={b.id} className="hover:bg-slate-50">
                                            <TableCell className="font-medium">{b.name}</TableCell>
                                            <TableCell className="text-right">{fmtCurrency(b.total)}</TableCell>
                                            <TableCell className="text-right">{fmtCurrency(b.remaining)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Progress value={pct} className="w-48" />
                                                    <span className="text-sm text-slate-500">{Math.round(pct)}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{fmtDate(b.renewDate)}</TableCell>
                                            <TableCell className="text-right">
                                                <BenefitHistoryDialog benefit={b} />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </section>
            </main>
        </div>
    );
}

function BenefitHistoryDialog({ benefit }: { benefit: Benefit }) {
    const totalSpent = useMemo(() => benefit.charges.reduce((a, c) => a + c.amount, 0), [benefit.charges]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="underline-offset-4 text-[#f8f5e9] bg-slate-900 border border-[#f8f5e9] hover:bg-slate-900 hover:text-[#f8f5e9]">View</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{benefit.name} — Claim History</DialogTitle>
                    <DialogDescription>
                        {benefit.charges.length > 0
                            ? `${benefit.charges.length} claims • ${fmtCurrency(totalSpent)} total`
                            : "No claims yet for this benefit."}
                    </DialogDescription>
                </DialogHeader>
                {benefit.charges.length > 0 && (
                    <div className="mt-2 border border-slate-200 rounded-xl overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Provider</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead>Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {benefit.charges.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell>{fmtDate(c.date)}</TableCell>
                                        <TableCell>{c.provider}</TableCell>
                                        <TableCell className="text-right">{fmtCurrency(c.amount)}</TableCell>
                                        <TableCell className="max-w-[280px] truncate" title={c.notes}>{c.notes ?? "—"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
