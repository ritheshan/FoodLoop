const API_URL = `${import.meta.env.VITE_BACKEND_API}/api/auth`;

export const signupUser = async (userData) => {
  try {
    console.log("Signup request data:", userData);
 

    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return response.json();
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Signup failed" };
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (data.token) {
      localStorage.setItem("token", data.token); // Store JWT token
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Login failed" };
  }
};

export const logoutUser = async () => {
  localStorage.removeItem("token"); // Remove JWT on logout
  return true;
};
