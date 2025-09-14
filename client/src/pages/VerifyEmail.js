import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Card = ({ className = "", children }) => (
    <div className={`bg-card/70 backdrop-blur border border-white/5 rounded-2xl shadow-soft ${className}`}>
        {children}
    </div>
);

const Button = ({ className = "", children, ...props }) => (
    <button
        className={`px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition 
                disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
    >
        {children}
    </button>
);

const Input = ({ className = "", ...props }) => (
    <input
        className={`w-full bg-panel/60 border border-white/10 rounded-xl px-3 py-2 focus:outline-none 
                focus:ring-2 focus:ring-accent/40 placeholder-white/40 ${className}`}
        {...props}
    />
);

const Label = ({ className = "", children }) => (
    <label className={`block text-sm text-white/70 mb-1 ${className}`}>{children}</label>
);

export default function VerifyEmail() {
    const [token, setToken] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showResend, setShowResend] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Get token from URL params if available
    const urlParams = new URLSearchParams(location.search);
    const urlToken = urlParams.get('token');

    if (urlToken && !token) {
        setToken(urlToken);
    }

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!token.trim()) {
            setError("Please enter verification token");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await axios.post("http://localhost:5000/api/auth/verify", { token });
            setMessage(response.data.message);
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.error || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError("Please enter your email");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await axios.post("http://localhost:5000/api/auth/resend-verification", { email });
            setMessage(response.data.message);
        } catch (error) {
            setError(error.response?.data?.error || "Failed to resend verification");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid place-items-center relative">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
            
            <Card className="w-full max-w-md p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">Verify Your Email</h1>
                    <p className="text-white/60 mt-1">
                        {showResend ? "Resend verification email" : "Enter the verification token sent to your email"}
                    </p>
                </div>

                {message && (
                    <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-300 text-sm">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                        {error}
                    </div>
                )}

                {!showResend ? (
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div>
                            <Label>Verification Token</Label>
                            <Input 
                                type="text" 
                                placeholder="Enter verification token"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                            />
                            <p className="text-white/40 text-xs mt-1">
                                Check your email for the verification token
                            </p>
                        </div>
                        <Button className="w-full" disabled={loading}>
                            {loading ? "Verifying..." : "Verify Email"}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleResend} className="space-y-4">
                        <div>
                            <Label>Email Address</Label>
                            <Input 
                                type="email" 
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <Button className="w-full" disabled={loading}>
                            {loading ? "Sending..." : "Resend Verification"}
                        </Button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setShowResend(!showResend)}
                        className="text-accent hover:underline text-sm"
                    >
                        {showResend ? "Have a token? Verify here" : "Didn't receive email? Resend"}
                    </button>
                </div>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => navigate("/")}
                        className="text-white/60 hover:text-white text-sm"
                    >
                        Back to Login
                    </button>
                </div>
            </Card>
        </div>
    );
}

