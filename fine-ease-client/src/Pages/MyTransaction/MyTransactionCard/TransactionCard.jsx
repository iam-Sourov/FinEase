import React, { useContext, useEffect, useState } from 'react';
import { Pencil, Trash2, Eye, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthContext } from '../../../Contexts/AuthContext';
import toast from 'react-hot-toast';
import api from '../../../lib/api';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"

const TransactionCard = () => {
  const { user, setLoading } = useContext(AuthContext);
  const [shadDate, setDate] = useState();
  const [descriptionInput, setDescriptionInput] = useState('');
  const [shadCategory, setCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [transactions, setTransactions] = useState([]);

  const handleRemove = async (id) => {
    try {
      await api.delete(`/transaction/delete/${id}`);
      const filteredData = transactions.filter(data => data._id !== id);
      setTransactions(filteredData);
      toast.success('Successfully Deleted');
    } catch (err) {
      console.error(err);
      toast.error('Unable To Delete');
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get(`/my-transactions?email=${user.email}`);
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Error Fetching Transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [user.email, setLoading]);

  const totalBalanceByCategory = (category) => {
    return transactions
      .filter((cat) => cat.category === category)
      .reduce((sum, cat) => sum + cat.amount, 0);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Please add a transaction from the "Add Transaction" page to view your transactions.
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {transactions.map((data) => (
          <div
            key={data._id}
            className="w-full p-6 bg-card/40 backdrop-blur-xl border border-border/40 rounded-3xl hover:bg-card/75 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden group hover:border-primary/30 flex flex-col justify-between h-52"
          >
            {/* Subtle glow effect */}
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -mr-6 -mt-6 transition-all opacity-30 group-hover:opacity-50 pointer-events-none ${
              data.type === 'income' ? 'bg-green-500/10' : 'bg-destructive/10'
            }`}></div>

            <div>
              {/* Top Row: Type tag & Date */}
              <div className="flex justify-between items-center mb-3.5 relative z-10">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                  data.type === 'income'
                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                    : 'bg-destructive/10 border-destructive/20 text-rose-400'
                }`}>
                  {data.type}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  {data.date}
                </span>
              </div>

              {/* Middle Row: Description & Category */}
              <div className="mb-2 max-w-[90%]">
                <h3 className="font-semibold text-foreground text-sm tracking-tight truncate" title={data.description}>
                  {data.description || 'No description'}
                </h3>
                <p className="text-[11px] text-muted-foreground capitalize mt-0.5 font-light">
                  {data.category?.replace('_', ' ')}
                </p>
              </div>
            </div>

            {/* Bottom Row: Amount & Actions */}
            <div className="flex items-end justify-between mt-auto z-10">
              <div className={`text-2xl font-bold tracking-tight font-outfit ${
                data.type === 'income' ? 'text-green-500' : 'text-rose-500'
              }`}>
                {data.type === 'income' ? '+' : '-'}${Number(data.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>

              <div className="flex items-center gap-1">
                {/* Details Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 text-muted-foreground hover:text-foreground cursor-pointer">
                      <Eye size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[450px] rounded-3xl border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl">
                  <DialogHeader className="pb-2">
                    <DialogTitle className="text-xl font-bold tracking-tight">
                      Transaction Details
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                      Full breakdown of the recorded transaction
                    </DialogDescription>
                  </DialogHeader>

                  {/* Receipt Header Visual */}
                  <div className="bg-secondary/35 border border-border/30 p-5 rounded-2xl text-center relative overflow-hidden my-4 shadow-inner">
                    <div className={`absolute top-0 right-0 w-16 h-16 rounded-full blur-xl -mr-4 -mt-4 opacity-25 ${
                      data.type === 'income' ? 'bg-green-500' : 'bg-destructive'
                    }`}></div>

                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                      data.type === 'income'
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : 'bg-destructive/10 border-destructive/20 text-rose-400'
                    }`}>
                      {data.type}
                    </span>
                    <h3 className="text-base font-bold text-foreground mt-2 truncate max-w-[90%] mx-auto" title={data.description}>
                      {data.description || 'No description'}
                    </h3>
                    <div className={`text-3xl font-bold tracking-tight font-outfit mt-1.5 ${
                      data.type === 'income' ? 'text-green-500' : 'text-rose-500'
                    }`}>
                      {data.type === 'income' ? '+' : '-'}${Number(data.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Posted on {data.date}
                    </p>
                  </div>

                  {/* Receipt Details Metadata */}
                  <div className="space-y-3.5 text-xs sm:text-sm">
                    <div className="flex justify-between items-center py-2.5 border-b border-border/20">
                      <span className="text-muted-foreground font-medium">Category</span>
                      <span className="font-semibold text-foreground capitalize bg-secondary/40 px-2.5 py-1 rounded-xl border border-border/30">
                        {data.category?.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-border/20">
                      <span className="text-muted-foreground font-medium">Owner Email</span>
                      <span className="font-semibold text-foreground/80 font-mono text-[11px]">{data.email}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-muted-foreground font-medium">Category Volume (All Records)</span>
                      <span className="font-bold text-primary">
                        ${totalBalanceByCategory(data.category).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <DialogFooter className="mt-6">
                    <DialogClose asChild>
                      <Button variant="outline" className="w-full rounded-2xl py-5 border-border/80 cursor-pointer text-xs font-semibold">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
                </Dialog>

                {/* Update Dialog */}
                <Dialog
                  onOpenChange={(isOpen) => {
                    if (isOpen) {
                      setSelectedType(data.type);
                      setCategory(data.category);
                      setDate(data.date ? new Date(data.date) : null);
                      setDescriptionInput(data.description);
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 text-muted-foreground hover:text-foreground cursor-pointer">
                      <Pencil size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[460px] rounded-3xl border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const form = e.target;
                      const updatedTransaction = {
                        type: selectedType,
                        category: shadCategory || data.category,
                        amount: parseFloat(form.amount.value),
                        description: descriptionInput,
                        date: shadDate ? format(shadDate, "yyyy-MM-dd") : data.date?.split("T")[0],
                      };

                      if (!updatedTransaction.description.trim()) {
                        toast.error('Description cannot be empty');
                        return;
                      }

                      try {
                        const res = await api.put(
                          `/transactions/update/${data._id}`,
                          updatedTransaction
                        );

                        if (res.data.modifiedCount > 0) {
                          toast.success("Transaction updated successfully!");
                          const updatedList = transactions.map((item) =>
                            item._id === data._id ? { ...item, ...updatedTransaction } : item
                          );
                          setTransactions(updatedList);
                        } else {
                          toast("No changes made.");
                        }
                      } catch (err) {
                        console.error(err);
                        toast.error("Error updating transaction.");
                      }
                    }}
                    className="space-y-5"
                  >
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold tracking-tight">Update Transaction</DialogTitle>
                      <DialogDescription className="text-xs text-muted-foreground">
                        Modify transaction fields below.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      {/* Segmented Pill Selector for Type */}
                      <div>
                        <span className="block mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Transaction Type
                        </span>
                        <div className="flex bg-secondary/35 p-1 rounded-2xl border border-border/20">
                          <button
                            type="button"
                            onClick={() => setSelectedType("income")}
                            className={`flex-grow flex items-center justify-center py-2 px-4 rounded-xl transition-all duration-300 font-semibold cursor-pointer text-xs border ${
                              selectedType === 'income'
                                ? 'bg-background text-green-500 shadow-xs border-border/10'
                                : 'bg-transparent text-muted-foreground hover:text-foreground border-transparent'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full bg-green-500 mr-2 transition-transform duration-300 ${selectedType === 'income' ? 'scale-125' : 'opacity-40'}`}></span>
                            Income
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedType("expense")}
                            className={`flex-grow flex items-center justify-center py-2 px-4 rounded-xl transition-all duration-300 font-semibold cursor-pointer text-xs border ${
                              selectedType === 'expense'
                                ? 'bg-background text-rose-500 shadow-xs border-border/10'
                                : 'bg-transparent text-muted-foreground hover:text-foreground border-transparent'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full bg-rose-500 mr-2 transition-transform duration-300 ${selectedType === 'expense' ? 'scale-125' : 'opacity-40'}`}></span>
                            Expense
                          </button>
                        </div>
                      </div>

                      <div>
                        <Label className="block mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Category
                        </Label>
                        <Select defaultValue={data.category} onValueChange={(value) => setCategory(value)}>
                          <SelectTrigger className="w-full rounded-xl border-border/40 bg-transparent text-sm h-11">
                            <SelectValue placeholder="Select your category" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {selectedType === "income" ? (
                              <SelectGroup>
                                <SelectLabel>Income Categories</SelectLabel>
                                <SelectItem value="salary">Salary</SelectItem>
                                <SelectItem value="freelance">Freelance & Side Hustles</SelectItem>
                                <SelectItem value="investments">Investments & Dividends</SelectItem>
                                <SelectItem value="gifts">Gifts & Grants</SelectItem>
                                <SelectItem value="commission">Commission & Bonuses</SelectItem>
                                <SelectItem value="other_income">Other Income</SelectItem>
                              </SelectGroup>
                            ) : (
                              <SelectGroup>
                                <SelectLabel>Expense Categories</SelectLabel>
                                <SelectItem value="rent">Rent & Housing</SelectItem>
                                <SelectItem value="utilities">Utilities</SelectItem>
                                <SelectItem value="groceries">Groceries</SelectItem>
                                <SelectItem value="food">Dining Out</SelectItem>
                                <SelectItem value="transport">Transportation</SelectItem>
                                <SelectItem value="health">Healthcare & Insurance</SelectItem>
                                <SelectItem value="entertainment">Entertainment & Leisure</SelectItem>
                                <SelectItem value="shopping">Shopping & Apparel</SelectItem>
                                <SelectItem value="education">Education</SelectItem>
                                <SelectItem value="travel">Travel</SelectItem>
                                <SelectItem value="savings">Savings & Investments</SelectItem>
                                <SelectItem value="other">Other Expenses</SelectItem>
                              </SelectGroup>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="amount" className="block mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Amount
                        </Label>
                        <Input
                          type="number"
                          id="amount"
                          name="amount"
                          defaultValue={data.amount}
                          step="0.01"
                          required
                          className="w-full p-4 h-11 rounded-xl border-border/40 focus-visible:ring-primary/40 focus-visible:ring-offset-0 bg-transparent text-foreground placeholder:text-muted-foreground text-sm"
                        />
                      </div>

                      <div>
                        <Label htmlFor="description" className="block mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Description
                        </Label>
                        <textarea
                          id="description"
                          name="description"
                          rows="2"
                          required
                          value={descriptionInput}
                          onChange={(e) => setDescriptionInput(e.target.value)}
                          placeholder="e.g. rent bill"
                          className="w-full p-4 rounded-xl border border-border/40 bg-transparent text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-muted-foreground text-sm"
                        />
                      </div>

                      <div>
                        <Label htmlFor="date" className="block mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal rounded-xl py-5.5 border-border/40 text-xs text-foreground bg-transparent"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                              {shadDate ? format(shadDate, "yyyy-MM-dd") : data.date ? data.date : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 rounded-2xl border-border/50 shadow-2xl">
                            <Calendar mode="single" selected={shadDate} onSelect={setDate} className="rounded-2xl" />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <DialogFooter className="gap-2 pt-2">
                      <DialogClose asChild>
                        <Button variant="outline" type="button" className="rounded-xl cursor-pointer text-xs font-semibold">
                          Cancel
                        </Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button type="submit" className="rounded-xl w-full md:w-auto cursor-pointer text-xs font-semibold">
                          Save Changes
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
                </Dialog>

                {/* Delete Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer">
                      <Trash2 size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[400px] text-center rounded-3xl border-border/50 bg-background/95 backdrop-blur-xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold tracking-tight text-center">Delete Transaction</DialogTitle>
                      <DialogDescription className="text-center">
                        Are you sure you want to delete this transaction? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex sm:justify-center gap-3 mt-4">
                      <DialogClose asChild>
                        <Button variant="outline" className="rounded-xl cursor-pointer">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          onClick={() => handleRemove(data._id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl cursor-pointer"
                        >
                          Confirm Delete
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionCard;
