import { useState, useEffect } from "react";
import api from "../api";

const NotificationCenter = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchNotifications();
        }
    }, [userId]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/notifications");
            setNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await api.patch(`/notifications/${notificationId}/read`);
            setNotifications(notifications.map(n => 
                n._id === notificationId ? { ...n, read: true } : n
            ));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            await api.delete(`/notifications/${notificationId}`);
            setNotifications(notifications.filter(n => n._id !== notificationId));
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "checkin":
                return "📅";
            case "reminder":
                return "⏰";
            case "progress":
                return "📊";
            case "achievement":
                return "🏆";
            default:
                return "📢";
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case "checkin":
                return "bg-blue-500/20 border-blue-500/30 text-blue-300";
            case "reminder":
                return "bg-yellow-500/20 border-yellow-500/30 text-yellow-300";
            case "progress":
                return "bg-green-500/20 border-green-500/30 text-green-300";
            case "achievement":
                return "bg-purple-500/20 border-purple-500/30 text-purple-300";
            default:
                return "bg-white/10 border-white/20 text-white";
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    if (loading) {
        return (
            <div className="bg-card/70 backdrop-blur border border-white/5 rounded-2xl p-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                    <div className="h-3 bg-white/5 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card/70 backdrop-blur border border-white/5 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                    <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="text-center text-white/50 py-4">
                        <div className="text-2xl mb-2">📭</div>
                        <p className="text-sm">No notifications yet</p>
                    </div>
                ) : (
                    notifications.map(notification => (
                        <div
                            key={notification._id}
                            className={`p-3 rounded-xl border transition-all ${
                                notification.read 
                                    ? "bg-white/5 border-white/10 opacity-60" 
                                    : getNotificationColor(notification.type)
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="text-lg">
                                    {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium">
                                            {notification.title}
                                        </h4>
                                        <div className="flex gap-1">
                                            {!notification.read && (
                                                <button
                                                    onClick={() => markAsRead(notification._id)}
                                                    className="text-xs text-white/60 hover:text-white"
                                                    title="Mark as read"
                                                >
                                                    ✓
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteNotification(notification._id)}
                                                className="text-xs text-white/60 hover:text-red-400"
                                                title="Delete"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-white/70 mt-1">
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-white/50 mt-1">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {notifications.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/10">
                    <button
                        onClick={() => {
                            notifications.forEach(n => {
                                if (!n.read) markAsRead(n._id);
                            });
                        }}
                        className="text-xs text-accent hover:text-accent/80"
                    >
                        Mark all as read
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
