import React from 'react';

const Banner = () => {
    return (
        <div className="relative w-full min-h-[55vh] flex items-center justify-center text-center px-4 overflow-hidden bg-background">
            {/* Subtle mesh gradient background effect */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-70"></div>
                <div className="absolute top-20 right-20 w-80 h-80 bg-chart-1/20 rounded-full blur-[100px] opacity-50"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto pb-16 pt-8">
                <span className="inline-block py-1 px-3 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6 border border-border">
                    Smart Financial Tracking
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-foreground">
                    Take Control of Your <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Finances.</span>
                </h1>
                <p className="text-lg md:text-2xl mt-6 font-light text-muted-foreground max-w-2xl mx-auto">
                    Your journey to financial freedom starts today. Simplify your life with intuitive tracking and intelligent insights.
                </p>
            </div>
        </div>
    );
};

export default Banner;