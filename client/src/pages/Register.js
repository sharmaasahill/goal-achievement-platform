import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validatePassword = (password) => {
        const errors = [];
        if (password.length < 8) errors.push("At least 8 characters");
        if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
        if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
        if (!/\d/.test(password)) errors.push("One number");
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("One special character");
        return errors;
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";
        
        const passwordErrors = validatePassword(form.password);
        if (passwordErrors.length > 0) newErrors.password = passwordErrors;
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/api/auth/register", form);
            alert("User Registered Successfully! Please verify your email.");
            // In development, show the token
            if (response.data.verificationToken) {
                console.log("Verification token:", response.data.verificationToken);
                alert(`Development: Use this token to verify: ${response.data.verificationToken}`);
            }
            navigate("/verify");
        } catch (error) {
            const message = error.response?.data?.error || "Registration failed";
            setErrors({ general: message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid place-items-center relative">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
            <Card className="w-full max-w-md p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">Create your account</h1>
                    <p className="text-white/60 mt-1">Start your learning journey</p>
                </div>
                {errors.general && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                        {errors.general}
                    </div>
                )}
                
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input 
                            placeholder="Your name" 
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })} 
                            className={errors.name ? "border-red-500/50" : ""}
                        />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>
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
                        {errors.password && (
                            <div className="mt-1">
                                <p className="text-red-400 text-xs mb-1">Password must contain:</p>
                                <ul className="text-red-300 text-xs space-y-1">
                                    {errors.password.map((error, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                            {error}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <Button className="w-full" disabled={loading}>
                        {loading ? "Creating account..." : "Create account"}
                    </Button>
                </form>

                <p className="text-sm text-white/60 mt-6">
                    Already have an account?{" "}
                    <Link to="/" className="text-accent hover:underline">Sign in</Link>
                </p>
            </Card>
        </div>
    );
}
