import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  Lock, 
  Mail, 
  UserCheck, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle,
  KeyRound,
  UserPlus,
  User as UserIcon,
  Briefcase
} from 'lucide-react';

interface AuthPageProps {
  onOpenRegisterCandidateModal: () => void;
  onOpenRegisterEmployerModal: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onOpenRegisterCandidateModal,
  onOpenRegisterEmployerModal,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, signUp, loginWithGoogle, userSession } = useApp();

  const redirectUrl = searchParams.get('redirect');
  const initialRoleParam = searchParams.get('role') as UserRole | null;
  const initialModeParam = searchParams.get('mode');

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(() => {
    if (initialModeParam === 'signup' || initialModeParam === 'register') {
      return 'signup';
    }
    return 'signin';
  });
  const [selectedRole, setSelectedRole] = useState<'candidate' | 'employer'>(() => {
    if (initialRoleParam && ['candidate', 'employer'].includes(initialRoleParam)) {
      return initialRoleParam as 'candidate' | 'employer';
    }
    return 'candidate';
  });

  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // If already authenticated, redirect to authorized destination matching DB role
  useEffect(() => {
    if (userSession) {
      const targetRolePath = userSession.role === 'candidate' 
        ? '/job-seeker' 
        : userSession.role === 'employer' 
        ? '/job-provider' 
        : '/admin';

      if (redirectUrl && redirectUrl.startsWith(targetRolePath)) {
        navigate(redirectUrl, { replace: true });
      } else {
        navigate(targetRolePath, { replace: true });
      }
    }
  }, [userSession, redirectUrl, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      let activeRole: UserRole = selectedRole;
      if (authMode === 'signin') {
        // Dynamic role resolution from DB profile - do not force role
        const res = await login(email.trim(), password);
        if (!res.success) {
          setErrorMsg(res.message || 'Authentication failed. Please verify credentials.');
          return;
        }
        if (res.role) activeRole = res.role;
      } else {
        const res = await signUp(
          email.trim(), 
          password, 
          selectedRole, 
          name.trim() || undefined, 
          selectedRole === 'employer' ? (companyName.trim() || undefined) : undefined
        );
        if (!res.success) {
          setErrorMsg(res.message || 'Could not create account.');
          return;
        }
      }

      // Successful auth - redirect based on dynamic role from account
      const targetRolePath = activeRole === 'candidate' 
        ? '/job-seeker' 
        : activeRole === 'employer' 
        ? '/job-provider' 
        : '/admin';

      if (redirectUrl && redirectUrl.startsWith(targetRolePath)) {
        navigate(redirectUrl, { replace: true });
      } else {
        navigate(targetRolePath, { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsGoogleLoading(true);
    try {
      // In sign-in, pass undefined so role is determined dynamically from Firestore.
      // In sign-up, pass selectedRole so if a new user record is created, it uses the selected role.
      const res = await loginWithGoogle(authMode === 'signup' ? selectedRole : undefined);
      if (!res.success) {
        setErrorMsg(res.message || 'Could not sign in with Google.');
        return;
      }
      const activeRole = res.role || selectedRole;
      const targetRolePath = activeRole === 'candidate' 
        ? '/job-seeker' 
        : activeRole === 'employer' 
        ? '/job-provider' 
        : '/admin';

      if (redirectUrl && redirectUrl.startsWith(targetRolePath)) {
        navigate(redirectUrl, { replace: true });
      } else {
        navigate(targetRolePath, { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google sign-in error. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900/40">
      <div className="max-w-md w-full space-y-6">
        
        {/* Brand Header */}
        <div className="text-center">
          <img 
            src="/plmspider-logo.png" 
            alt="PLMSpider" 
            className="h-14 w-auto mx-auto object-contain mb-3 drop-shadow-xs" 
          />
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {authMode === 'signin' ? 'Sign In to PLMSpider' : 'Create Verified Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {authMode === 'signin' 
              ? 'Enter your credentials to access your engineering or employer workspace' 
              : 'Register your account to access Teamcenter, Windchill & 3DEXPERIENCE opportunities'}
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8">
          
          {/* Auth Mode Toggle (Sign In vs Create Account) */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => { setAuthMode('signin'); setErrorMsg(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('signup'); setErrorMsg(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* STEP 1: Select Role (Only during Sign Up / Create Account) */}
          {authMode === 'signup' && (
            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                I am joining as a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setSelectedRole('candidate'); setErrorMsg(null); }}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedRole === 'candidate'
                      ? 'border-[#BA3A2C] bg-[#BA3A2C]/10 text-[#BA3A2C] font-bold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <UserCheck className={`w-5 h-5 mx-auto mb-1.5 ${selectedRole === 'candidate' ? 'text-[#BA3A2C]' : 'text-slate-400'}`} />
                  <span className="text-xs font-semibold block leading-tight">Job Seeker</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Engineering Specialist</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setSelectedRole('employer'); setErrorMsg(null); }}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedRole === 'employer'
                      ? 'border-[#0B2545] bg-[#0B2545]/10 text-[#0B2545] font-bold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Building2 className={`w-5 h-5 mx-auto mb-1.5 ${selectedRole === 'employer' ? 'text-[#0B2545]' : 'text-slate-400'}`} />
                  <span className="text-xs font-semibold block leading-tight">Job Provider</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Enterprise Employer</span>
                </button>
              </div>
            </div>
          )}

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-all shadow-xs flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 6 29.6 4 24 4c-7.4 0-13.8 4.2-17 10.3z"/>
              <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 35.3 26.9 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.9 39.6 16.4 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.4C41.4 35.9 44 30.4 44 24c0-1.2-.1-2.4-.4-3.5z"/>
            </svg>
            <span>
              {isGoogleLoading 
                ? 'Connecting to Google...' 
                : authMode === 'signin' 
                  ? 'Continue with Google' 
                  : `Register with Google as ${selectedRole === 'candidate' ? 'Job Seeker' : 'Job Provider'}`}
            </span>
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Or use email</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* If Sign Up, Ask Name */}
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name / Contact Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* If Sign Up as Employer, Ask Company Name */}
            {authMode === 'signup' && selectedRole === 'employer' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company / Organization Name
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. AeroTech Engineering LLC"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Min 6 characters</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3 px-4 rounded-xl font-bold text-xs bg-[#BA3A2C] hover:bg-[#9E2F23] text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {authMode === 'signin' ? (
                <>
                  <KeyRound className="w-4 h-4 text-white" />
                  <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 text-white" />
                  <span>{isLoading ? 'Creating Account...' : `Create ${selectedRole === 'candidate' ? 'Job Seeker' : 'Job Provider'} Account`}</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Registration Links */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 mb-3">
              Need comprehensive onboarding with resume or legal verification?
            </p>
            <div className="flex items-center justify-center gap-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onOpenRegisterCandidateModal()}
                className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
              >
                + Register as Job Seeker
              </button>
              <span className="text-slate-300">·</span>
              <button
                type="button"
                onClick={() => onOpenRegisterEmployerModal()}
                className="text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                + Register Enterprise
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
