
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import Button from '../components/ui/Button';

const LoginPage: React.FC = () => {
  const { loginWithGoogle, user, error, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
        const from = location.state?.from?.pathname || (user.role === UserRole.ADMIN ? "/admin-dashboard" : "/owner-dashboard");
        navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  return (
    <div className="flex items-center justify-center py-20 animate-fade-in-up">
      <div className="w-full max-w-md p-8 space-y-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-400 text-sm">
            Portal access for Owners and Administrators
          </p>
        </div>
        
        <div className="py-6">
            <Button onClick={handleGoogleLogin} fullWidth disabled={loading} className="flex items-center justify-center gap-3 bg-white text-gray-900 hover:bg-gray-100">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {loading ? 'Signing in...' : 'Sign in with Google'}
            </Button>
        </div>

        {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
