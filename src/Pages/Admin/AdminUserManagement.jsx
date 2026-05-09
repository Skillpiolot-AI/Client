// Removed lucide-react imports
import config from '../../config';

const AdminUserManagement = () => {
  const [formData, setFormData] = useState({ name: '', username: '', email: '', role: 'User', isVerified: false });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const roles = [
    { value: 'User', label: 'User', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
    { value: 'Mentor', label: 'Mentor', color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
    { value: 'Admin', label: 'Admin', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
    { value: 'UniAdmin', label: 'University Admin', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
    { value: 'UniTeach', label: 'University Teacher', color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
  ];

  const roleDescriptions = {
    User: 'Standard platform access — can take assessments, book mentors, and explore career resources.',
    Mentor: 'Can create a mentor profile, list services, accept bookings, and guide students.',
    Admin: 'Full system access including user management, analytics, and all admin controls.',
    UniAdmin: 'Manages university-specific settings, student access, and institutional analytics.',
    UniTeach: 'University teacher with access to student progress and mentor tools.',
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) password += chars.charAt(Math.floor(Math.random() * chars.length));
    setGeneratedPassword(password);
    showNotification('success', 'Password generated successfully');
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) { showNotification('error', 'Name is required'); return false; }
    if (!formData.username.trim()) { showNotification('error', 'Username is required'); return false; }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { showNotification('error', 'Valid email is required'); return false; }
    if (!generatedPassword) { showNotification('error', 'Please generate a password first'); return false; }
    return true;
  };

  const handleCreateUser = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/auth/admin/create-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ ...formData, password: generatedPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        showNotification('success', `User ${formData.name} created. ${formData.isVerified ? 'Welcome email sent.' : 'Verification email sent.'}`);
        setFormData({ name: '', username: '', email: '', role: 'User', isVerified: false });
        setGeneratedPassword('');
      } else showNotification('error', data.message || 'Failed to create user');
    } catch { showNotification('error', 'Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleTestEmail = async () => {
    setTestEmailLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/auth/admin/test-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          testEmail: 'ujjwaljha744@gmail.com',
          sampleData: { name: formData.name || 'Test User', username: formData.username || 'testuser', email: formData.email || 'test@example.com', role: formData.role, password: generatedPassword || 'SamplePass123!', isVerified: formData.isVerified },
        }),
      });
      const data = await response.json();
      if (response.ok) showNotification('success', 'Test email sent to ujjwaljha744@gmail.com');
      else showNotification('error', data.message || 'Failed to send test email');
    } catch { showNotification('error', 'Network error.'); }
    finally { setTestEmailLoading(false); }
  };

  const selectedRole = roles.find(r => r.value === formData.role);

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      {/* Toast */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-lg flex items-center gap-3 text-white text-sm font-medium ${notification.type === 'success' ? 'bg-green-600' : 'bg-error'}`}>
          <span className="material-symbols-outlined">{notification.type === 'success' ? 'check_circle' : 'error'}</span>
          {notification.message}
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-5 mb-4">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-3xl text-primary">person_add</span>
            </div>
            <div>
              <h1 className="text-3xl font-headline font-extrabold text-primary tracking-tight">Create New User</h1>
              <p className="text-secondary text-sm mt-1">Add a user account and send a welcome or verification email</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container-low border border-outline-variant/20 rounded-3xl shadow-xl p-8 mb-8 overflow-hidden relative group transition-all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              { id: 'name', label: 'Full Name', icon: 'person', type: 'text', placeholder: 'John Doe' },
              { id: 'username', label: 'Unique Username', icon: 'alternate_email', type: 'text', placeholder: 'johndoe' },
              { id: 'email', label: 'Primary Email Address', icon: 'mail', type: 'email', placeholder: 'john@example.com' },
            ].map(f => (
              <div key={f.id} className={f.id === 'email' ? 'md:col-span-2' : ''}>
                <label className="block text-xs font-label font-bold tracking-widest uppercase text-secondary mb-2.5">{f.label}</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary opacity-60">{f.icon}</span>
                  <input type={f.type} name={f.id} value={formData[f.id]} onChange={handleInputChange} placeholder={f.placeholder}
                    className="w-full pl-12 pr-4 py-3.5 bg-surface border border-outline-variant/30 rounded-2xl text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:opacity-40" />
                </div>
              </div>
            ))}

            {/* Role */}
            <div className="md:col-span-2 pt-2">
              <label className="block text-xs font-label font-bold tracking-widest uppercase text-secondary mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">shield</span> Platform Permissions Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {roles.map(role => (
                  <button key={role.value} type="button" onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
                    className={`py-3 px-3 rounded-2xl border-2 text-[10px] font-bold tracking-widest uppercase transition-all text-center ${formData.role === role.value ? `border-primary bg-primary text-white shadow-md scale-105` : 'border-outline-variant/30 text-secondary hover:border-primary/30 bg-surface'}`}>
                    {role.label}
                  </button>
                ))}
              </div>
              {selectedRole && (
                <div className="mt-4 p-4 bg-surface-container-high/50 rounded-2xl border border-outline-variant/10 flex gap-3 animate-in fade-in slide-in-from-top-1">
                  <span className="material-symbols-outlined text-primary text-xl">info</span>
                  <p className="text-xs text-on-surface leading-relaxed font-body">
                    <strong className="text-primary font-headline tracking-wide">{selectedRole.label}:</strong> {roleDescriptions[selectedRole.value]}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="mb-8">
            <label className="block text-xs font-label font-bold tracking-widest uppercase text-secondary mb-2.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">lock</span> Secure Access Credentials
            </label>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input type={showPassword ? 'text' : 'password'} value={generatedPassword} readOnly placeholder="Click Generate to create password"
                  className="w-full pl-4 pr-12 py-3.5 bg-surface-container-high border border-outline-variant/30 rounded-2xl text-sm font-mono tracking-widest focus:outline-none" />
                {generatedPassword && (
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                )}
              </div>
              <button onClick={generatePassword} className="px-8 py-3.5 bg-tertiary text-white font-extrabold rounded-2xl text-xs uppercase tracking-widest shadow-lg hover:opacity-90 active:scale-95 transition-all">
                Generate
              </button>
            </div>
          </div>

          {/* Verified Toggle */}
          <div className="mb-8 p-4 bg-surface-container-low border border-outline-variant/20 rounded-2xl">
            <label className="flex items-center gap-4 cursor-pointer group select-none">
              <div className="relative">
                <input type="checkbox" name="isVerified" checked={formData.isVerified} onChange={handleInputChange} className="sr-only" />
                <div className={`w-14 h-7 rounded-full transition-all duration-300 ${formData.isVerified ? 'bg-primary shadow-inner shadow-primary-container' : 'bg-outline-variant/40'}`}>
                  <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 ${formData.isVerified ? 'translate-x-7' : ''} flex items-center justify-center`}>
                     {formData.isVerified && <span className="material-symbols-outlined text-[12px] text-primary font-bold">check</span>}
                  </div>
                </div>
              </div>
              <div>
                <span className="text-sm font-headline font-bold text-on-surface group-hover:text-primary transition-colors tracking-tight">Pre-verify User Account</span>
                <p className="text-[10px] text-secondary font-label tracking-widest uppercase mt-0.5 opacity-60">
                  {formData.isVerified ? 'A welcome email will be dispatched immediately' : 'User will receive a mandatory verification request'}
                </p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleCreateUser} disabled={loading}
              className="flex-1 flex items-center justify-center gap-3 py-4 bg-primary text-white font-extrabold rounded-2xl text-xs uppercase tracking-widest shadow-xl hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <><span className="material-symbols-outlined animate-spin">progress_activity</span> Provisioning...</> : <><span className="material-symbols-outlined">person_add</span> Create & Dispatch</>}
            </button>
            <button onClick={handleTestEmail} disabled={testEmailLoading}
              className="flex-1 flex items-center justify-center gap-3 py-4 bg-surface-container-highest text-primary font-extrabold rounded-2xl text-xs uppercase tracking-widest border border-outline-variant hover:bg-surface transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {testEmailLoading ? <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Transmitting...</> : <><span className="material-symbols-outlined text-lg">outgoing_mail</span> Preview Template</>}
            </button>
          </div>
        </div>

        {/* Info box */}
        <div className="bg-primary-container/10 border border-primary/20 rounded-3xl p-6 flex items-start gap-4 shadow-sm">
          <span className="material-symbols-outlined text-primary text-2xl">mail_lock</span>
          <div className="text-sm leading-relaxed">
            <p className="font-headline font-bold text-primary tracking-tight text-lg mb-1">Administrative Mail Dispatch</p>
            <p className="text-secondary font-body">
              All communications are routed via <strong className="text-on-surface">ujjwaljha744@gmail.com</strong> for internal auditing. 
              We recommend executing a <span className="text-primary font-bold">Preview Template</span> dispatch to verify content and branding before finalizing user registration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;