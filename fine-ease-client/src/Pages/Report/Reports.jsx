import React, { useState, useMemo, useEffect, useContext } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { AuthContext } from "../../Contexts/AuthContext";
import toast from "react-hot-toast";
import api from "../../lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpRight, ArrowDownRight, Wallet, Calendar, Filter, FileSpreadsheet } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const Reports = () => {
  const { user, setLoading } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [monthFilter, setMonthFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get(`/my-transactions?email=${user?.email}`);
        const data = res.data;
        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          toast.error("Invalid data format from server");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching data");
      } finally {
        setFetching(false);
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchTransactions();
    }
  }, [user?.email, setLoading]);

  const toNumber = (val) => {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  };

  // 1. Recalculate Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const date = new Date(t.date);
      const byMonth =
        monthFilter === "All" || date.getMonth() + 1 === Number(monthFilter);
      const byCategory =
        categoryFilter === "All" || t.category === categoryFilter;
      return byMonth && byCategory;
    });
  }, [transactions, monthFilter, categoryFilter]);

  // 2. Metrics calculated dynamically from Filtered Transactions
  const filteredIncome = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + toNumber(t.amount), 0);
  }, [filteredTransactions]);

  const filteredExpense = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + toNumber(t.amount), 0);
  }, [filteredTransactions]);

  const filteredBalance = filteredIncome - filteredExpense;

  // 3. Pie Chart (Donut) data - Expense breakdown only
  const pieData = useMemo(() => {
    const expensesOnly = filteredTransactions.filter((t) => t.type === "expense");
    const breakdown = expensesOnly.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + toNumber(t.amount);
      return acc;
    }, {});
    return Object.entries(breakdown).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions]);

  // 4. Monthly totals for bar chart (responds to Category Filter, shows entire year)
  const monthlyTotals = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const monthName = new Date(0, i).toLocaleString("default", { month: "short" });
      const income = transactions
        .filter(
          (t) =>
            t.type?.toLowerCase() === "income" &&
            new Date(t.date).getMonth() === i &&
            (categoryFilter === "All" || t.category === categoryFilter)
        )
        .reduce((sum, t) => sum + toNumber(t.amount), 0);
      const expense = transactions
        .filter(
          (t) =>
            t.type?.toLowerCase() === "expense" &&
            new Date(t.date).getMonth() === i &&
            (categoryFilter === "All" || t.category === categoryFilter)
        )
        .reduce((sum, t) => sum + toNumber(t.amount), 0);
      return { month: monthName, income, expense };
    });
  }, [transactions, categoryFilter]);

  const COLORS = [
    "#f43f5e", // Rose (Rent/Housing)
    "#3b82f6", // Blue (Utilities)
    "#f59e0b", // Amber (Groceries)
    "#10b981", // Emerald (Dining Out)
    "#06b6d4", // Cyan (Transportation)
    "#8b5cf6", // Violet (Healthcare)
    "#ec4899", // Pink (Entertainment)
    "#a855f7", // Purple (Shopping)
    "#14b8a6", // Teal (Education)
    "#e11d48", // Dark Rose (Travel)
    "#6366f1", // Indigo (Savings)
    "#9ca3af", // Gray (Other)
  ];

  return (
    <div className="min-h-screen py-10 bg-background px-4 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Reports & Analytics
          </h1>
          <p className="text-sm mt-1 text-muted-foreground font-light">
            Insights on your monthly performance and category spending breakdown
          </p>
        </div>

        {/* Toolbar Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-card/45 backdrop-blur-xl border border-border/80 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </div>
          
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="w-40 sm:w-44 rounded-2xl py-5.5 border-border/80 bg-card/45 backdrop-blur-xl text-xs sm:text-sm font-medium">
              <SelectValue placeholder="All Months" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="All">All Months</SelectItem>
              {[...Array(12)].map((_, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 sm:w-44 rounded-2xl py-5.5 border-border/80 bg-card/45 backdrop-blur-xl text-xs sm:text-sm font-medium">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="All">All Categories</SelectItem>
              {[...new Set(transactions.map((t) => t.category))].map((c) => (
                <SelectItem key={c} value={c} className="capitalize">
                  {c?.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Income metric */}
        <div className="p-6 bg-card/45 backdrop-blur-xl border border-border/80 rounded-3xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl -mr-6 -mt-6"></div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Total Income</span>
            <div className="p-2 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-outfit">
            ${filteredIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>

        {/* Expenses metric */}
        <div className="p-6 bg-card/45 backdrop-blur-xl border border-border/80 rounded-3xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl -mr-6 -mt-6"></div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Total Expenses</span>
            <div className="p-2 bg-red-500/10 text-rose-500 rounded-full border border-red-500/20">
              <ArrowDownRight className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-outfit">
            ${filteredExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>

        {/* Net Savings/Balance metric */}
        <div className="p-6 bg-card/45 backdrop-blur-xl border border-border/80 rounded-3xl shadow-sm relative overflow-hidden group sm:col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl -mr-6 -mt-6"></div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Net Savings</span>
            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-full border border-purple-500/20">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight font-outfit ${filteredBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${filteredBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Donut Chart and Legend */}
        <div className="p-6 sm:p-8 bg-card/45 backdrop-blur-xl border border-border/80 rounded-3xl shadow-sm">
          <h2 className="text-lg font-bold mb-6 text-foreground tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Expense Breakdown by Category
          </h2>
          
          {fetching ? (
            <div className="text-center text-muted-foreground py-24 animate-pulse">Loading breakdown chart...</div>
          ) : pieData.length === 0 ? (
            <div className="text-center text-muted-foreground py-24 text-sm font-light">No expense records found under these filters</div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
              {/* Donut container */}
              <div className="relative w-full sm:w-[50%] flex justify-center items-center">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={3}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} className="stroke-background stroke-2 outline-hidden" />
                      ))}
                    </Pie>
                    <Tooltip
                      wrapperStyle={{ zIndex: 100 }}
                      contentStyle={{
                        backgroundColor: 'rgba(23, 23, 23, 0.95)',
                        borderColor: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '1rem',
                        color: '#ffffff',
                        backdropFilter: 'blur(8px)'
                      }}
                      itemStyle={{ color: '#ffffff' }}
                      formatter={(value) => [`$${toNumber(value).toLocaleString()}`, 'Spent']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Centered Total Spent overlay */}
                <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Total Spent</span>
                  <span className="text-xl font-bold font-outfit text-foreground mt-0.5">
                    ${filteredExpense.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>

              {/* Scrollable Custom legend */}
              <div className="w-full sm:w-[50%] max-h-[260px] overflow-y-auto pr-2 space-y-3">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex justify-between items-center text-xs border-b border-border/20 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span className="capitalize text-foreground/80 font-medium">{entry.name?.replace('_', ' ')}</span>
                    </div>
                    <div className="text-right flex flex-col">
                      <span className="font-semibold text-foreground">${entry.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      <span className="text-[10px] text-muted-foreground">({((entry.value / filteredExpense) * 100).toFixed(0)}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Monthly Income vs Expense Bar Chart */}
        <div className="p-6 sm:p-8 bg-card/45 backdrop-blur-xl border border-border/80 rounded-3xl shadow-sm">
          <h2 className="text-lg font-bold mb-6 text-foreground tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Monthly Income vs Expense Trends
          </h2>
          {fetching ? (
            <div className="text-center text-muted-foreground py-24 animate-pulse">Loading trend chart...</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyTotals}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.12} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} formatter={(val) => `$${val}`} />
                <Tooltip
                  wrapperStyle={{ zIndex: 100 }}
                  contentStyle={{
                    backgroundColor: 'rgba(23, 23, 23, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '1rem',
                    color: '#ffffff',
                    backdropFilter: 'blur(8px)'
                  }}
                  itemStyle={{ color: '#ffffff' }}
                  formatter={(value) => [`$${toNumber(value).toLocaleString()}`, '']}
                />
                <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} barSize={10} />
                <Bar dataKey="expense" fill="#f43f5e" name="Expense" radius={[4, 4, 0, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>

      {/* Detailed Transactions List Table */}
      <div className="max-w-6xl mx-auto p-6 sm:p-8 bg-card/45 backdrop-blur-xl border border-border/80 rounded-3xl shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              Filtered Transactions Records
            </h2>
            <p className="text-xs text-muted-foreground mt-1 font-light">
              Showing {filteredTransactions.length} of {transactions.length} total database records
            </p>
          </div>
        </div>

        {fetching ? (
          <div className="text-center text-muted-foreground py-12 animate-pulse">Loading transaction records...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 text-sm font-light">
            No transaction records match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-border/40 text-left text-sm">
                <thead>
                  <tr className="text-muted-foreground font-semibold border-b border-border/40 text-xs uppercase tracking-wider">
                    <th className="px-6 py-3 pb-4">Date</th>
                    <th className="px-6 py-3 pb-4">Name</th>
                    <th className="px-6 py-3 pb-4">Category</th>
                    <th className="px-6 py-3 pb-4">Description</th>
                    <th className="px-6 py-3 pb-4">Type</th>
                    <th className="px-6 py-3 pb-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-xs sm:text-sm">
                  {filteredTransactions.map((t) => (
                    <tr key={t._id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-foreground/80 font-medium">
                        {t.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-foreground/80">
                        {t.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap capitalize text-foreground/80">
                        {t.category?.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4 text-foreground/70 max-w-[200px] truncate">
                        {t.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider ${
                          t.type === 'income'
                            ? 'bg-green-500/10 border-green-500/20 text-green-400'
                            : 'bg-red-500/10 border-red-500/20 text-rose-400'
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right font-semibold ${
                        t.type === 'income' ? 'text-green-500' : 'text-rose-500'
                      }`}>
                        {t.type === 'income' ? '+' : '-'}${toNumber(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
