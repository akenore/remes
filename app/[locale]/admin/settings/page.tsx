'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { pb } from '@/lib/pocketbase';
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const t = useTranslations('admin.settings');
  const tCommon = useTranslations('admin.common');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    password: '',
    passwordConfirm: '',
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const errors = [];
      
      if (!profileData.name.trim()) {
        errors.push(t('validation.nameRequired'));
      }
      
      if (!profileData.email.trim()) {
        errors.push(t('validation.emailRequired'));
      }
      
      if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
        errors.push(t('validation.emailInvalid'));
      }
      
      // Check if email is actually different from current email
      if (profileData.email === user?.email) {
        console.log('Email unchanged, skipping email validation');
      }
      
      if (errors.length > 0) {
        throw new Error(errors.join('\n'));
      }

      // Check if user is admin or regular user and update accordingly
      const currentUser = pb.authStore.record;
      console.log('Current user info:', {
        id: currentUser?.id,
        email: currentUser?.email,
        collectionName: currentUser?.collectionName,
        userIdFromContext: user?.id,
        profileDataEmail: profileData.email,
        profileDataName: profileData.name
      });
      
      if (currentUser && currentUser.collectionName === '_superusers') {
        // This is a real superuser from _superusers collection
        console.log('Updating as REAL superuser via pb.admins.update');
        
        // For admin users, we can directly update both name and email
        console.log('Updating admin with ID:', currentUser?.id);
        const updateResult = await pb.admins.update(currentUser?.id || '', {
          name: profileData.name,
          email: profileData.email,
        });
        console.log('Admin update result:', updateResult);
      } else {
        // This is a regular user from users collection (even if they have admin permissions)
        console.log('Updating as REGULAR USER via pb.collection(users).update');
        
        // Update name first (always safe)
        await pb.collection('users').update(user?.id || '', {
          name: profileData.name,
        });
        
        // Only update email if it has actually changed
        if (profileData.email !== user?.email) {
          console.log('Email is changing from', user?.email, 'to', profileData.email);
          // Use the proper PocketBase email change request method
          await pb.collection('users').requestEmailChange(profileData.email);
          console.log('Email change request sent successfully');
          // Update success message for email verification case
          setSuccess(t('success.profileUpdatedEmailChange'));
          setTimeout(() => setSuccess(''), 10000);
          return; // Exit early to avoid the normal success message
        } else {
          console.log('Email unchanged, not updating');
        }
      }
      
      await refreshUser();
      
      // Show normal success message for all updates
      setSuccess(t('success.profileUpdated'));
      setTimeout(() => setSuccess(''), 5000);

    } catch (err: any) {
      if (err.message && (err.message.includes('required') || err.message.includes('\n'))) {
        setError(err.message);
      } else {
        console.error('Profile update error:', err);
        console.error('Error details:', {
          message: err?.message,
          data: err?.data,
          response: err?.response,
          status: err?.status
        });
        console.error('Full error data:', JSON.stringify(err?.data, null, 2));
        
        // Handle PocketBase validation errors
        let errorMessage = '';
        if (err?.data && typeof err.data === 'object') {
          const fieldErrors: string[] = [];
          
          Object.keys(err.data).forEach(field => {
            const fieldError = err.data[field];
            if (fieldError && fieldError.message) {
              fieldErrors.push(`${field}: ${fieldError.message}`);
            } else if (fieldError && typeof fieldError === 'string') {
              fieldErrors.push(`${field}: ${fieldError}`);
            }
          });
          
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join('. ');
          }
        }
        
        if (!errorMessage) {
          errorMessage = err?.message || t('errors.updateFailed');
        }
        
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const errors = [];
      
      if (!passwordData.oldPassword) {
        errors.push(t('validation.oldPasswordRequired'));
      }
      
      if (!passwordData.password) {
        errors.push(t('validation.passwordRequired'));
      }
      
      if (passwordData.password.length < 8) {
        errors.push(t('validation.passwordMinLength'));
      }
      
      if (passwordData.password !== passwordData.passwordConfirm) {
        errors.push(t('validation.passwordMismatch'));
      }
      
      if (errors.length > 0) {
        throw new Error(errors.join('\n'));
      }

      // Check if user is admin or regular user and update accordingly
      const currentUser = pb.authStore.record;
      if (currentUser && currentUser.collectionName === '_superusers') {
        // This is likely an admin user
        await pb.admins.update(currentUser?.id || '', {
          oldPassword: passwordData.oldPassword,
          password: passwordData.password,
          passwordConfirm: passwordData.passwordConfirm,
        });
      } else {
        // This is a regular user
        await pb.collection('users').update(user?.id || '', {
          oldPassword: passwordData.oldPassword,
          password: passwordData.password,
          passwordConfirm: passwordData.passwordConfirm,
        });
      }
      
      setPasswordData({
        oldPassword: '',
        password: '',
        passwordConfirm: '',
      });
      
      setSuccess(t('success.passwordUpdated'));
      setTimeout(() => setSuccess(''), 5000);

    } catch (err: any) {
      if (err.message && (err.message.includes('required') || err.message.includes('\n'))) {
        setError(err.message);
      } else {
        console.error('Password update error:', err);
        console.error('Error details:', {
          message: err?.message,
          data: err?.data,
          response: err?.response,
          status: err?.status
        });
        
        // Handle PocketBase validation errors
        let errorMessage = '';
        if (err?.data && typeof err.data === 'object') {
          const fieldErrors: string[] = [];
          
          Object.keys(err.data).forEach(field => {
            const fieldError = err.data[field];
            if (fieldError && fieldError.message) {
              fieldErrors.push(`${field}: ${fieldError.message}`);
            } else if (fieldError && typeof fieldError === 'string') {
              fieldErrors.push(`${field}: ${fieldError}`);
            }
          });
          
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join('. ');
          }
        }
        
        if (!errorMessage) {
          errorMessage = err?.message || t('errors.passwordUpdateFailed');
        }
        
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-1 text-sm text-gray-500">{t('description')}</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{tCommon('error')}</h3>
              <div className="mt-2 text-sm text-red-700">
                {error.includes('\n') ? (
                  <ul className="list-disc list-inside space-y-1">
                    {error.split('\n').map((err, index) => (
                      <li key={index}>{err.trim()}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{error}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'profile'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('tabs.profile')}
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'password'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('tabs.password')}
            </button>
          </nav>
        </div>

        <div className="px-6 py-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  {t('form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  value={profileData.name}
                  onChange={(e) => {
                    if (error) setError('');
                    if (success) setSuccess('');
                    setProfileData(prev => ({ ...prev, name: e.target.value }));
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder={t('form.namePlaceholder')}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t('form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={profileData.email}
                  onChange={(e) => {
                    if (error) setError('');
                    if (success) setSuccess('');
                    setProfileData(prev => ({ ...prev, email: e.target.value }));
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder={t('form.emailPlaceholder')}
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('actions.saving')}
                    </>
                  ) : (
                    t('actions.saveProfile')
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                  {t('form.oldPassword')}
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={(e) => {
                    if (error) setError('');
                    if (success) setSuccess('');
                    setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }));
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder={t('form.oldPasswordPlaceholder')}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {t('form.newPassword')}
                </label>
                <input
                  type="password"
                  id="password"
                  value={passwordData.password}
                  onChange={(e) => {
                    if (error) setError('');
                    if (success) setSuccess('');
                    setPasswordData(prev => ({ ...prev, password: e.target.value }));
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder={t('form.newPasswordPlaceholder')}
                  required
                  minLength={8}
                />
                <p className="mt-1 text-sm text-gray-500">{t('form.passwordHelp')}</p>
              </div>

              <div>
                <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">
                  {t('form.confirmPassword')}
                </label>
                <input
                  type="password"
                  id="passwordConfirm"
                  value={passwordData.passwordConfirm}
                  onChange={(e) => {
                    if (error) setError('');
                    if (success) setSuccess('');
                    setPasswordData(prev => ({ ...prev, passwordConfirm: e.target.value }));
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder={t('form.confirmPasswordPlaceholder')}
                  required
                  minLength={8}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('actions.saving')}
                    </>
                  ) : (
                    t('actions.updatePassword')
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 