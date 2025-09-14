import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

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

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        
        if (!form.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";
        
        if (!form.password.trim()) newErrors.password = "Password is required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        try {
            const res = await api.post("/auth/login", form);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/dashboard");
        } catch (error) {
            const message = error.response?.data?.message || "Login failed";
            setErrors({ general: message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid place-items-center relative">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
            <Card className="w-full max-w-md p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">Welcome back</h1>
                    <p className="text-white/60 mt-1">Sign in to your Goal Achievement account</p>
                </div>
                {errors.general && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                        {errors.general}
                    </div>
                )}
                
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <Label>Email</Label>
                        <Input 
                            type="email" 
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })} 
                            className={errors.email ? "border-red-500/50" : ""}
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <Label>Password</Label>
                        <Input 
                            type="password" 
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })} 
                            className={errors.password ? "border-red-500/50" : ""}
                        />
                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                    </div>
                    <Button className="w-full" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </Button>
                </form>

                <p className="text-sm text-white/60 mt-6">
                    New here?{" "}
                    <Link to="/register" className="text-accent hover:underline">Create an account</Link>
                </p>
            </Card>
        </div>
    );
}
