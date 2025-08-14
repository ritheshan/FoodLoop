import { useState, useEffect } from 'react';
import { Save, User, Lock, Bell, Shield, CreditCard, HelpCircle, Loader, ChevronRight, Mail, Phone, MapPin, Globe, ArrowLeft } from 'lucide-react';
import UILoader from '../Components/ui/Loader';
import { useNavigate } from 'react-router-dom';
import { FoodDistributionSidebar } from "../Components/MainPage/Sidebar";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const navigate=useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // const [user, setUser] = useState({
  //   // name: 'John Doe',
  //   // email: 'johndoe@example.com',
  //   // phone: '+1 234 567 8900',
  //   // address: '123 Main Street, Anytown, USA',
  //   // website: 'mywebsite.com',
  //   // notifications: {
  //   //   email: true,
  //   //   push: false,
  //   //   sms: true,
  //   //   newsletter: false
  //   // },
  //   // twoFactorEnabled: false
  // });
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/profile`);
        const data = response.data.user;
  
        setUser({
          name: data.name,
          email: data.email,
          phone: data.contactNumber,
          address: data.address,
          website: data.website,
          notifications: {  // hardcoded for now
            email: true,
            push: false,
            sms: true,
            newsletter: false
          },
          twoFactorEnabled: false  // hardcoded for now
        });
  
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
        setIsLoading(false);
      }
    };
  
    fetchUserProfile();
  }, []);
  // Simulated save function
  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Show success message if needed
    }, 1500);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  // Handle notification toggle
  const handleNotificationToggle = (type) => {
    setUser({
      ...user,
      notifications: {
        ...user.notifications,
        [type]: !user.notifications[type]
      }
    });
  };

  // Handle 2FA toggle
  const handleTwoFactorToggle = () => {
    setUser({
      ...user,
      twoFactorEnabled: !user.twoFactorEnabled
    });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FFF5E4]">
      {/* Container that holds sidebar and content */}
      <div className="flex w-full flex-1 flex-col overflow-hidden border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800">
        {/* Sidebar component */}
        <FoodDistributionSidebar />
        
        {/* Main content area */}
        <div className="flex flex-col w-screen overflow-y-auto">
        <div className="p-4 md:p-8 font-merriweather">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            </div>
            
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 md:gap-4 border-b border-gray-200 pb-4">
              <TabButton 
                label="Account" 
                icon={<User size={18} />} 
                active={activeTab === 'account'} 
                onClick={() => setActiveTab('account')}
              />
              <TabButton 
                label="Security" 
                icon={<Lock size={18} />} 
                active={activeTab === 'security'} 
                onClick={() => setActiveTab('security')}
              />
              <TabButton 
                label="Notifications" 
                icon={<Bell size={18} />} 
                active={activeTab === 'notifications'} 
                onClick={() => setActiveTab('notifications')}
              />
              <TabButton 
                label="Privacy" 
                icon={<Shield size={18} />} 
                active={activeTab === 'privacy'} 
                onClick={() => setActiveTab('privacy')}
              />
              <TabButton 
                label="Billing" 
                icon={<CreditCard size={18} />} 
                active={activeTab === 'billing'} 
                onClick={() => setActiveTab('billing')}
              />
              <TabButton 
                label="Help" 
                icon={<HelpCircle size={18} />} 
                active={activeTab === 'help'} 
                onClick={() => setActiveTab('help')}
              />
            </div>
          </div>
          
          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <UILoader size="lg" className="text-[#FFA725]" />
              </div>
            ) : (
              <>
                {activeTab === 'account' && (
                  <AccountSettings 
                    user={user} 
                    handleChange={handleChange} 
                    handleSave={handleSave}
                    isSaving={isSaving}
                  />
                )}
                
                {activeTab === 'security' && (
                  <SecuritySettings 
                    user={user} 
                    handleTwoFactorToggle={handleTwoFactorToggle}
                    handleSave={handleSave}
                    isSaving={isSaving}
                  />
                )}
                
                {activeTab === 'notifications' && (
                  <NotificationSettings 
                    user={user} 
                    handleNotificationToggle={handleNotificationToggle}
                    handleSave={handleSave}
                    isSaving={isSaving}
                  />
                )}
                
                {activeTab === 'privacy' && (
                  <PrivacySettings 
                    handleSave={handleSave}
                    isSaving={isSaving}
                  />
                )}
                
                {activeTab === 'billing' && (
                  <BillingSettings 
                    handleSave={handleSave}
                    isSaving={isSaving}
                  />
                )}
                
                {activeTab === 'help' && (
                  <HelpCenter />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

// Tab Button Component
function TabButton({ label, icon, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
        active 
          ? 'bg-orange-500 text-white' 
          : 'bg-white text-gray-700 hover:bg-orange-100'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

// Account Settings Component
function AccountSettings({ user, handleChange, handleSave, isSaving }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>
      
      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <User size={18} />
              </span>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <Mail size={18} />
              </span>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <Phone size={18} />
              </span>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website (optional)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <Globe size={18} />
              </span>
              <input
                type="text"
                id="website"
                name="website"
                value={user.website}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <MapPin size={18} />
              </span>
              <input
                type="text"
                id="address"
                name="address"
                value={user.address}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 disabled:bg-orange-300"
          >
            {isSaving ? (
              <>
                <UILoader size="sm" className="text-white" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Danger Zone</h3>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h4 className="text-lg font-medium text-red-600 mb-2">Delete Account</h4>
          <p className="text-gray-700 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="bg-white text-red-600 border border-red-600 px-4 py-2 rounded-md hover:bg-red-100">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

// Security Settings Component
function SecuritySettings({ user, handleTwoFactorToggle, handleSave, isSaving }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
      
      <div className="space-y-8">
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Password</h3>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                id="current-password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm-password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 disabled:bg-orange-300"
              >
                {isSaving ? (
                  <>
                    <UILoader size="sm" className="text-white" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Two-Factor Authentication</h3>
              <p className="text-gray-600 text-sm mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={user.twoFactorEnabled}
                onChange={handleTwoFactorToggle}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
          
          {user.twoFactorEnabled && (
            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-700 mb-4">
                Two-factor authentication is enabled. You'll receive a verification code via SMS when signing in.
              </p>
              <button className="text-orange-500 hover:text-orange-600 font-medium">
                Change 2FA method
              </button>
            </div>
          )}
        </div>
        
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Login Sessions</h3>
          
          <ul className="space-y-4">
            <li className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-800">Chrome on Windows</p>
                <p className="text-sm text-gray-600">Last active: Today at 2:15 PM</p>
              </div>
              <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">Current</span>
            </li>
            <li className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-800">Safari on iPhone</p>
                <p className="text-sm text-gray-600">Last active: Yesterday at 6:30 PM</p>
              </div>
              <button className="text-red-500 hover:text-red-600 text-sm font-medium">Sign out</button>
            </li>
            <li className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-800">Firefox on Mac</p>
                <p className="text-sm text-gray-600">Last active: April 15, 2025 at 9:12 AM</p>
              </div>
              <button className="text-red-500 hover:text-red-600 text-sm font-medium">Sign out</button>
            </li>
          </ul>
          
          <div className="mt-4 flex justify-end">
            <button className="text-red-500 hover:text-red-600 font-medium">Sign out of all devices</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Notification Settings Component
function NotificationSettings({ user, handleNotificationToggle, handleSave, isSaving }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
      
      <div className="border border-gray-200 rounded-lg p-6 mb-6">
        <ul className="space-y-6">
          <li className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Email Notifications</h3>
              <p className="text-sm text-gray-600">Receive updates and alerts via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={user.notifications.email}
                onChange={() => handleNotificationToggle('email')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </li>
          
          <li className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <h3 className="font-medium text-gray-900">Push Notifications</h3>
              <p className="text-sm text-gray-600">Receive notifications on your device</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={user.notifications.push}
                onChange={() => handleNotificationToggle('push')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </li>
          
          <li className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <h3 className="font-medium text-gray-900">SMS Notifications</h3>
              <p className="text-sm text-gray-600">Receive text messages for important updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={user.notifications.sms}
                onChange={() => handleNotificationToggle('sms')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </li>
          
          <li className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <h3 className="font-medium text-gray-900">Newsletter</h3>
              <p className="text-sm text-gray-600">Receive our monthly newsletter with updates and tips</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={user.notifications.newsletter}
                onChange={() => handleNotificationToggle('newsletter')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </li>
        </ul>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Email Frequency</h3>
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <input 
              id="frequency-immediate" 
              type="radio" 
              name="frequency" 
              className="h-4 w-4 accent-orange-500"
              defaultChecked
            />
            <label htmlFor="frequency-immediate" className="ml-2 block text-gray-900">
              Immediate — Send emails as events happen
            </label>
          </div>
          
          <div className="flex items-center">
            <input 
              id="frequency-daily" 
              type="radio" 
              name="frequency" 
              className="h-4 w-4 accent-orange-500"
            />
            <label htmlFor="frequency-daily" className="ml-2 block text-gray-900">
              Daily Digest — Summarize events in a daily email
            </label>
          </div>
          
          <div className="flex items-center">
            <input 
              id="frequency-weekly" 
              type="radio" 
              name="frequency" 
              className="h-4 w-4 accent-orange-500"
            />
            <label htmlFor="frequency-weekly" className="ml-2 block text-gray-900">
              Weekly Digest — Summarize events in a weekly email
            </label>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 disabled:bg-orange-300"
          >
            {isSaving ? (
              <>
                <UILoader size="sm" className="text-white" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Privacy Settings Component
function PrivacySettings({ handleSave, isSaving }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy Settings</h2>
      
      <div className="space-y-8">
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Sharing</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input 
                id="analytics" 
                type="checkbox" 
                className="h-4 w-4 accent-orange-500"
                defaultChecked
              />
              <label htmlFor="analytics" className="ml-2 block text-gray-900">
                Allow anonymous usage analytics to help improve our service
              </label>
            </div>
            
            <div className="flex items-center">
              <input 
                id="personalization" 
                type="checkbox" 
                className="h-4 w-4 accent-orange-500"
                defaultChecked
              />
              <label htmlFor="personalization" className="ml-2 block text-gray-900">
                Use my donation history to personalize recommendations
              </label>
            </div>
            
            <div className="flex items-center">
              <input 
                id="third-party" 
                type="checkbox" 
                className="h-4 w-4 accent-orange-500"
              />
              <label htmlFor="third-party" className="ml-2 block text-gray-900">
                Share my information with trusted third-party partners
              </label>
            </div>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Profile Visibility</h3>
          
          <div className="space-y-6">
            <div>
              <p className="font-medium text-gray-900 mb-2">Who can see my donation activity?</p>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                <option value="public">Everyone (Public)</option>
                <option value="connections">Only Connections</option>
                <option value="private" selected>Only Me (Private)</option>
              </select>
            </div>
            
            <div>
              <p className="font-medium text-gray-900 mb-2">Who can see my contact information?</p>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                <option value="public">Everyone (Public)</option>
                <option value="connections" selected>Only Connections</option>
                <option value="private">Only Me (Private)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Management</h3>
          
          <p className="text-gray-700 mb-4">
            You can request a copy of your data or delete your account and all associated data.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200">
              Download My Data
            </button>
            <button className="bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100">
              Delete All My Data
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 disabled:bg-orange-300"
        >
          {isSaving ? (
            <>
              <UILoader size="sm" className="text-white" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Save Privacy Settings</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Billing Settings Component
function BillingSettings({ handleSave, isSaving }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing & Subscription</h2>
      
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Current Plan: Premium</h3>
            <p className="text-orange-600 mt-1">Your subscription renews on May 18, 2025</p>
          </div>
          <div className="bg-white border border-orange-200 px-4 py-2 rounded-md text-orange-600 font-medium">
            Active
          </div>
        </div>
      </div>
      
      <div className="space-y-8">
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h3>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-black rounded p-1 w-10 h-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <span className="font-medium">•••• •••• •••• 4242</span>
            </div>
            <div className="flex gap-3">
              <button className="text-gray-700 hover:text-gray-900 text-sm font-medium">Edit</button>
              <button className="text-red-500 hover:text-red-600 text-sm font-medium">Remove</button>
            </div>
          </div>
          
          <button className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Payment Method
          </button>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Billing History</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 font-semibold text-gray-700">Date</th>
                  <th className="p-4 font-semibold text-gray-700">Description</th>
                  <th className="p-4 font-semibold text-gray-700">Amount</th>
                  <th className="p-4 font-semibold text-gray-700">Receipt</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-gray-800">April 18, 2025</td>
                  <td className="p-4 text-gray-800">Premium Subscription - Monthly</td>
                  <td className="p-4 text-gray-800">$9.99</td>
                  <td className="p-4">
                    <button className="text-orange-500 hover:text-orange-600">Download</button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-gray-800">March 18, 2025</td>
                  <td className="p-4 text-gray-800">Premium Subscription - Monthly</td>
                  <td className="p-4 text-gray-800">$9.99</td>
                  <td className="p-4">
                    <button className="text-orange-500 hover:text-orange-600">Download</button>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-800">February 18, 2025</td>
                  <td className="p-4 text-gray-800">Premium Subscription - Monthly</td>
                  <td className="p-4 text-gray-800">$9.99</td>
                  <td className="p-4">
                    <button className="text-orange-500 hover:text-orange-600">Download</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Subscription Plans</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Basic</h4>
              <p className="text-3xl font-bold text-gray-900 mb-4">Free</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Limited donations
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Basic reporting
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  No certificates
                </li>
              </ul>
              <button className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
                Current Plan
              </button>
            </div>
            
            <div className="border-2 border-orange-500 rounded-lg p-6 bg-white relative">
              <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Premium</h4>
              <p className="text-3xl font-bold text-gray-900 mb-4">$9.99<span className="text-sm font-normal text-gray-600">/month</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Unlimited donations
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Advanced reporting
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Digital certificates
                </li>
              </ul>
              <button className="w-full bg-orange-100 text-orange-600 px-4 py-2 rounded-md">
                Current Plan
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Enterprise</h4>
              <p className="text-3xl font-bold text-gray-900 mb-4">$29.99<span className="text-sm font-normal text-gray-600">/month</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Everything in Premium
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  API access
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Dedicated support
                </li>
              </ul>
              <button className="w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 disabled:bg-orange-300"
        >
          {isSaving ? (
            <>
              <UILoader size="sm" className="text-white" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Save Billing Settings</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Help Center Component
function HelpCenter() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Help & Support</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border border-gray-200 rounded-lg p-6 bg-orange-50">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HelpCircle size={20} className="text-orange-500" />
            Frequently Asked Questions
          </h3>
          
          <div className="space-y-4">
            <details className="group">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span>How do I make a donation?</span>
                <span className="transition group-open:rotate-180">
                  <ChevronRight size={16} />
                </span>
              </summary>
              <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                You can make a donation by navigating to the "Donate" section of our platform and following the step-by-step process to list your food items for donation.
              </p>
            </details>
            
            <details className="group">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span>How do I get my donation certificate?</span>
                <span className="transition group-open:rotate-180">
                  <ChevronRight size={16} />
                </span>
              </summary>
              <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                After your donation is confirmed, you can view and download your certificate from your profile page under the "Donation History" section.
              </p>
            </details>
            
            <details className="group">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span>Can I cancel my subscription?</span>
                <span className="transition group-open:rotate-180">
                  <ChevronRight size={16} />
                </span>
              </summary>
              <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                Yes, you can cancel your subscription at any time from the Billing section of your settings. Your benefits will continue until the end of your current billing period.
              </p>
            </details>
            
            <details className="group">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span>How can I update my payment information?</span>
                <span className="transition group-open:rotate-180">
                  <ChevronRight size={16} />
                </span>
              </summary>
              <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                You can update your payment information in the Billing section of your settings. Click on "Edit" next to your current payment method.
              </p>
            </details>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Support</h3>
          
          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <select id="subject" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                <option value="" disabled selected>Select a subject</option>
                <option value="account">Account Issue</option>
                <option value="billing">Billing Question</option>
                <option value="donation">Donation Problem</option>
                <option value="bug">Report a Bug</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea 
                id="message" 
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Describe your issue or question"
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit"
                className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Documentation & Resources</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <a href="#" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-orange-50 transition-colors">
            <div className="mr-4 text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">User Guide</h4>
              <p className="text-sm text-gray-600">Learn how to use our platform</p>
            </div>
          </a>
          
          <a href="#" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-orange-50 transition-colors">
            <div className="mr-4 text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Knowledge Base</h4>
              <p className="text-sm text-gray-600">Find answers to common questions</p>
            </div>
          </a>
          
          <a href="#" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-orange-50 transition-colors">
            <div className="mr-4 text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">API Documentation</h4>
              <p className="text-sm text-gray-600">For developers and integrations</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}