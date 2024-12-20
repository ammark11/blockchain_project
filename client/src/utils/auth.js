export const isAuthenticated = () => {
  return !!localStorage.getItem('jwt_token');
};

export const logout = () => {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('private_key');
  // You might want to trigger a component re-render or redirect here
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('jwt_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}; 