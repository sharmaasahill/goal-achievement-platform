import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../hooks/useSocket';

const RealtimeChat = ({ goal, userId, onClose }) => {
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const { 
        isConnected, 
        messages, 
        typingUsers, 
        sendMessage, 
        sendTyping 
    } = useSocket(goal?._id, userId);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (input.trim() && isConnected) {
            sendMessage(input.trim());
            setInput('');
            sendTyping(false);
            setIsTyping(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInput(value);

        // Handle typing indicators
        if (value.trim() && !isTyping) {
            setIsTyping(true);
            sendTyping(true);
        } else if (!value.trim() && isTyping) {
            setIsTyping(false);
            sendTyping(false);
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout to stop typing indicator
        typingTimeoutRef.current = setTimeout(() => {
            if (isTyping) {
                setIsTyping(false);
                sendTyping(false);
            }
        }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const getMessageIcon = (type) => {
        return type === 'ai' ? 'AI' : 'User';
    };

    const getMessageStyle = (type) => {
        return type === 'ai' 
            ? "bg-panel/70 border-white/10" 
            : "bg-white/10 border-white/10";
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl h-[70vh] bg-card/90 border border-white/10 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <div>
                        <h2 className="text-lg font-semibold">Real-time AI Chat</h2>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-white/60">{goal?.title}</p>
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                            <span className="text-xs text-white/50">
                                {isConnected ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center text-white/50 py-8">
                            <div className="text-4xl mb-4">💬</div>
                            <p>Start a conversation with your AI tutor!</p>
                            <p className="text-sm mt-2">Ask questions about your goal: "{goal?.title}"</p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div key={message.id} className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-sm">
                                    {getMessageIcon(message.type)}
                                </div>
                                <div className="flex-1">
                                    <div className={`rounded-2xl px-4 py-3 border ${getMessageStyle(message.type)}`}>
                                        <p className="text-sm text-white/90 whitespace-pre-wrap">
                                            {message.message}
                                        </p>
                                    </div>
                                    <p className="text-xs text-white/50 mt-1">
                                        {new Date(message.timestamp).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Typing indicators */}
                    {typingUsers.length > 0 && (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-sm">
                                AI
                            </div>
                            <div className="bg-panel/70 border border-white/10 rounded-2xl px-4 py-3">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                            disabled={!isConnected}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!input.trim() || !isConnected}
                            className="px-4 py-2 bg-accent text-white rounded-xl hover:bg-accent/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Send
                        </button>
                    </div>
                    {!isConnected && (
                        <p className="text-xs text-red-400 mt-2">
                            Connection lost. Trying to reconnect...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RealtimeChat;
