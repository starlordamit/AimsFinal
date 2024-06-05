// src/hooks/useAuth.js

const useAuth = () => {
  const token = localStorage.getItem("token");
  const userDetails = localStorage.getItem("userDetails");
  const data = localStorage.getItem("data");

  return Boolean(token && userDetails && data);
};

export default useAuth;
