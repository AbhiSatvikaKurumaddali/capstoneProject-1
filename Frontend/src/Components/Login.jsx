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

import { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const { login, currentUser, loading, isAuthenticated, error } = useAuth(
    (state) => state,
  );

  //CLEAN INPUT BEFORE SENDING
  const onUserLogin = (userCredObj) => {
    login({
      email: userCredObj.email.trim().toLowerCase(),
      password: userCredObj.password.trim(),
    });
  };

  const hasToasted = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !hasToasted.current) {
      hasToasted.current = true;

      if (currentUser?.role === "USER") {
        toast.success("Login successful, redirecting to user profile");
        navigate("/UserProfile");
      } else if (currentUser?.role === "AUTHOR") {
        toast.success("Login successful, redirecting to author profile");
        navigate("/Author");
      } else if (currentUser?.role === "ADMIN") {
        toast.success("Login successful, redirecting to admin profile");
        navigate("/AdminProfile");
      }
    }
  }, [currentUser, isAuthenticated, navigate]);

  if (loading) {
    return <p className="loadingclass">Loading...</p>;
  }

  return (
    <div
      className={`${pageBackground} flex items-center justify-center py-16 px-4`}
    >
      <div className={formCard}>
        <h2 className={formTitle}>Sign In</h2>

        
        {error && (
          <p className={errorClass}>
            {typeof error === "string"
              ? error
              : error?.message || "Login failed"}
          </p>
        )}

        <form onSubmit={handleSubmit(onUserLogin)}>
          {/* Email */}
          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className={inputClass}
              {...register("email", {
                required: "Email is required",
                validate: (value) =>
                  value.trim().length > 0 || "Email cannot be empty",
              })}
            />
            {errors.email && (
              <p className={errorClass}>{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className={inputClass}
              {...register("password", {
                required: "Password is required",
                validate: (value) =>
                  value.trim().length > 0 || "Password cannot be empty",
              })}
            />
            {errors.password && (
              <p className={errorClass}>{errors.password.message}</p>
            )}
          </div>

          <div className="text-right -mt-2 mb-4">
            <a href="/forgot-password" className={`${linkClass} text-xs`}>
              Forgot password?
            </a>
          </div>

          <button type="submit" className={submitBtn}>
            Sign In
          </button>
        </form>

        <p className={`${mutedText} text-center mt-5`}>
          Don't have an account?{" "}
          <NavLink to="/register" className={linkClass}>
            Create one
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;
