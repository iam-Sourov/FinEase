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
import { Menu } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { user, setUser, LogOut } = useContext(AuthContext);
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
                <Link to="/" className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Fin-EASE
                </Link>
            </div>
            <div className="hidden md:flex items-center space-x-2">
                {navLinks}
            </div>

            <div className="hidden md:flex items-center gap-4">
                <ModeToggle />
                {user ?
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
                    :
                    <>
                        <Link to="/login">
                            <Button variant="ghost" className="rounded-full text-foreground/80 hover:text-foreground">Login</Button>
                        </Link>
                        <Link to="/signup">
                            <Button className="rounded-full px-6 shadow-md hover:shadow-lg transition-shadow">Signup</Button>
                        </Link>
                    </>
                }
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
                                <Link onClick={() => handleNavigate('/')} className="text-2xl tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                    Fin-EASE
                                </Link>
                            </SheetTitle>
                        </SheetHeader>

                        <div className="mt-8 flex flex-col space-y-2">
                            <button onClick={() => handleNavigate('/')} className="text-left px-4 py-3 rounded-2xl text-base font-medium text-foreground/80 hover:bg-secondary/50 hover:text-foreground transition-all">Home</button>
                            <button onClick={() => handleNavigate('/addTransaction')} className="text-left px-4 py-3 rounded-2xl text-base font-medium text-foreground/80 hover:bg-secondary/50 hover:text-foreground transition-all">Add Transaction</button>
                            <button onClick={() => handleNavigate('/myTransaction')} className="text-left px-4 py-3 rounded-2xl text-base font-medium text-foreground/80 hover:bg-secondary/50 hover:text-foreground transition-all">My Transactions</button>
                            <button onClick={() => handleNavigate('/reports')} className="text-left px-4 py-3 rounded-2xl text-base font-medium text-foreground/80 hover:bg-secondary/50 hover:text-foreground transition-all">Reports</button>

                            <div className="h-px w-full bg-border/50 my-4" />

                            {user ?
                                <>
                                    <button onClick={() => handleNavigate('/myProfile')} className="text-left px-4 py-3 rounded-2xl text-base font-medium text-foreground/80 hover:bg-secondary/50 hover:text-foreground transition-all">My Profile</button>
                                    <Button onClick={handleSignOut} variant="outline" className="w-full rounded-2xl mt-4 text-destructive border-destructive/20 hover:bg-destructive/10">
                                        Log Out
                                    </Button>
                                </>
                                :
                                <div className="flex flex-col gap-3 mt-4">
                                    <Button onClick={() => handleNavigate('/login')} variant="outline" className="w-full rounded-2xl py-6">
                                        Login
                                    </Button>
                                    <Button onClick={() => handleNavigate('/signup')} className="w-full rounded-2xl py-6 shadow-md">
                                        Signup
                                    </Button>
                                </div>
                            }
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
};

export default Navbar;
