   import PocketBase from 'pocketbase';
   
const isBrowser = typeof window !== 'undefined';
const clientBaseUrl = '/api/pb';
const serverBaseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(isBrowser ? clientBaseUrl : serverBaseUrl);

// Enable auto cancellation for requests
pb.autoCancellation(false);

// Configure auth store for proper persistence
if (typeof window !== 'undefined') {
  // Load existing auth data from localStorage on client side
  const authData = localStorage.getItem('pocketbase_auth');
  if (authData) {
    try {
      pb.authStore.save(JSON.parse(authData).token, JSON.parse(authData).record);
    } catch (e) {
      localStorage.removeItem('pocketbase_auth');
    }
  }

  // Save auth data to localStorage whenever it changes
  pb.authStore.onChange((token, record) => {
    if (token && record) {
      localStorage.setItem('pocketbase_auth', JSON.stringify({ token, record }));
    } else {
      localStorage.removeItem('pocketbase_auth');
    }
  });
}

// Authentication helpers
export const authHelpers = {
  // Login user - focuses on regular users first, then tries admin if needed
  async login(email: string, password: string) {
    try {
      // First try as regular user (recommended approach)
      try {
        const authData = await pb.collection('users').authWithPassword(email, password);
        return { success: true, user: authData.record };
      } catch (userError) {
        // If regular user fails, try admin (fallback)
        try {
          // Use the correct admin authentication method
          const authData = await pb.admins.authWithPassword(email, password);
          return { success: true, user: authData.record };
        } catch (adminError) {
          // Return a more helpful error message
          return { 
            success: false, 
            error: `Login failed. User not found in either users collection or admin. Please check your credentials or create a user account.`
          };
        }
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  },

  // Create a regular user (helper function)
  async createUser(email: string, password: string, name?: string) {
    try {
      const userData = {
        email,
        password,
        passwordConfirm: password,
        name: name || email.split('@')[0], // Use email prefix as default name
        emailVisibility: false
      };
      
      const record = await pb.collection('users').create(userData);
      return { success: true, user: record };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'User creation failed' };
    }
  },

  // Logout user
  logout() {
    pb.authStore.clear();
  },

  // Check if user is authenticated
  isAuthenticated() {
    return pb.authStore.isValid;
  },

  // Get current user
  getCurrentUser() {
    return pb.authStore.record;
  },

  // Request password reset
  async requestPasswordReset(email: string) {
    try {
      // Try regular user password reset first
      try {
        await pb.collection('users').requestPasswordReset(email);
        return { success: true };
      } catch (userError) {
        // Try admin password reset as fallback
        try {
          await pb.admins.requestPasswordReset(email);
          return { success: true };
        } catch (adminError) {
          return { success: false, error: 'Password reset failed. User not found.' };
        }
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Password reset failed' };
    }
  },

  // Refresh authentication
  async refresh() {
    try {
      if (pb.authStore.isValid) {
        // Try both admin and user refresh methods
        try {
          // First try admin refresh
          await pb.admins.authRefresh();
          return true;
        } catch (adminError) {
          // If admin refresh fails, try user refresh
          try {
            await pb.collection('users').authRefresh();
            return true;
          } catch (userError) {
            console.error('Both admin and user refresh failed:', { adminError, userError });
            throw userError;
          }
        }
      }
      return false;
    } catch (error) {
      console.error('Auth refresh failed:', error);
      pb.authStore.clear();
      return false;
    }
  }
};

// Initialize auth state on client
if (typeof window !== 'undefined') {
  // Skip automatic refresh on initialization to avoid 403 errors
  // The refresh will be handled manually when needed
} 