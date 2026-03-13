const TOKEN_KEY = "auth-token";

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};


export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};


export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};
