import { useState, useEffect, useRef } from "react";

const VideoChat = ({ goal, onClose }) => {
    const [isVideoOn, setIsVideoOn] = useState(false);
    const [isAudioOn, setIsAudioOn] = useState(true);
    const [isConnecting, setIsConnecting] = useState(false);
    const [avatarState, setAvatarState] = useState("idle"); // idle, speaking, thinking
    const [chatMessage, setChatMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        // Simulate avatar animations
        const interval = setInterval(() => {
            if (avatarState === "idle") {
                setAvatarState("thinking");
                setTimeout(() => setAvatarState("speaking"), 2000);
                setTimeout(() => setAvatarState("idle"), 4000);
            }
        }, 8000);

        return () => clearInterval(interval);
    }, [avatarState]);

    const toggleVideo = () => {
        setIsVideoOn(!isVideoOn);
        if (!isVideoOn) {
            // Simulate video connection
            setIsConnecting(true);
            setTimeout(() => {
                setIsConnecting(false);
                // In a real app, you'd start the camera here
            }, 2000);
        }
    };

    const toggleAudio = () => {
        setIsAudioOn(!isAudioOn);
    };

    const sendMessage = () => {
        if (!chatMessage.trim()) return;
        
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setChatMessage("");
        }, 2000);
    };

    const getAvatarEmoji = () => {
        switch (avatarState) {
            case "thinking":
                return "🤔";
            case "speaking":
                return "💬";
            default:
                return "👨‍🏫";
        }
    };

    const getAvatarMessage = () => {
        switch (avatarState) {
            case "thinking":
                return "Let me think about that...";
            case "speaking":
                return "That's a great question! Let me explain...";
            default:
                return "Hello! I'm your AI tutor. How can I help you today?";
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl h-[80vh] bg-card/90 border border-white/10 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <div>
                        <h2 className="text-lg font-semibold">AI Tutor Video Chat</h2>
                        <p className="text-sm text-white/60">{goal?.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex h-full">
                    {/* Video Area */}
                    <div className="flex-1 flex flex-col">
                        {/* Main Video Display */}
                        <div className="flex-1 bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center relative">
                            {isConnecting ? (
                                <div className="text-center">
                                    <div className="animate-spin w-12 h-12 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
                                    <p className="text-white/70">Connecting to AI Tutor...</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="text-8xl mb-4 animate-pulse">
                                        {getAvatarEmoji()}
                                    </div>
                                    <div className="bg-white/10 backdrop-blur rounded-xl p-4 max-w-md mx-auto">
                                        <p className="text-white/80 text-sm">
                                            {getAvatarMessage()}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* User Video (Placeholder) */}
                            {isVideoOn && (
                                <div className="absolute bottom-4 right-4 w-32 h-24 bg-white/10 border border-white/20 rounded-lg overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                                        <span className="text-white/60 text-sm">Your Video</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="p-4 border-t border-white/10">
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={toggleVideo}
                                    className={`p-3 rounded-full transition ${
                                        isVideoOn 
                                            ? "bg-red-500/20 text-red-300" 
                                            : "bg-white/10 text-white/60 hover:bg-white/20"
                                    }`}
                                >
                                    {isVideoOn ? "📹" : "📹"}
                                </button>
                                
                                <button
                                    onClick={toggleAudio}
                                    className={`p-3 rounded-full transition ${
                                        isAudioOn 
                                            ? "bg-green-500/20 text-green-300" 
                                            : "bg-white/10 text-white/60 hover:bg-white/20"
                                    }`}
                                >
                                    {isAudioOn ? "🎤" : "🎤"}
                                </button>

                                <button className="p-3 rounded-full bg-white/10 text-white/60 hover:bg-white/20 transition">
                                    📞
                                </button>

                                <button className="p-3 rounded-full bg-white/10 text-white/60 hover:bg-white/20 transition">
                                    ⚙️
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Chat Sidebar */}
                    <div className="w-80 border-l border-white/10 flex flex-col">
                        <div className="p-4 border-b border-white/10">
                            <h3 className="font-semibold">Chat</h3>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                                    👨‍🏫
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-white/80">
                                        Welcome to your personalized learning session! I'm here to help you with {goal?.title}.
                                    </p>
                                    <p className="text-xs text-white/50 mt-1">Just now</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                                    👤
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-white/80">
                                        Can you explain the basics of this topic?
                                    </p>
                                    <p className="text-xs text-white/50 mt-1">2 min ago</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                                    👨‍🏫
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-white/80">
                                        Absolutely! Let me break it down into simple concepts...
                                    </p>
                                    <p className="text-xs text-white/50 mt-1">1 min ago</p>
                                </div>
                            </div>

                            {isTyping && (
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                                        👨‍🏫
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 border-t border-white/10">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                />
                                <button
                                    onClick={sendMessage}
                                    className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoChat;
