import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { RiTwitterXLine } from "react-icons/ri";
import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full pt-16 pb-8 bg-background/80 backdrop-blur-xl border-t border-border/50 mt-20 relative z-10">
            <div className="container mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                    <div className="flex flex-col items-center md:items-start">
                        <div className="flex items-center mb-6">
                            <span className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Fin-EASE</span>
                        </div>
                        <p className="text-foreground/70 leading-relaxed max-w-xs">
                            Your journey to financial freedom starts here. Smart tracking, better living.
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-lg font-semibold mb-6 flex items-center text-foreground">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-foreground/70">
                            <li className="flex items-center justify-center md:justify-start hover:text-primary transition-colors cursor-pointer">
                                <Mail className="w-4 h-4 mr-3 shrink-0" />
                                mailMe@gmail.com
                            </li>
                            <li className="flex items-center justify-center md:justify-start hover:text-primary transition-colors cursor-pointer">
                                <Phone className="w-4 h-4 mr-3 shrink-0" />
                                01679------
                            </li>
                            <li className="flex items-center justify-center md:justify-start hover:text-primary transition-colors cursor-pointer">
                                <MapPin className="w-4 h-4 mr-3 shrink-0" />
                                NarayanGanj
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-lg font-semibold mb-6 text-foreground">Follow Us</h3>
                        <div className="flex justify-center md:justify-start space-x-5">
                            <a aria-label="Facebook" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary/10 hover:text-blue-500 transition-all cursor-pointer">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a aria-label="Twitter" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary/10 hover:text-foreground transition-all cursor-pointer">
                                <RiTwitterXLine className="w-5 h-5" />
                            </a>
                            <a aria-label="Instagram" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary/10 hover:text-pink-500 transition-all cursor-pointer">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary/10 hover:text-blue-600 transition-all cursor-pointer">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border/50 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Fin-EASE. All rights reserved.</p>
                    <a href="#" className="hover:text-foreground transition-colors mt-4 md:mt-0 font-medium tracking-wide">
                        Terms & Conditions
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;