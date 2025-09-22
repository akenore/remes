'use client';

import { useState } from 'react';
import { pb } from '@/lib/pocketbase';

export default function TestConnectionPage() {
  const [status, setStatus] = useState<string>('Not tested');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setStatus('Testing...');

    try {
      // Test basic connection
      console.log('Testing PocketBase connection to:', pb.baseURL);
      
      // Try to get health status
      const response = await fetch(`${pb.baseURL}/api/health`);
      
      if (response.ok) {
        setStatus('✅ PocketBase is running and accessible');
      } else {
        setStatus('❌ PocketBase responded but with error: ' + response.status);
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setStatus('❌ Cannot connect to PocketBase: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const testUserCollection = async () => {
    setIsLoading(true);
    setStatus('Testing users collection...');

    try {
      // Try to list users (this will fail if no users exist, but that's ok)
      const result = await pb.collection('users').getList(1, 1);
      setStatus(`✅ Users collection accessible. Found ${result.totalItems} users.`);
    } catch (error) {
      console.error('Users collection test failed:', error);
      setStatus('❌ Users collection error: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const testAdminAuth = async () => {
    setIsLoading(true);
    setStatus('Testing admin authentication...');

    try {
      // Test admin login with the provided credentials
      const result = await pb.admins.authWithPassword('test@mail.com', 'Gisdev@22');
      setStatus('✅ Admin authentication successful! User: ' + result.record?.email);
      
      // Clear the auth for testing purposes
      pb.authStore.clear();
    } catch (error) {
      console.error('Admin auth test failed:', error);
      setStatus('❌ Admin authentication failed: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const testUserAuth = async () => {
    setIsLoading(true);
    setStatus('Testing user authentication...');

    try {
      // Test user login with the provided credentials
      const result = await pb.collection('users').authWithPassword('test@mail.com', 'Gisdev@22');
      setStatus('✅ User authentication successful! User: ' + result.record?.email);
      
      // Clear the auth for testing purposes
      pb.authStore.clear();
    } catch (error) {
      console.error('User auth test failed:', error);
      setStatus('❌ User authentication failed: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">PocketBase Connection Test</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded">
            <p className="text-sm text-gray-600">PocketBase URL:</p>
            <p className="font-mono text-sm">{pb.baseURL}</p>
          </div>

          <div className="p-4 bg-blue-50 rounded">
            <p className="text-sm text-gray-600">Status:</p>
            <p className="font-medium">{status}</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={testConnection}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </button>

            <button
              onClick={testUserCollection}
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Users Collection'}
            </button>

            <button
              onClick={testAdminAuth}
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Admin Login (test@mail.com)'}
            </button>

            <button
              onClick={testUserAuth}
              disabled={isLoading}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test User Login (test@mail.com)'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded">
            <h3 className="font-medium text-yellow-800">PocketBase User Types:</h3>
            <ul className="list-disc list-inside text-sm text-yellow-700 mt-2 space-y-1">
              <li><strong>Admin/Superuser:</strong> Created in admin panel (/_/)</li>
              <li><strong>App User:</strong> Regular user in &apos;users&apos; collection</li>
              <li>Your test@mail.com is likely an <strong>admin</strong> user</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-red-50 rounded">
            <h3 className="font-medium text-red-800">Troubleshooting:</h3>
            <ol className="list-decimal list-inside text-sm text-red-700 mt-2 space-y-1">
              <li>Make sure PocketBase is running: <code>cd data && ./pocketbase serve</code></li>
              <li>Check PocketBase admin: <a href={`${pb.baseURL}/_/`} target="_blank" className="underline">{pb.baseURL}/_/</a></li>
              <li>Check if you created admin or regular user</li>
              <li>Check browser console for detailed errors</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 