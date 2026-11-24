import { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Eye,
  EyeOff,
  ListChecks,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Printer,
  RefreshCw,
  Search,
  User,
  UserPlus,
} from 'lucide-react';
import {
  type CustomerRecord,
  displayDateToIso,
  extractInitials,
  filterCustomers,
  isoDateToDisplay,
  validateAddress,
  validateConfirmPassword,
  validateCustomerName,
  validateDob,
  validateEmail,
  validateIndianPhone,
  validatePassword,
  validateStaffName,
} from '../utils/printcareLogic';

type Screen = 'login' | 'signup' | 'dashboard' | 'register' | 'list' | 'detail';

interface AndroidPreviewProps {
  customers: CustomerRecord[];
  onAddCustomer: (customer: CustomerRecord) => void;
}

export function AndroidPreview({ customers, onAddCustomer }: AndroidPreviewProps) {
  const [screen, setScreen] = useState<Screen>('login');
  const [staffName, setStaffName] = useState<string>('Rakesh Sharma');
  const [staffEmail, setStaffEmail] = useState<string>('staff@printcare.in');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});

  // Sign-up form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [signupErrors, setSignupErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirm?: string;
  }>({});

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDob, setRegDob] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regErrors, setRegErrors] = useState<{
    name?: string;
    phone?: string;
    dob?: string;
    email?: string;
    address?: string;
  }>({});
  const [savedDialog, setSavedDialog] = useState<{ id: string; name: string } | null>(null);

  // List & search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const filteredCustomers = filterCustomers(customers, searchQuery);

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    const emailErr = validateEmail(loginEmail);
    const passErr = validatePassword(loginPassword);
    setLoginErrors({
      email: emailErr ?? undefined,
      password: passErr ?? undefined,
    });
    if (emailErr || passErr) return;

    setStaffEmail(loginEmail.trim());
    setStaffName(loginEmail.trim().split('@')[0] || 'Shop Staff');
    setScreen('dashboard');
  }

  function handleFillDemoLogin() {
    setLoginEmail('staff@printcare.in');
    setLoginPassword('printcare123');
    setLoginErrors({});
  }

  function handleSignUpSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nameErr = validateStaffName(signupName);
    const emailErr = validateEmail(signupEmail);
    const passErr = validatePassword(signupPassword);
    const confirmErr = validateConfirmPassword(signupPassword, signupConfirm);
    setSignupErrors({
      name: nameErr ?? undefined,
      email: emailErr ?? undefined,
      password: passErr ?? undefined,
      confirm: confirmErr ?? undefined,
    });
    if (nameErr || emailErr || passErr || confirmErr) return;

    setStaffName(signupName.trim());
    setStaffEmail(signupEmail.trim());
    setScreen('dashboard');
  }

  function handleSaveCustomer(e: React.FormEvent) {
    e.preventDefault();
    const nameErr = validateCustomerName(regName);
    const phoneErr = validateIndianPhone(regPhone);
    const dobErr = validateDob(regDob);
    const emailErr = validateEmail(regEmail);
    const addrErr = validateAddress(regAddress);

    setRegErrors({
      name: nameErr ?? undefined,
      phone: phoneErr ?? undefined,
      dob: dobErr ?? undefined,
      email: emailErr ?? undefined,
      address: addrErr ?? undefined,
    });

    if (nameErr || phoneErr || dobErr || emailErr || addrErr) return;

    const newId = `PC_2026_${String(customers.length + 1).padStart(3, '0')}`;
    const newCustomer: CustomerRecord = {
      customerId: newId,
      name: regName.trim(),
      phone: regPhone.trim(),
      dob: regDob.trim(),
      email: regEmail.trim(),
      address: regAddress.trim(),
      createdAt: new Date().toISOString(),
    };
    onAddCustomer(newCustomer);
    setSavedDialog({ id: newId, name: newCustomer.name });
  }

  function clearRegistrationForm() {
    setRegName('');
    setRegPhone('');
    setRegDob('');
    setRegEmail('');
    setRegAddress('');
    setRegErrors({});
  }

  function handleRefreshList() {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 450);
  }

  function handleConfirmLogout() {
    setLogoutModalOpen(false);
    setLoginPassword('');
    setScreen('login');
  }

  const screenSteps: { id: Screen; label: string }[] = [
    { id: 'login', label: 'LoginActivity' },
    { id: 'signup', label: 'SignUpActivity' },
    { id: 'dashboard', label: 'DashboardActivity' },
    { id: 'register', label: 'CustomerRegistration' },
    { id: 'list', label: 'CustomerListActivity' },
    { id: 'detail', label: 'CustomerDetailActivity' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Screen Flow & Instructions */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-slate-900">
            Interactive Android UI Preview
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Test the complete PrintCare Material Design 3 user flow directly in your browser.
            All form validation rules mirror <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">ValidationUtils.kt</code>,
            including 10-digit Indian phone validation (<code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">^[6-9][0-9]&#123;9&#125;$</code>).
          </p>

          <div className="mt-5 pt-5 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-3">
              Jump to Android Screen
            </p>
            <div className="grid grid-cols-2 gap-2">
              {screenSteps.map((step) => {
                const isDisabled = step.id === 'detail' && !selectedCustomer;
                const isActive = screen === step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      if (step.id === 'detail' && !selectedCustomer && customers[0]) {
                        setSelectedCustomer(customers[0]);
                      }
                      setScreen(step.id);
                    }}
                    className={`px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors whitespace-nowrap truncate ${
                      isActive
                        ? 'bg-blue-700 text-white'
                        : isDisabled
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {step.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-slate-100 text-xs text-slate-600 space-y-2">
            <p className="font-semibold text-slate-800">Local Preview Notice</p>
            <p className="leading-relaxed">
              This interactive simulator uses local browser memory preloaded with the 10 sample customer records.
              Real Firebase Authentication and Cloud Firestore persistence activate when you build the Kotlin project in Android Studio with your <code className="font-mono bg-slate-100 px-1 rounded">google-services.json</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Android Phone Frame */}
      <div className="lg:col-span-7 flex justify-center">
        <div className="w-full max-w-[380px] bg-slate-900 rounded-[38px] p-3 shadow-lg border border-slate-800">
          {/* Top Speaker / Status Bar */}
          <div className="bg-blue-800 text-white px-5 py-2 rounded-t-[28px] flex items-center justify-between text-[11px] font-medium">
            <span className="tabular-nums">09:30</span>
            <span className="font-mono text-[10px] text-blue-200">PrintCare · API 35</span>
          </div>

          {/* Screen Viewport */}
          <div className="bg-slate-50 h-[660px] rounded-b-[28px] overflow-y-auto relative flex flex-col">
            {/* 1. LOGIN SCREEN */}
            {screen === 'login' && (
              <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                    <Printer className="w-8 h-8 text-blue-700" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Welcome to PrintCare</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Sign in to manage printing shop customers and records
                  </p>
                </div>

                <form
                  onSubmit={handleLoginSubmit}
                  className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3.5"
                  noValidate
                >
                  <div>
                    <label htmlFor="preview-login-email" className="block text-xs font-medium text-slate-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="preview-login-email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => {
                          setLoginEmail(e.target.value);
                          if (loginErrors.email) setLoginErrors((p) => ({ ...p, email: undefined }));
                        }}
                        placeholder="staff@printcare.in"
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-700"
                      />
                    </div>
                    {loginErrors.email && (
                      <p className="text-xs text-red-600 mt-1">{loginErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="preview-login-password" className="block text-xs font-medium text-slate-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="preview-login-password"
                        type={showLoginPass ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          if (loginErrors.password) setLoginErrors((p) => ({ ...p, password: undefined }));
                        }}
                        placeholder="Min 6 characters"
                        className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-700"
                      />
                      <button
                        type="button"
                        aria-label={showLoginPass ? 'Hide password' : 'Show password'}
                        onClick={() => setShowLoginPass((s) => !s)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 p-1"
                      >
                        {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {loginErrors.password && (
                      <p className="text-xs text-red-600 mt-1">{loginErrors.password}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
                  >
                    Sign In
                  </button>

                  <button
                    type="button"
                    onClick={handleFillDemoLogin}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs py-2 rounded-lg transition-colors"
                  >
                    Fill Sample Staff Credentials
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => setScreen('signup')}
                  className="mt-4 text-xs font-semibold text-blue-700 hover:underline self-center py-2"
                >
                  New to PrintCare? Create an account
                </button>
              </div>
            )}

            {/* 2. SIGN-UP SCREEN */}
            {screen === 'signup' && (
              <div className="flex-1 flex flex-col">
                <div className="bg-blue-700 text-white px-4 py-3.5 flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Back to Login"
                    onClick={() => setScreen('login')}
                    className="p-1 rounded-full hover:bg-blue-600"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <span className="font-bold text-base">Create Staff Account</span>
                </div>

                <div className="p-5 flex-1">
                  <p className="text-xs text-slate-600 mb-3">Register printing shop staff credentials</p>
                  <form
                    onSubmit={handleSignUpSubmit}
                    className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3"
                    noValidate
                  >
                    <div>
                      <label htmlFor="preview-signup-name" className="block text-xs font-medium text-slate-700 mb-1">
                        Staff Full Name
                      </label>
                      <input
                        id="preview-signup-name"
                        type="text"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="e.g. Rakesh Sharma"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-700"
                      />
                      {signupErrors.name && <p className="text-xs text-red-600 mt-1">{signupErrors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="preview-signup-email" className="block text-xs font-medium text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        id="preview-signup-email"
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="rakesh@printcare.in"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-700"
                      />
                      {signupErrors.email && <p className="text-xs text-red-600 mt-1">{signupErrors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="preview-signup-pass" className="block text-xs font-medium text-slate-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="preview-signup-pass"
                          type={showSignupPass ? 'text' : 'password'}
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full pl-3 pr-9 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-700"
                        />
                        <button
                          type="button"
                          aria-label={showSignupPass ? 'Hide password' : 'Show password'}
                          onClick={() => setShowSignupPass((s) => !s)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
                        >
                          {showSignupPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {signupErrors.password && <p className="text-xs text-red-600 mt-1">{signupErrors.password}</p>}
                    </div>

                    <div>
                      <label htmlFor="preview-signup-confirm" className="block text-xs font-medium text-slate-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        id="preview-signup-confirm"
                        type={showSignupPass ? 'text' : 'password'}
                        value={signupConfirm}
                        onChange={(e) => setSignupConfirm(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-700"
                      />
                      {signupErrors.confirm && <p className="text-xs text-red-600 mt-1">{signupErrors.confirm}</p>}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
                    >
                      Create Account
                    </button>
                  </form>

                  <button
                    type="button"
                    onClick={() => setScreen('login')}
                    className="w-full mt-4 text-xs font-semibold text-blue-700 hover:underline text-center py-1"
                  >
                    Already have an account? Sign In
                  </button>
                </div>
              </div>
            )}

            {/* 3. DASHBOARD SCREEN */}
            {screen === 'dashboard' && (
              <div className="flex-1 flex flex-col">
                <div className="bg-blue-700 text-white px-4 py-3.5">
                  <span className="font-bold text-lg">PrintCare</span>
                </div>

                <div className="p-4 space-y-4 flex-1">
                  <div className="bg-blue-700 text-white rounded-2xl p-4">
                    <h3 className="text-lg font-bold">Welcome back, {staffName}</h3>
                    <p className="text-xs text-blue-200">{staffEmail}</p>
                    <p className="text-xs text-blue-100 mt-2.5 leading-relaxed">
                      Manage customer registrations, contact details, and print job directories.
                    </p>
                    <div className="mt-3.5 bg-blue-800 rounded-xl px-3.5 py-2.5 flex items-center justify-between">
                      <span className="text-xs text-blue-100">Total Registered Customers</span>
                      <span className="text-xl font-bold tabular-nums">{customers.length}</span>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-slate-800 pt-1">Quick Actions</p>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <UserPlus className="w-5 h-5 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Register New Customer</p>
                        <p className="text-xs text-slate-600">Add phone, DOB, email, and address</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setScreen('register')}
                      className="w-full bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                    >
                      Register New Customer
                    </button>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <ListChecks className="w-5 h-5 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">View Registered Customers</p>
                        <p className="text-xs text-slate-600">Search and inspect customer records</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setScreen('list')}
                      className="w-full border border-blue-700 text-blue-700 hover:bg-blue-50 text-sm font-semibold py-2.5 rounded-xl transition-colors"
                    >
                      View Registered Customers
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setLogoutModalOpen(true)}
                    className="w-full border border-slate-200 bg-white hover:bg-red-50 text-red-600 text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* 4. CUSTOMER REGISTRATION SCREEN */}
            {screen === 'register' && (
              <div className="flex-1 flex flex-col">
                <div className="bg-blue-700 text-white px-4 py-3.5 flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Back to Dashboard"
                    onClick={() => setScreen('dashboard')}
                    className="p-1 rounded-full hover:bg-blue-600"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <span className="font-bold text-base">Register Customer</span>
                </div>

                <form onSubmit={handleSaveCustomer} className="p-4 space-y-3 flex-1" noValidate>
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div>
                      <label htmlFor="reg-name" className="block text-xs font-medium text-slate-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="reg-name"
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="e.g. Devika Nair"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-700"
                        />
                      </div>
                      {regErrors.name && <p className="text-xs text-red-600 mt-1">{regErrors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="reg-phone" className="block text-xs font-medium text-slate-700 mb-1">
                        Phone Number (Indian Mobile)
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-xs font-semibold text-slate-500">+91</span>
                        <input
                          id="reg-phone"
                          type="tel"
                          maxLength={10}
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="9876543210"
                          className="w-full pl-11 pr-3 py-2 text-sm border border-slate-300 rounded-xl font-mono focus:outline-none focus:border-blue-700"
                        />
                      </div>
                      {regErrors.phone && <p className="text-xs text-red-600 mt-1">{regErrors.phone}</p>}
                    </div>

                    <div>
                      <label htmlFor="reg-dob" className="block text-xs font-medium text-slate-700 mb-1">
                        Date of Birth (DD/MM/YYYY)
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="reg-dob"
                          type="date"
                          max={new Date().toISOString().split('T')[0]}
                          value={displayDateToIso(regDob)}
                          onChange={(e) => setRegDob(isoDateToDisplay(e.target.value))}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-700"
                        />
                      </div>
                      {regErrors.dob && <p className="text-xs text-red-600 mt-1">{regErrors.dob}</p>}
                    </div>

                    <div>
                      <label htmlFor="reg-email" className="block text-xs font-medium text-slate-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="reg-email"
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="customer@example.in"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-700"
                        />
                      </div>
                      {regErrors.email && <p className="text-xs text-red-600 mt-1">{regErrors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="reg-address" className="block text-xs font-medium text-slate-700 mb-1">
                        Address
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <textarea
                          id="reg-address"
                          rows={3}
                          value={regAddress}
                          onChange={(e) => setRegAddress(e.target.value)}
                          placeholder="Shop/Flat no., Street, City, PIN"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-700"
                        />
                      </div>
                      {regErrors.address && <p className="text-xs text-red-600 mt-1">{regErrors.address}</p>}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
                    >
                      Save Customer
                    </button>
                    <button
                      type="button"
                      onClick={clearRegistrationForm}
                      className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium py-2.5 rounded-xl transition-colors"
                    >
                      Clear Form
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 5. CUSTOMER LIST SCREEN */}
            {screen === 'list' && (
              <div className="flex-1 flex flex-col">
                <div className="bg-blue-700 text-white px-4 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Back to Dashboard"
                      onClick={() => setScreen('dashboard')}
                      className="p-1 rounded-full hover:bg-blue-600"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-base">Registered Customers</span>
                  </div>
                  <button
                    type="button"
                    aria-label="Refresh customers"
                    onClick={handleRefreshList}
                    className="p-1.5 rounded-full hover:bg-blue-600"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <div className="bg-white px-3.5 py-3 border-b border-slate-200">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="search"
                      aria-label="Search customers by name or phone"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by customer name or phone..."
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-700"
                    />
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500 mt-2 tabular-nums">
                    {filteredCustomers.length} {filteredCustomers.length === 1 ? 'customer' : 'customers'}
                  </p>
                </div>

                <div className="p-3.5 space-y-2.5 flex-1 overflow-y-auto">
                  {filteredCustomers.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <p className="text-sm font-bold text-slate-800">No Matching Customers</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Try searching with a different name or 10-digit phone number.
                      </p>
                    </div>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <button
                        key={customer.customerId}
                        type="button"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setScreen('detail');
                        }}
                        className="w-full text-left bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-3.5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {extractInitials(customer.name)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-slate-900 truncate">{customer.name}</p>
                            <p className="text-xs font-semibold text-blue-700 font-mono">{customer.phone}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </div>
                        <div className="mt-2.5 pt-2.5 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                          <p className="truncate flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{customer.email}</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="tabular-nums">{customer.dob}</span>
                          </p>
                          <p className="line-clamp-2 flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span>{customer.address}</span>
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 6. CUSTOMER DETAIL SCREEN */}
            {screen === 'detail' && selectedCustomer && (
              <div className="flex-1 flex flex-col">
                <div className="bg-blue-700 text-white px-4 py-3.5 flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Back to Customer List"
                    onClick={() => setScreen('list')}
                    className="p-1 rounded-full hover:bg-blue-600"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <span className="font-bold text-base">Customer Details</span>
                </div>

                <div className="p-4 space-y-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 font-bold text-base flex items-center justify-center">
                        {extractInitials(selectedCustomer.name)}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{selectedCustomer.name}</h4>
                        <p className="text-xs font-mono text-slate-500">ID: {selectedCustomer.customerId}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] text-slate-500">Phone Number</p>
                      <p className="text-sm font-bold text-slate-900 font-mono">{selectedCustomer.phone}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500">Email Address</p>
                      <p className="text-sm text-slate-900">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500">Date of Birth</p>
                      <p className="text-sm text-slate-900 tabular-nums">{selectedCustomer.dob}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500">Address</p>
                      <p className="text-sm text-slate-900 leading-relaxed">{selectedCustomer.address}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500">Registered On</p>
                      <p className="text-xs text-slate-600 font-mono">{selectedCustomer.createdAt}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href={`tel:${selectedCustomer.phone}`}
                      className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold py-3 rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call Customer
                    </a>
                    <a
                      href={`mailto:${selectedCustomer.email}?subject=PrintCare%20Service%20Update`}
                      className="border border-blue-700 text-blue-700 hover:bg-blue-50 text-xs font-semibold py-3 rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Send Email
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Modals inside the phone viewport */}
            {savedDialog && (
              <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center p-5 z-20">
                <div className="bg-white rounded-2xl p-5 w-full max-w-[300px] space-y-3">
                  <h4 className="text-base font-bold text-slate-900">Customer Registered</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {savedDialog.name} has been saved.
                    <br />
                    <span className="font-mono text-slate-800">Customer ID: {savedDialog.id}</span>
                  </p>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSavedDialog(null);
                        clearRegistrationForm();
                      }}
                      className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Add Another
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSavedDialog(null);
                        clearRegistrationForm();
                        setScreen('list');
                      }}
                      className="px-3 py-2 text-xs font-semibold bg-blue-700 text-white rounded-lg"
                    >
                      View List
                    </button>
                  </div>
                </div>
              </div>
            )}

            {logoutModalOpen && (
              <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center p-5 z-20">
                <div className="bg-white rounded-2xl p-5 w-full max-w-[300px] space-y-3">
                  <h4 className="text-base font-bold text-slate-900">Confirm Logout</h4>
                  <p className="text-xs text-slate-600">
                    Are you sure you want to sign out of PrintCare?
                  </p>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setLogoutModalOpen(false)}
                      className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmLogout}
                      className="px-3 py-2 text-xs font-semibold bg-red-600 text-white rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
