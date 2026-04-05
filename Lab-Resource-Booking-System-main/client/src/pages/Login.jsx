import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineCalendar, HiOutlineUser, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        if (!formData.name.trim()) {
          toast.error('Name is required');
          setLoading(false);
          return;
        }
        await register(formData.name, formData.email, formData.password);
        toast.success('Account created successfully!');
      } else {
        await login(formData.email, formData.password);
        toast.success('Welcome back!');
      }
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex gradient-mesh">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center px-12 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="relative z-10 max-w-lg">
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-xl shadow-primary-500/25">
                <HiOutlineCalendar className="w-8 h-8 text-white" />
              </div>
              <span className="text-5xl font-extrabold bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
                LabHub
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-white leading-tight">
                Smart Lab Booking,
              </h2>
              <p className="text-4xl font-bold text-primary-400 leading-tight">
                Made Simple.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {['Instant Booking', 'Real-time Slots', 'Auto Confirm'].map((feature) => (
                <span
                  key={feature}
                  className="px-4 py-2 rounded-full bg-surface-800/50 border border-surface-700/30 text-surface-300 text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-primary-500/5 blur-3xl" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent-500/5 blur-3xl" />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-lg animate-scale-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/20">
              <HiOutlineCalendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
              LabHub
            </span>
          </div>

          <div className="glass rounded-3xl p-12 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">
                {isRegister ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-surface-400 mt-2 text-sm">
                {isRegister
                  ? 'Sign up to start booking lab sessions'
                  : 'Sign in to your account to continue'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {isRegister && (
                <div className="animate-slide-up">
                  <label className="block text-sm font-medium text-surface-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                    <input
                      id="register-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-800/50 border border-surface-700/50 rounded-xl text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all duration-300"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-surface-800/50 border border-surface-700/50 rounded-xl text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all duration-300"
                    placeholder=""
                    required
                  />
                </div>
              </div>

              <div className="mb-12">
                <label className="block text-sm font-medium text-surface-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-4 pr-12 py-3.5 bg-surface-800/50 border border-surface-700/50 rounded-xl text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all duration-300"
                    placeholder=""
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors"
                  >
                    {showPassword ? (
                      <HiOutlineEyeOff className="w-5 h-5" />
                    ) : (
                      <HiOutlineEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                id="submit-auth"
                type="submit"
                disabled={loading}
                className="mt-10 w-full py-3.5 px-4 rounded-xl gradient-primary text-white font-semibold text-sm hover-lift transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isRegister ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  isRegister ? 'Create Account' : 'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-surface-500 text-sm">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  id="toggle-auth-mode"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setFormData({ name: '', email: '', password: '' });
                  }}
                  className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                >
                  {isRegister ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
