export type UserRole = 'worker';

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  is_worker: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: Profile | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
}

export const PASSWORD_REQUIREMENTS = {
  minLength: 10,
  patterns: {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    special: /[!@#$%^&*(),.?":{}|<>]/
  }
};

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`Mínimo ${PASSWORD_REQUIREMENTS.minLength} caracteres`);
  }
  if (!PASSWORD_REQUIREMENTS.patterns.uppercase.test(password)) {
    errors.push('Al menos una letra mayúscula');
  }
  if (!PASSWORD_REQUIREMENTS.patterns.lowercase.test(password)) {
    errors.push('Al menos una letra minúscula');
  }
  if (!PASSWORD_REQUIREMENTS.patterns.number.test(password)) {
    errors.push('Al menos un número');
  }
  if (!PASSWORD_REQUIREMENTS.patterns.special.test(password)) {
    errors.push('Al menos un carácter especial (!@#$%^&*(),.?":{}|<>)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}