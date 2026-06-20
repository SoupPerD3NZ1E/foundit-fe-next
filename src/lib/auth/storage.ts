const TOKEN_KEY = 'token';
const ROLE_KEY = 'role';
const SELECTED_ROLE_KEY = 'selected_role';

export const storage = {
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token.trim());
  },
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)?.trim() ?? null;
  },
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  setRole(role: string | null): void {
    if (!role) {
      localStorage.removeItem(ROLE_KEY);
      return;
    }
    localStorage.setItem(ROLE_KEY, role);
  },
  getRole(): string | null {
    return localStorage.getItem(ROLE_KEY);
  },
  removeRole(): void {
    localStorage.removeItem(ROLE_KEY);
  },

  setSelectedRole(role: string): void {
    localStorage.setItem(SELECTED_ROLE_KEY, role);
  },
  getSelectedRole(): string | null {
    return localStorage.getItem(SELECTED_ROLE_KEY);
  },
  clearSelectedRole(): void {
    localStorage.removeItem(SELECTED_ROLE_KEY);
  },

  isLoggedIn(): boolean {
    return !!localStorage.getItem(TOKEN_KEY)?.trim();
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
  },
};
