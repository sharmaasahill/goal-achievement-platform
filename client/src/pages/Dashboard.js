import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import ProgressAnalytics from "../components/ProgressAnalytics";
import Calendar from "../components/Calendar";
import NotificationCenter from "../components/NotificationCenter";
import VideoChat from "../components/VideoChat";
import RealtimeChat from "../components/RealtimeChat";

const Button = ({ className = "", children, ...props }) => (
    <button className={`px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition ${className}`} {...props}>{children}</button>
);
const Input = ({ className = "", ...props }) => (
    <input className={`w-full bg-panel/60 border border-white/10 rounded-xl px-3 py-2 focus:outline-none 
                     focus:ring-2 focus:ring-accent/40 placeholder-white/40 ${className}`} {...props} />
);
const Textarea = (props) => <textarea className="w-full min-h-[90px] bg-panel/60 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 placeholder-white/40" {...props} />;

export default function Dashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [goals, setGoals] = useState([]);
    const [activeGoal, setActiveGoal] = useState(null);   // goal object
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("active");
    const [selectedDate, setSelectedDate] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showVideoChat, setShowVideoChat] = useState(false);
    const [showRealtimeChat, setShowRealtimeChat] = useState(false);
    const endRef = useRef(null);

    useEffect(() => { fetchGoals(); }, []);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
    useEffect(() => { if (activeGoal?._id) fetchHistory(activeGoal._id); }, [activeGoal]);

    const fetchGoals = async () => {
        try {
            setLoading(true);
            setError("");
            const { data } = await api.get("/goals");
            setGoals(data);
            if (data[0]) setActiveGoal(data[0]);
        } catch (error) {
            setError("Failed to load goals");
            console.error("Error fetching goals:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async (goalId) => {
        if (!goalId) return;
        try {
            const { data } = await api.get(`/ai/history/${goalId}`);
            setMessages(data);
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    };


    const send = async () => {
        if (!input.trim() || !activeGoal?._id) return;
        
        const userMsg = { role: "user", text: input };
        setMessages((m) => [...m, userMsg]);
        setInput("");
        
        try {
            const { data } = await api.post("/ai/reply", { goalId: activeGoal._id, text: userMsg.text });
            setMessages((m) => [...m, { role: "assistant", text: data.text }]);
        } catch (error) {
            setError("Failed to send message");
            console.error("Error sending message:", error);
            // Remove the user message if sending failed
            setMessages((m) => m.slice(0, -1));
            setInput(userMsg.text); // Restore the input
        }
    };

    const toggleChunk = async (weekIndex, completed) => {
        if (!activeGoal?._id) return;
        try {
            const { data } = await api.patch(`/goals/${activeGoal._id}/chunk/${weekIndex}`, { completed });
            setActiveGoal(data);
            // also update list
            setGoals((gs) => gs.map(g => g._id === data._id ? data : g));
        } catch (error) {
            setError("Failed to update progress");
            console.error("Error updating chunk:", error);
        }
    };

    const deleteGoal = async () => {
        if (!activeGoal?._id) return;
        
        try {
            await api.delete(`/goals/${activeGoal._id}`);
            setGoals(goals.filter(g => g._id !== activeGoal._id));
            setActiveGoal(goals.length > 1 ? goals.find(g => g._id !== activeGoal._id) : null);
            setShowDelete(false);
            setMessages([]);
        } catch (error) {
            setError("Failed to delete goal");
            console.error("Error deleting goal:", error);
        }
    };

    const duplicateGoal = async () => {
        if (!activeGoal) return;
        
        try {
            const { data } = await api.post("/goals", {
                title: `${activeGoal.title} (Copy)`,
                description: activeGoal.description,
                durationWeeks: activeGoal.durationWeeks
            });
            setGoals([data, ...goals]);
            setActiveGoal(data);
        } catch (error) {
            setError("Failed to duplicate goal");
            console.error("Error duplicating goal:", error);
        }
    };

    const archiveGoal = async () => {
        if (!activeGoal?._id) return;
        
        try {
            const { data } = await api.patch(`/goals/${activeGoal._id}`, { 
                status: 'archived' 
            });
            setGoals(goals.map(g => g._id === activeGoal._id ? data : g));
            setActiveGoal(data);
        } catch (error) {
            setError("Failed to archive goal");
            console.error("Error archiving goal:", error);
        }
    };

    const markAsComplete = async () => {
        if (!activeGoal?._id) return;
        
        try {
            const { data } = await api.patch(`/goals/${activeGoal._id}`, { 
                status: 'completed',
                progress: 100
            });
            setGoals(goals.map(g => g._id === activeGoal._id ? data : g));
            setActiveGoal(data);
        } catch (error) {
            setError("Failed to mark goal as complete");
            console.error("Error completing goal:", error);
        }
    };

    const reactivateGoal = async () => {
        if (!activeGoal?._id) return;
        
        try {
            const { data } = await api.patch(`/goals/${activeGoal._id}`, { 
                status: 'active' 
            });
            setGoals(goals.map(g => g._id === activeGoal._id ? data : g));
            setActiveGoal(data);
        } catch (error) {
            setError("Failed to reactivate goal");
            console.error("Error reactivating goal:", error);
        }
    };

    const exportGoal = () => {
        if (!activeGoal) return;
        
        const exportData = {
            goal: {
                title: activeGoal.title,
                description: activeGoal.description,
                durationWeeks: activeGoal.durationWeeks,
                progress: activeGoal.progress,
                createdAt: activeGoal.createdAt
            },
            chunks: activeGoal.chunks,
            messages: messages,
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeGoal.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const logout = () => {
        localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/");
    };

    return (
        <div className="h-screen grid grid-cols-[300px_1fr]">
            {/* Sidebar */}
            <aside className="bg-panel/80 border-r border-white/10 p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-white/70">Signed in as</div>
                    <div className="flex gap-2">
                        <Button onClick={() => setShowNotifications(true)} className="text-sm" title="Notifications">
                            Notifications
                        </Button>
                        <Button onClick={logout} className="text-sm">Logout</Button>
                    </div>
                </div>
                <div className="font-semibold">{user?.name || "User"}</div>

                <div className="space-y-2">
                    <Button className="w-full" onClick={() => setShowNew(true)}>+ New Goal</Button>
                    {activeGoal && (
                        <>
                            <Button className="w-full" onClick={() => setShowAnalytics(true)}>
                                Analytics
                            </Button>
                            <Button className="w-full" onClick={() => setShowCalendar(true)}>
                                Calendar
                            </Button>
                            <Button className="w-full" onClick={() => setShowVideoChat(true)}>
                                Video Chat
                            </Button>
                            <Button className="w-full" onClick={() => setShowRealtimeChat(true)}>
                                Real-time Chat
                            </Button>
                            <div className="border-t border-white/10 pt-2">
                                <div className="text-xs uppercase tracking-wider text-white/40 mb-2">Goal Actions</div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button className="text-xs" onClick={() => setShowEdit(true)}>
                                        Edit
                                    </Button>
                                    <Button className="text-xs" onClick={duplicateGoal}>
                                        Copy
                                    </Button>
                                    <Button className="text-xs" onClick={exportGoal}>
                                        Export
                                    </Button>
                                    {activeGoal.status === "active" ? (
                                        <Button className="text-xs" onClick={archiveGoal}>
                                            Archive
                                        </Button>
                                    ) : (
                                        <Button className="text-xs" onClick={reactivateGoal}>
                                            Reactivate
                                        </Button>
                                    )}
                                </div>
                                {activeGoal.status === "active" && (
                                    <Button 
                                        className="w-full mt-2 text-xs bg-green-500/20 hover:bg-green-500/30 border-green-500/30 text-green-300" 
                                        onClick={markAsComplete}
                                    >
                                        ✅ Mark Complete
                                    </Button>
                                )}
                                <Button 
                                    className="w-full mt-2 text-xs bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-300" 
                                    onClick={() => setShowDelete(true)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </>
                    )}
                </div>

                <div className="text-xs uppercase tracking-wider text-white/40 mt-2">Your Journeys</div>
                
                <div className="mb-3">
                    <select 
                        className="w-full bg-panel/60 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="active">Active Goals</option>
                        <option value="archived">Archived Goals</option>
                        <option value="completed">Completed Goals</option>
                        <option value="all">All Goals</option>
                    </select>
                </div>
                
                <div className="space-y-2 overflow-auto">
                    {goals
                        .filter(g => statusFilter === "all" || g.status === statusFilter)
                        .map(g => (
                        <div key={g._id}
                            className={`p-3 rounded-xl border cursor-pointer ${activeGoal?._id === g._id ? "bg-white/15 border-white/20" : "bg-white/5 border-white/10 hover:bg-white/10"} ${g.status === "archived" ? "opacity-60" : ""}`}
                            onClick={() => setActiveGoal(g)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium">{g.title}</div>
                                {g.status === "archived" && <span className="text-xs text-white/40">📁</span>}
                                {g.status === "completed" && <span className="text-xs text-green-400">✓</span>}
                            </div>
                            <div className="text-white/40 text-xs mt-1">{g.durationWeeks} weeks • {g.checkinFrequency}</div>
                            <div className="w-full h-1 bg-white/10 rounded mt-2">
                                <div className="h-1 bg-accent rounded" style={{ width: `${g.progress || 0}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main */}
            <main className="flex flex-col h-full">
                <div className="border-b border-white/10 px-6 py-3 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-semibold">{activeGoal?.title || "Goal Tutor"}</h2>
                            {activeGoal?.status === "archived" && <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">Archived</span>}
                            {activeGoal?.status === "completed" && <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">Completed</span>}
                        </div>
                        <p className="text-white/60 text-sm">Break big goals into weekly plans with an AI coach</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {activeGoal && <ChunkStrip goal={activeGoal} onToggle={toggleChunk} />}
                        {activeGoal && (
                            <div className="flex gap-2">
                                <Button className="text-xs" onClick={() => setShowEdit(true)} title="Edit Goal">
                                    Edit
                                </Button>
                                <Button className="text-xs" onClick={duplicateGoal} title="Duplicate Goal">
                                    Copy
                                </Button>
                                <Button className="text-xs" onClick={exportGoal} title="Export Goal">
                                    Export
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="mx-6 mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                        {error}
                        <button 
                            onClick={() => setError("")} 
                            className="ml-2 text-red-400 hover:text-red-300"
                        >
                            ×
                        </button>
                    </div>
                )}

                {loading && (
                    <div className="mx-6 mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 text-sm">
                        Loading...
                    </div>
                )}

                <div className="flex-1 overflow-auto px-6 py-6 space-y-4">
                    {messages.map((m, i) => <Message key={i} role={m.role} text={m.text} />)}
                    <div ref={endRef} />
                </div>

                <div className="border-t border-white/10 p-4">
                    <div className="max-w-3xl mx-auto flex items-center gap-2">
                        <Input placeholder={`Ask about "${activeGoal?.title || "your goal"}"...`} value={input}
                            onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
                        <Button onClick={send}>Send</Button>
                    </div>
                    <p className="text-center text-white/40 text-xs mt-2">Chats are stored per goal to generate progress summaries.</p>
                </div>
            </main>

            {showNew && <NewGoalModal onClose={() => setShowNew(false)} onCreated={(g) => { setShowNew(false); setGoals([g, ...goals]); setActiveGoal(g); }} />}
            
            {showEdit && activeGoal && (
                <EditGoalModal 
                    goal={activeGoal} 
                    onClose={() => setShowEdit(false)} 
                    onUpdated={(updatedGoal) => {
                        setShowEdit(false);
                        setGoals(goals.map(g => g._id === updatedGoal._id ? updatedGoal : g));
                        setActiveGoal(updatedGoal);
                    }} 
                />
            )}
            
            {showDelete && activeGoal && (
                <DeleteConfirmModal 
                    goal={activeGoal} 
                    onClose={() => setShowDelete(false)} 
                    onConfirm={deleteGoal} 
                />
            )}
            
            {showAnalytics && activeGoal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur grid place-items-center p-4 z-50">
                    <div className="w-full max-w-2xl max-h-[80vh] overflow-auto bg-card/80 border border-white/10 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Progress Analytics</h2>
                            <Button onClick={() => setShowAnalytics(false)}>Close</Button>
                        </div>
                        <ProgressAnalytics goal={activeGoal} />
                    </div>
                </div>
            )}
            
            {showCalendar && activeGoal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur grid place-items-center p-4 z-50">
                    <div className="w-full max-w-md bg-card/80 border border-white/10 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Check-in Calendar</h2>
                            <Button onClick={() => setShowCalendar(false)}>Close</Button>
                        </div>
                        <Calendar 
                            goal={activeGoal} 
                            onDateSelect={setSelectedDate}
                            selectedDate={selectedDate}
                        />
                    </div>
                </div>
            )}
            
            {showNotifications && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur grid place-items-center p-4 z-50">
                    <div className="w-full max-w-md bg-card/80 border border-white/10 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Notifications</h2>
                            <Button onClick={() => setShowNotifications(false)}>Close</Button>
                        </div>
                        <NotificationCenter userId={user?.id} />
                    </div>
                </div>
            )}
            
            {showVideoChat && activeGoal && (
                <VideoChat 
                    goal={activeGoal} 
                    onClose={() => setShowVideoChat(false)} 
                />
            )}
            
            {showRealtimeChat && activeGoal && (
                <RealtimeChat 
                    goal={activeGoal} 
                    userId={user?.id}
                    onClose={() => setShowRealtimeChat(false)} 
                />
            )}
        </div>
    );
}

function ChunkStrip({ goal, onToggle }) {
    return (
        <div className="hidden md:flex items-center gap-2">
            {goal.chunks?.slice(0, Math.min(8, goal.chunks.length)).map(c => (
                <button key={c.weekIndex}
                    className={`w-6 h-6 rounded border ${c.completed ? "bg-accent/80 border-accent" : "bg-white/5 border-white/10"} `}
                    title={`Week ${c.weekIndex}: ${c.title}`}
                    onClick={() => onToggle(c.weekIndex, !c.completed)}
                />
            ))}
            {goal.chunks?.length > 8 && <span className="text-white/50 text-xs">+{goal.chunks.length - 8}</span>}
        </div>
    );
}

function NewGoalModal({ onClose, onCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [durationWeeks, setDurationWeeks] = useState("");

    const createGoal = async () => {
        const { data } = await api.post("/goals", {
            title, description, durationWeeks: durationWeeks ? Number(durationWeeks) : undefined
        });
        onCreated(data);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur grid place-items-center p-4">
            <div className="w-full max-w-lg bg-card/80 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Create New Goal</h3>
                <div className="space-y-3">
                    <Input placeholder="Goal title (e.g., Become a Data Scientist)" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <Textarea placeholder="Short description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <div className="flex gap-3">
                        <Input type="number" min="6" max="24" placeholder="Duration (weeks, optional)" value={durationWeeks} onChange={(e) => setDurationWeeks(e.target.value)} />
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-5">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={createGoal}>Create</Button>
                </div>
            </div>
        </div>
    );
}

function EditGoalModal({ goal, onClose, onUpdated }) {
    const [title, setTitle] = useState(goal.title);
    const [description, setDescription] = useState(goal.description);
    const [durationWeeks, setDurationWeeks] = useState(goal.durationWeeks);
    const [checkinFrequency, setCheckinFrequency] = useState(goal.checkinFrequency);
    const [loading, setLoading] = useState(false);

    const updateGoal = async () => {
        setLoading(true);
        try {
            const { data } = await api.patch(`/goals/${goal._id}`, {
                title, description, durationWeeks: Number(durationWeeks), checkinFrequency
            });
            onUpdated(data);
        } catch (error) {
            console.error("Error updating goal:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur grid place-items-center p-4 z-50">
            <div className="w-full max-w-lg bg-card/80 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Edit Goal</h3>
                <div className="space-y-3">
                    <Input 
                        placeholder="Goal title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                    />
                    <Textarea 
                        placeholder="Description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <Input 
                            type="number" 
                            min="6" 
                            max="24" 
                            placeholder="Duration (weeks)" 
                            value={durationWeeks} 
                            onChange={(e) => setDurationWeeks(e.target.value)} 
                        />
                        <select 
                            className="w-full bg-panel/60 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
                            value={checkinFrequency}
                            onChange={(e) => setCheckinFrequency(e.target.value)}
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="biweekly">Bi-weekly</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-5">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={updateGoal} disabled={loading}>
                        {loading ? "Updating..." : "Update Goal"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

function DeleteConfirmModal({ goal, onClose, onConfirm }) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur grid place-items-center p-4 z-50">
            <div className="w-full max-w-md bg-card/80 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-red-300">Delete Goal</h3>
                <p className="text-white/70 mb-6">
                    Are you sure you want to delete "<span className="font-semibold">{goal.title}</span>"? 
                    This action cannot be undone and will also delete all associated chat history.
                </p>
                <div className="flex justify-end gap-2">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button 
                        onClick={onConfirm}
                        className="bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-300"
                    >
                        Delete Goal
                    </Button>
                </div>
            </div>
        </div>
    );
}

function Message({ role, text }) {
    const isUser = role === "user";
    return (
        <div className={`max-w-3xl mx-auto flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div className={`rounded-2xl px-4 py-3 border ${isUser ? "bg-white/10 border-white/10" : "bg-panel/70 border-white/10"}`}>
                <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
            </div>
        </div>
    );
}


