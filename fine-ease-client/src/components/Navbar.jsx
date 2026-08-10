import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { AuthContext } from '../Contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { ModeToggle } from './mode-toggle';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { user, setUser, LogOut, loading } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleSignOut = () => {
        LogOut()
            .then(() => {
                setUser(null);
                setOpen(false);
            })
            .catch((err) => {
                console.error(err);
                toast.error('Failed to sign out', err.message);
            });
    };

    const handleNavigate = (path) => {
        setOpen(false);
        navigate(path);
    };

    const navLinkClass = ({ isActive }) =>
        `transition-all duration-300 ease-in-out px-4 py-2 rounded-full text-sm font-medium ${isActive
            ? 'bg-primary/10 text-primary shadow-sm'
            : 'text-foreground/70 hover:text-foreground hover:bg-secondary/50'
        }`;

    const mobileNavLinkClass = ({ isActive }) =>
        `text-left px-4 py-3 rounded-2xl text-base font-medium transition-all duration-300 ${isActive
            ? 'bg-primary/10 text-primary font-semibold'
            : 'text-foreground/80 hover:bg-secondary/50 hover:text-foreground'
        }`;

    const navLinks = (
        <>
            <NavLink to="/" className={navLinkClass}>
                Home
            </NavLink>
            <NavLink to="/addTransaction" className={navLinkClass}>
                Add Transaction
            </NavLink>
            <NavLink to="/myTransaction" className={navLinkClass}>
                My Transactions
            </NavLink>
            <NavLink to="/reports" className={navLinkClass}>
                Reports
            </NavLink>
        </>
    );

    return (
        <div className="sticky top-0 z-50 w-full flex justify-between items-center bg-background/70 backdrop-blur-xl border-b border-border/40 px-6 py-3 shadow-sm transition-all duration-300">
            <div>
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="p-2.5 bg-primary/10 text-primary border border-primary/20 rounded-2xl group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300 shadow-inner">
                        <Wallet className="h-5 w-5" />
                    </div>
                    <span className="hidden sm:inline-block text-2xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/95 to-indigo-500 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        FinEase
                    </span>
                </Link>
            </div>
            <div className="hidden md:flex items-center space-x-2">
                {navLinks}
            </div>

            <div className="hidden md:flex items-center gap-4">
                <ModeToggle />
                {loading ? (
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-20 bg-secondary/60 rounded-full animate-pulse"></div>
                        <div className="h-9 w-20 bg-secondary/60 rounded-full animate-pulse"></div>
                    </div>
                ) : user ? (
                    <div className="flex items-center gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" className="rounded-full px-5">Account</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl border-border/50">
                                <DropdownMenuLabel className="font-normal text-muted-foreground text-xs">My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="rounded-xl cursor-pointer">
                                    <Link className="w-full text-sm font-medium" to="/myProfile">My Profile</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button onClick={handleSignOut} variant="outline" className="rounded-full text-destructive border-destructive/20 hover:bg-destructive/10">
                            Log Out
                        </Button>
                    </div>
                ) : (
                    <>
                        <Link to="/login">
                            <Button variant="ghost" className="rounded-full text-foreground/80 hover:text-foreground">Login</Button>
                        </Link>
                        <Link to="/signup">
                            <Button className="rounded-full px-6 shadow-md hover:shadow-lg transition-shadow">Signup</Button>
                        </Link>
                    </>
                )}
            </div>

            <div className="md:hidden flex items-center space-x-3">
                <ModeToggle />
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Menu className="h-6 w-6 text-foreground/80" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full p-6 sm:w-80 rounded-l-3xl border-l-border/50 bg-background/95 backdrop-blur-xl">
                        <SheetHeader>
                            <SheetTitle className="text-left font-bold mt-2">
                                <Link onClick={() => handleNavigate('/')} className="flex items-center gap-2 group">
                                    <div className="p-2 bg-primary/10 text-primary border border-primary/20 rounded-xl">
                                        <Wallet className="h-4.5 w-4.5" />
                                    </div>
                                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/95 to-indigo-500 bg-clip-text text-transparent" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                        FinEase
                                    </span>
                                </Link>
                            </SheetTitle>
                        </SheetHeader>

                        <div className="mt-8 flex flex-col space-y-2">
                            <NavLink to="/" onClick={() => setOpen(false)} className={mobileNavLinkClass}>Home</NavLink>
                            <NavLink to="/addTransaction" onClick={() => setOpen(false)} className={mobileNavLinkClass}>Add Transaction</NavLink>
                            <NavLink to="/myTransaction" onClick={() => setOpen(false)} className={mobileNavLinkClass}>My Transactions</NavLink>
                            <NavLink to="/reports" onClick={() => setOpen(false)} className={mobileNavLinkClass}>Reports</NavLink>

                            <div className="h-px w-full bg-border/50 my-4" />

                            {loading ? (
                                <div className="flex flex-col gap-3 mt-4">
                                    <div className="h-10 w-full bg-secondary/60 rounded-xl animate-pulse"></div>
                                    <div className="h-10 w-full bg-secondary/60 rounded-xl animate-pulse"></div>
                                </div>
                            ) : user ? (
                                <>
                                    <NavLink to="/myProfile" onClick={() => setOpen(false)} className={mobileNavLinkClass}>My Profile</NavLink>
                                    <Button onClick={handleSignOut} variant="outline" className="w-full rounded-2xl mt-4 text-destructive border-destructive/20 hover:bg-destructive/10">
                                        Log Out
                                    </Button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-3 mt-4">
                                    <Button onClick={() => handleNavigate('/login')} variant="outline" className="w-full rounded-2xl py-6">
                                        Login
                                    </Button>
                                    <Button onClick={() => handleNavigate('/signup')} className="w-full rounded-2xl py-6 shadow-md">
                                        Signup
                                    </Button>
                                </div>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
};

export default Navbar;
