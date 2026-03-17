import React, { useContext, useEffect } from 'react';
import { AuthContext } from "../../Contexts/AuthContext";
import axios from 'axios';
import toast from 'react-hot-toast';
import sim from '../../../src/assets/sim.svg'

const Overview = () => {
    const { user, setLoading, income, setIncome, expense, setExpense, balance, setBalance } = useContext(AuthContext);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!user || !user.email) return;
            try {
                const res = await axios.get(`https://fine-ease-server.vercel.app/my-transactions?email=${user.email}`);
                const data = res.data;
                const totalIncome = data
                    .filter((inc) => inc.type === 'income')
                    .reduce((sum, inc) => sum + Number(inc.amount), 0);
                const totalExpense = data
                    .filter((exp) => exp.type === 'expense')
                    .reduce((sum, exp) => sum + Number(exp.amount), 0);
                setIncome(totalIncome);
                setExpense(totalExpense);
                setBalance(totalIncome - totalExpense);
            } catch (error) {
                console.log(error);
                toast.error("Failed to fetch transactions");
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [user, setIncome, setExpense, setBalance, setLoading]);

    if (!user) {
        return <div className="text-center py-20 text-muted-foreground animate-pulse">Loading your overview...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 place-items-center gap-6 -mt-16 relative z-10">

                {/* Balance Card */}
                <div className="w-full max-w-sm h-52 p-6 bg-background/60 backdrop-blur-2xl border border-primary/20 rounded-3xl shadow-xl shadow-primary/5 flex flex-col justify-between transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-primary/20"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div className="w-12 h-9 bg-secondary/50 rounded-md flex items-center justify-center p-1 border border-border/50">
                            <img src={sim} alt="chip" className="opacity-80" />
                        </div>
                        <div className="p-2 bg-primary/10 text-primary rounded-full">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H7a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <div className="text-3xl font-bold tracking-tight mb-2">
                            ${balance.toLocaleString()}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground/80">Total Balance</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{user?.displayName || 'Card Holder'}</span>
                        </div>
                    </div>
                </div>

                {/* Income Card */}
                <div className="w-full max-w-sm h-52 p-6 bg-background/60 backdrop-blur-2xl border border-green-500/20 rounded-3xl shadow-xl shadow-green-500/5 flex flex-col justify-between transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-green-500/20"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div className="w-12 h-9 bg-secondary/50 rounded-md flex items-center justify-center p-1 border border-border/50">
                            <img src={sim} alt="chip" className="opacity-80" />
                        </div>
                        <div className="p-2 bg-green-500/10 text-green-500 rounded-full">
                            <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <div className="text-3xl font-bold tracking-tight mb-2">
                            ${income.toLocaleString()}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground/80">Total Income</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{user?.displayName || 'Card Holder'}</span>
                        </div>
                    </div>
                </div>

                {/* Expense Card */}
                <div className="w-full max-w-sm h-52 p-6 bg-background/60 backdrop-blur-2xl border border-destructive/20 rounded-3xl shadow-xl shadow-destructive/5 flex flex-col justify-between transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-destructive/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-destructive/20"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div className="w-12 h-9 bg-secondary/50 rounded-md flex items-center justify-center p-1 border border-border/50">
                            <img src={sim} alt="chip" className="opacity-80" />
                        </div>
                        <div className="p-2 bg-destructive/10 text-destructive rounded-full">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <div className="text-3xl font-bold tracking-tight mb-2">
                            ${expense.toLocaleString()}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground/80">Total Expenses</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{user?.displayName || 'Card Holder'}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Overview;