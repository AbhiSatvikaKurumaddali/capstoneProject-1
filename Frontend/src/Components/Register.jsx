import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  pageBackground,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  mutedText,
  linkClass,
} from "../styles/common";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onUserRegister = async (userData) => {
    setLoading(true);
    setServerError(null);
    
    try {
      // FIXED: Correct endpoint - /user-api/register instead of /users
      const response = await axios.post(
        "https://blogapp-00eh.onrender.com/user-api/register",
        {
          firstName: userData.firstName,
          lastName: userData.lastName || "",
          email: userData.email.trim().toLowerCase(),
          password: userData.password,
          role: "USER" // Default role
        },
        { withCredentials: true }
      );
      
      if (response.status === 201) {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.response?.data?.message || "Registration failed";
      setServerError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        <h2 className={formTitle}>Create Account</h2>

        {serverError && (
          <p className={errorClass}>{serverError}</p>
        )}

        <form onSubmit={handleSubmit(onUserRegister)}>
          {/* First Name */}
          <div className={formGroup}>
            <label className={labelClass}>First Name *</label>
            <input
              type="text"
              placeholder="John"
              className={inputClass}
              {...register("firstName", {
                required: "First name is required",
              })}
            />
            {errors.firstName && (
              <p className={errorClass}>{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className={formGroup}>
            <label className={labelClass}>Last Name</label>
            <input
              type="text"
              placeholder="Doe"
              className={inputClass}
              {...register("lastName")}
            />
          </div>

          {/* Email */}
          <div className={formGroup}>
            <label className={labelClass}>Email *</label>
            <input
              type="email"
              placeholder="you@example.com"
              className={inputClass}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && (
              <p className={errorClass}>{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className={formGroup}>
            <label className={labelClass}>Password *</label>
            <input
              type="password"
              placeholder="••••••••"
              className={inputClass}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
            />
            {errors.password && (
              <p className={errorClass}>{errors.password.message}</p>
            )}
          </div>

          <button 
            type="submit" 
            className={submitBtn}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className={`${mutedText} text-center mt-5`}>
          Already have an account?{" "}
          <NavLink to="/login" className={linkClass}>
            Sign In
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Register;
