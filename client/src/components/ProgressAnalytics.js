import { useState, useEffect } from "react";
import api from "../api";

const Card = ({ className = "", children }) => (
    <div className={`bg-card/70 backdrop-blur border border-white/5 rounded-2xl shadow-soft p-4 ${className}`}>
        {children}
    </div>
);

export default function ProgressAnalytics({ goal }) {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (goal?._id) {
            fetchAnalytics();
        }
    }, [goal]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            // This would be a real API call in production
            // For now, we'll calculate analytics from the goal data
            const completedChunks = goal.chunks?.filter(c => c.completed) || [];
            const totalChunks = goal.chunks?.length || 0;
            const progressPercentage = totalChunks > 0 ? Math.round((completedChunks.length / totalChunks) * 100) : 0;
            
            // Calculate estimated completion date
            const startDate = new Date(goal.createdAt);
            const weeksCompleted = completedChunks.length;
            const totalWeeks = goal.durationWeeks;
            const estimatedCompletion = new Date(startDate.getTime() + (totalWeeks * 7 * 24 * 60 * 60 * 1000));
            
            // Calculate learning velocity (chunks per week)
            const daysSinceStart = Math.max(1, Math.floor((Date.now() - startDate.getTime()) / (24 * 60 * 60 * 1000)));
            const weeksSinceStart = Math.max(1, daysSinceStart / 7);
            const learningVelocity = weeksSinceStart > 0 ? (completedChunks.length / weeksSinceStart).toFixed(1) : 0;
            
            setAnalytics({
                progressPercentage,
                completedChunks: completedChunks.length,
                totalChunks,
                estimatedCompletion,
                learningVelocity,
                daysSinceStart: Math.floor(daysSinceStart),
                streak: Math.min(completedChunks.length, 7) // Mock streak
            });
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!goal || loading) {
        return (
            <Card>
                <div className="animate-pulse">
                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                    <div className="h-3 bg-white/5 rounded"></div>
                </div>
            </Card>
        );
    }

    if (!analytics) return null;

    return (
        <div className="space-y-4">
            <Card>
                <h3 className="text-lg font-semibold mb-4">Progress Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-2xl font-bold text-accent">{analytics.progressPercentage}%</div>
                        <div className="text-sm text-white/60">Complete</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-400">{analytics.completedChunks}</div>
                        <div className="text-sm text-white/60">of {analytics.totalChunks} weeks</div>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                            className="bg-gradient-to-r from-accent to-cyan-400 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${analytics.progressPercentage}%` }}
                        ></div>
                    </div>
                </div>
            </Card>

            <Card>
                <h3 className="text-lg font-semibold mb-4">Learning Metrics</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-white/70">Learning Velocity</span>
                        <span className="font-semibold">{analytics.learningVelocity} weeks/week</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-white/70">Current Streak</span>
                        <span className="font-semibold text-green-400">{analytics.streak} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-white/70">Days Active</span>
                        <span className="font-semibold">{analytics.daysSinceStart} days</span>
                    </div>
                </div>
            </Card>

            <Card>
                <h3 className="text-lg font-semibold mb-4">Timeline</h3>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-white/70">Started</span>
                        <span className="text-sm">{new Date(goal.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-white/70">Target Completion</span>
                        <span className="text-sm">{analytics.estimatedCompletion.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-white/70">Check-in Frequency</span>
                        <span className="text-sm capitalize">{goal.checkinFrequency}</span>
                    </div>
                </div>
            </Card>

            {analytics.completedChunks > 0 && (
                <Card>
                    <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
                    <div className="space-y-2">
                        {goal.chunks?.filter(c => c.completed).slice(-3).map((chunk, index) => (
                            <div key={chunk.weekIndex} className="flex items-center gap-3 p-2 bg-green-500/10 rounded-lg">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-xs">✓</span>
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium">{chunk.title}</div>
                                    <div className="text-xs text-white/60">{chunk.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}

