// Sistema simples de autenticação com credenciais fixas
const CREDENTIALS = {
  email: 'admin@admin',
  password: 'admin123456'
};

export const simpleAuth = {
  login: (email: string, password: string): boolean => {
    if (email === CREDENTIALS.email && password === CREDENTIALS.password) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({ email, name: 'Admin' }));
      return true;
    }
    return false;
  },

  logout: (): void => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem('isAuthenticated') === 'true';
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
