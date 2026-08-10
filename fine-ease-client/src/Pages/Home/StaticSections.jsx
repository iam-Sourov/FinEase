import { ChartLine, Lightbulb, CheckCircle2 } from 'lucide-react';
import React from 'react';

const StaticSections = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-24 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Budgeting Tips Section */}
                <div className="p-10 bg-background/60 backdrop-blur-3xl rounded-3xl border border-border/50 shadow-xl shadow-black/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl transition-all group-hover:bg-yellow-500/20"></div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center tracking-tight">
                        <div className="p-3 bg-yellow-500/10 rounded-2xl mr-4 border border-yellow-500/20">
                            <Lightbulb className="w-6 h-6 text-yellow-500" />
                        </div>
                        Budgeting Tips
                    </h2>
                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 mr-3 shrink-0" />
                            <span className="text-foreground/80 leading-relaxed"><strong className="text-foreground font-semibold">Track Every Penny:</strong> Use an app or a simple notebook to monitor expenses.</span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 mr-3 shrink-0" />
                            <span className="text-foreground/80 leading-relaxed"><strong className="text-foreground font-semibold">The 50/30/20 Rule:</strong> 50% for Needs, 30% for Wants, 20% for Savings.</span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 mr-3 shrink-0" />
                            <span className="text-foreground/80 leading-relaxed"><strong className="text-foreground font-semibold">Set Realistic Goals:</strong> Don't try to cut everything at once. Start small.</span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 mr-3 shrink-0" />
                            <span className="text-foreground/80 leading-relaxed"><strong className="text-foreground font-semibold">Review Weekly:</strong> Check in on your spending to stay on track consistently.</span>
                        </li>
                    </ul>
                </div>

                {/* Why Financial Planning Matters Section */}
                <div className="p-10 bg-background/60 backdrop-blur-3xl rounded-3xl border border-border/50 shadow-xl shadow-black/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-green-500/10 rounded-full blur-3xl transition-all group-hover:bg-green-500/20"></div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center tracking-tight">
                        <div className="p-3 bg-green-500/10 rounded-2xl mr-4 border border-green-500/20">
                            <ChartLine className="w-6 h-6 text-green-500" />
                        </div>
                        Why Financial Planning Matters
                    </h2>
                    <div className="space-y-5 text-foreground/80 leading-relaxed">
                        <p>
                            Financial planning is the roadmap to achieving your life goals.
                            It's not just about saving money; it's about <strong className="text-foreground font-medium">making your money work for you</strong>.
                        </p>
                        <p>
                            Whether you're saving for a house, planning for retirement, or building an emergency fund, a solid plan provides security, reduces financial stress, and gives you the freedom to live the life you want.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaticSections;