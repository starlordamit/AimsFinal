// src/hooks/useAuth.js

const useAuth = () => {
  const token = sessionStorage.getItem("token");
  const userDetails = sessionStorage.getItem("userDetails");
  const data = sessionStorage.getItem("data");

  return Boolean(token && userDetails && data);
};

export default useAuth;
