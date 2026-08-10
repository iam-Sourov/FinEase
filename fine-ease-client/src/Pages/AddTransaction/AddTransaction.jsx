import React, { useContext, useState } from 'react';
import { Button } from "@/components/ui/button"
import { AuthContext } from '../../Contexts/AuthContext';
import api from '../../lib/api';
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import toast from 'react-hot-toast';

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { useNavigate } from 'react-router';
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const AddTransaction = () => {
  const { user } = useContext(AuthContext);
  const [shadCategory, setCategory] = useState('');
  const [shadDate, setDate] = useState()
  const [selectedType, setSelectedType] = useState('income');
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  const handleAddToTransaction = async (e) => {
    e.preventDefault()
    if (!selectedType) {
      toast.error('Please select a transaction type');
      return;
    }
    if (!shadCategory) {
      toast.error('Please select a category');
      return;
    }
    if (!shadDate) {
      toast.error('Please select a date');
      return;
    }

    const form = e.target;
    const amount = parseFloat(form.amount.value);
    const description = form.description.value;
    const email = form.email.value;
    const name = form.name.value;

    const newTransaction = {
      type: selectedType,
      category: shadCategory,
      amount: amount,
      description: description,
      date: format(shadDate, "yyyy-MM-dd"),
      email: email,
      name: name
    }
    try {
      setLoading(true)
      await api.post(`/add-Transaction`, newTransaction);
      toast.success('Successfully Added A Transaction')
      navigate('/myTransaction')
    } catch (err) {
      console.log(err)
      setLoading(false)
      toast.error("Failed To Add Transaction")
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen py-12 bg-background flex items-center justify-center">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6">
        <div className="bg-card/40 backdrop-blur-xl border border-border/40 p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[80px] -mr-10 -mt-10"></div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 tracking-tight text-foreground font-outfit">
            Add a New Transaction
          </h2>
          
          <form onSubmit={handleAddToTransaction} className="space-y-6">
            {/* Transaction Type Segmented Pill Toggle */}
            <div>
              <span className="block mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Transaction Type
              </span>
              <div className="flex bg-secondary/35 p-1 rounded-2xl border border-border/20">
                <button
                  type="button"
                  onClick={() => setSelectedType("income")}
                  className={`flex-grow flex items-center justify-center py-2.5 px-4 rounded-xl transition-all duration-300 font-semibold cursor-pointer text-xs border ${
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
                  className={`flex-grow flex items-center justify-center py-2.5 px-4 rounded-xl transition-all duration-300 font-semibold cursor-pointer text-xs border ${
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
              <label className="block mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </label>
              <Select onValueChange={(value) => setCategory(value)}>
                <SelectTrigger className="w-full rounded-xl border-border/40 bg-transparent text-xs sm:text-sm h-11">
                  <SelectValue placeholder="Select your category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  {selectedType === "income" ? (
                    <SelectGroup>
                      <SelectLabel>Income Categories</SelectLabel>
                      <SelectItem className="rounded-xl text-xs sm:text-sm" value="salary">Salary</SelectItem>
                      <SelectItem className="rounded-xl text-xs sm:text-sm" value="freelance">Freelance & Side Hustles</SelectItem>
                      <SelectItem className="rounded-xl text-xs sm:text-sm" value="investments">Investments & Dividends</SelectItem>
                      <SelectItem className="rounded-xl text-xs sm:text-sm" value="gifts">Gifts & Grants</SelectItem>
                      <SelectItem className="rounded-xl text-xs sm:text-sm" value="commission">Commission & Bonuses</SelectItem>
                      <SelectItem className="rounded-xl text-xs sm:text-sm" value="other_income">Other Income</SelectItem>
                    </SelectGroup>
                  ) : (
                    <SelectGroup>
                      <SelectLabel>Expense Categories</SelectLabel>
                      <SelectItem className="rounded-xl text-xs sm:text-sm" value="rent">Rent & Housing</SelectItem>
                      <SelectItem className="rounded-xl text-xs sm:text-sm" value="utilities">Utilities</SelectItem>
                      <SelectItem className="rounded-xl text-xs sm:text-sm" value="groceries">Groceries</SelectItem>
                      <SelectItem className="rounded-xl text-xs sm:text-sm" value="food">Dining Out</SelectItem>
                      <SelectItem className="rounded-xl text-xs sm:text-sm" value="transport">Transportation</SelectItem>
                      <SelectItem className="rounded-xl text-xs sm:text-sm" value="health">Healthcare & Insurance</SelectItem>
                      <SelectItem className="rounded-xl text-xs sm:text-sm" value="entertainment">Entertainment & Leisure</SelectItem>
                      <SelectItem className="rounded-xl text-xs sm:text-sm" value="shopping">Shopping & Apparel</SelectItem>
                      <SelectItem className="rounded-xl text-xs sm:text-sm" value="education">Education</SelectItem>
                      <SelectItem className="rounded-xl text-xs sm:text-sm" value="travel">Travel</SelectItem>
                      <SelectItem className="rounded-xl text-xs sm:text-sm" value="savings">Savings & Investments</SelectItem>
                      <SelectItem className="rounded-xl text-xs sm:text-sm" value="other">Other Expenses</SelectItem>
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="amount" className="block mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Amount
              </label>
              <Input
                type="number"
                id="amount"
                name="amount"
                placeholder="0.00"
                step="0.01"
                required
                className="w-full p-4 h-11 rounded-xl border-border/40 focus-visible:ring-primary/40 focus-visible:ring-offset-0 bg-transparent text-foreground placeholder:text-muted-foreground text-xs sm:text-sm" />
            </div>

            <div>
              <label htmlFor="description" className="block mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="2"
                required
                placeholder="e.g., Weekly groceries at store"
                className="w-full p-4 rounded-xl border border-border/40 bg-transparent text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-muted-foreground text-xs sm:text-sm" />
            </div>

            <div>
              <label htmlFor="date" className="block mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!shadDate}
                    className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal rounded-xl py-5.5 border-border/40 text-xs text-foreground bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                    {shadDate ? format(shadDate, "yyyy-MM-dd") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl border-border/50 shadow-2xl">
                  <Calendar mode="single" selected={shadDate} onSelect={setDate} className="rounded-2xl" />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label htmlFor="userName" className="block mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  User Name
                </label>
                <Input
                  type="text"
                  id="userName"
                  name="name"
                  value={user?.displayName || ''}
                  readOnly
                  className="w-full p-4 h-11 rounded-xl border-border/30 bg-secondary/20 cursor-not-allowed opacity-60 text-muted-foreground text-xs sm:text-sm" />
              </div>
              <div>
                <label htmlFor="userEmail" className="block mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  User Email
                </label>
                <Input
                  type="email"
                  id="userEmail"
                  name="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full p-4 h-11 rounded-xl border-border/30 bg-secondary/20 cursor-not-allowed opacity-60 text-muted-foreground text-xs sm:text-sm" />
              </div>
            </div>

            <Button
              disabled={loading}
              type="submit"
              className="w-full py-5.5 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer text-xs sm:text-sm mt-2">
              {loading ? <Spinner /> : "Add Transaction"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;