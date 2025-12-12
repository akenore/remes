import PocketBase from 'pocketbase';

const isBrowser = typeof window !== 'undefined';
const clientBaseUrl = '/api/pb';
const serverBaseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;

export const pb = new PocketBase(isBrowser ? clientBaseUrl : serverBaseUrl);

pb.autoCancellation(false);

if (typeof window !== 'undefined') {
  const authData = localStorage.getItem('pocketbase_auth');
  if (authData) {
    try {
      pb.authStore.save(JSON.parse(authData).token, JSON.parse(authData).record);
    } catch (e) {
      localStorage.removeItem('pocketbase_auth');
    }
  }

  pb.authStore.onChange((token, record) => {
    if (token && record) {
      localStorage.setItem('pocketbase_auth', JSON.stringify({ token, record }));
    } else {
      localStorage.removeItem('pocketbase_auth');
    }
  });
}

export const authHelper = {
  async login(email: string, password: string) {
    try {
      try {
        const authData = await pb.collection('users').authWithPassword(email, password);
        return { success: true, user: authData.record };
      } catch (userError) {
        try {
          const authData = await pb.admins.authWithPassword(email, password);
          return { success: true, user: authData.record };
        } catch (adminError) {
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

  async createUser(email: string, password: string, name?: string) {
    try {
      const userData = {
        email,
        password,
        passwordConfirm: password,
        name: name || email.split('@')[0],
        emailVisibility: false
      };

      const record = await pb.collection('users').create(userData);
      return { success: true, user: record };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'User creation failed' };
    }
  },

  logout() {
    pb.authStore.clear();
  },
  isAuthenticated() {
    return pb.authStore.isValid;
  },

  getCurrentUser() {
    return pb.authStore.record;
  },
  async requestPasswordReset(email: string) {
    try {
      try {
        await pb.collection('users').requestPasswordReset(email);
        return { success: true };
      } catch (userError) {
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

  async refresh() {
    try {
      if (pb.authStore.isValid) {
        try {
          await pb.admins.authRefresh();
          return true;
        } catch (adminError) {
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

if (typeof window !== 'undefined') {
  // Skip automatic refresh on initialization to avoid 403 errors
  // The refresh will be handled manually when needed
} 