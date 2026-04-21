import { supabase } from './supabase';

export interface AuthError {
  message: string;
}

export interface AuthResponse {
  success: boolean;
  error?: AuthError;
}

export const authService = {
  async signUp(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        return { success: false, error: { message: error.message } };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: { message: 'Erro ao criar conta' } };
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: { message: error.message } };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: { message: 'Erro ao fazer login' } };
    }
  },

  async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error: { message: error.message } };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: { message: 'Erro ao fazer logout' } };
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        return null;
      }

      return user;
    } catch (error) {
      return null;
    }
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
