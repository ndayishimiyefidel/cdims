import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, Church, Shield, CheckSquare } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context";
import { motion } from "framer-motion";

interface FormData { email: string; password: string; }
interface Errors { email?: string; password?: string; general?: string; }
interface Touched { email?: boolean; password?: boolean; }

const AdminLogin: React.FC = () => {
  const { login, isLoading: authLoading, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedEmail = localStorage.getItem("cdims_remembered_email");
    if (savedEmail) { setFormData(p => ({ ...p, email: savedEmail })); setRememberMe(true); }
  }, []);

  useEffect(() => {
    if (isAuthenticated && !authLoading) navigate(location.state?.from?.pathname || "/admin/dashboard");
  }, [isAuthenticated, authLoading, location, navigate]);

  const validateEmail = (email: string): string => {
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    setTouched(p => ({ ...p, [name]: true }));
    if (touched[name as keyof Touched] || value !== "") {
      const err = name === "email" ? validateEmail(value) : validatePassword(value);
      setErrors(p => ({ ...p, [name]: err }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(p => ({ ...p, [name]: true }));
    const err = name === "email" ? validateEmail(value) : validatePassword(value);
    setErrors(p => ({ ...p, [name]: err }));
  };

  const validateForm = (): Errors => {
    const e: Errors = { email: validateEmail(formData.email), password: validatePassword(formData.password) };
    Object.keys(e).forEach(k => { if (!e[k as keyof Errors]) delete e[k as keyof Errors]; });
    return e;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const n = validateForm();
    if (Object.keys(n).length > 0) { setErrors(n); return; }
    setIsLoading(true);
    setErrors({});
    try {
      if (rememberMe) localStorage.setItem("cdims_remembered_email", formData.email);
      else localStorage.removeItem("cdims_remembered_email");
      const response = await login({ email: formData.email, password: formData.password });
      if (response.success) navigate(location.state?.from?.pathname || "/admin/dashboard");
      else setErrors({ general: response.message || "Login failed" });
    } catch (error: any) { setErrors({ general: error.message || "An error occurred during login. Please try again." }); }
    finally { setIsLoading(false); }
  };

  const isFormValid = (): boolean => !!formData.email && !!formData.password && !errors.email && !errors.password;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-primary-100">
      <div className="max-lg:hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0">
          <div className="absolute top-20 -left-20 w-64 h-64 bg-primary-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 -right-20 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-xl"><Church className="w-10 h-10 text-white" /></div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">Diocese Information<br /><span className="text-primary-200">Management System</span></h1>
            <p className="text-primary-200 text-lg leading-relaxed mb-8">Streamlining infrastructure, materials, and procurement management for the Catholic Diocese of Cyangugu.</p>
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-white/70 text-sm"><Shield size={14} /><span>Secure</span></div>
              <div className="flex items-center gap-2 text-white/70 text-sm"><CheckSquare size={14} /><span>Reliable</span></div>
              <div className="flex items-center gap-2 text-white/70 text-sm"><Shield size={14} /><span>Efficient</span></div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"><Church className="w-8 h-8 text-white" /></div>
            <h2 className="text-xl font-bold text-gray-900">Welcome to CDIMS</h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
          </div>
          <div className="max-lg:hidden lg:block mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
            <p className="text-gray-500">Sign in to access the CDIMS dashboard</p>
          </div>
          {errors.general && (<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"><p className="text-red-600 text-sm">{errors.general}</p></div>)}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} onBlur={handleBlur}
                className={"w-full px-4 py-3 rounded-xl border text-sm transition-all " + (errors.email ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/10" : "border-gray-200 focus:border-primary-500 focus:ring-primary-500/10") + " focus:outline-none focus:ring-4"}
                placeholder="you@example.com" disabled={isLoading || authLoading} />
              {errors.email && touched.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleInputChange} onBlur={handleBlur}
                  className={"w-full px-4 py-3 pr-12 rounded-xl border text-sm transition-all " + (errors.password ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/10" : "border-gray-200 focus:border-primary-500 focus:ring-primary-500/10") + " focus:outline-none focus:ring-4"}
                  placeholder="Enter your password" disabled={isLoading || authLoading} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" disabled={isLoading || authLoading}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && touched.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer" />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">Forgot password?</button>
            </div>
            <button type="submit" disabled={isLoading || authLoading || !isFormValid()}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-primary-500/30 text-sm">
              {isLoading || authLoading ? (<span className="flex items-center justify-center gap-2"><Loader2 size={18} className="animate-spin" /> Signing in...</span>) : "Sign In"}
            </button>
          </form>
          <p className="text-center mt-8 text-xs text-gray-400">&copy; {new Date().getFullYear()} CDIMS &mdash; Catholic Diocese of Cyangugu. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
