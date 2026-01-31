const TOKEN_KEY = "auth-token";

/**
 * Save JWT token to localStorage
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Get JWT token from localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove JWT token from localStorage (logout)
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};
