import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaFacebook,
  FaTwitter,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc"; // Google multicolor icon
import regImage from "../assets/reg.jpg";
import loginImage from "../assets/login.jpg";

export default function LoginModal({ isOpen, onClose, navigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isResetPassword, setIsResetPassword] = useState(false);

  const { login } = useAuth();
  const API_BASE_URL = "https://freshkart-nfjt.onrender.com/api";

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Logging in...");
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.role, String(data.userId));
        toast.success(data.message, { id: loadingToast });
        onClose();
        if (data.role === "admin") navigate("/admin/dashboard");
        else if (data.role === "customer") navigate("/customer-profile");
      } else {
        toast.error(data.message || "Login failed", { id: loadingToast });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login.", { id: loadingToast });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password || !confirmPassword) {
      toast.error("All fields are mandatory.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const loadingToast = toast.loading("Registering...");
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message, { id: loadingToast });
        setIsRegistering(false);
        setEmail("");
        setPassword("");
        setName("");
        setPhone("");
        setConfirmPassword("");
      } else {
        toast.error(data.message || "Registration failed", { id: loadingToast });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration.", { id: loadingToast });
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      {/* Modal Card with 3D tilt */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        whileHover={{ rotateY: 5, rotateX: -5 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className="relative flex w-full max-w-4xl overflow-hidden bg-white shadow-2xl rounded-2xl"
      >
        {/* Always visible close button */}
        <button
          onClick={onClose}
          className="absolute z-50 text-2xl text-gray-500 transition top-4 right-4 hover:text-red-500"
        >
          <FaTimes />
        </button>

        {/* Left Side Image/Panel */}
        <motion.div
          animate={{ x: isRegistering ? "100%" : "0%" }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="relative items-center justify-center hidden w-1/2 p-8 text-white md:flex overflow-hidden"
        >
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${isRegistering ? regImage : loginImage})` }}></div>
          <h2 className="relative z-10 text-3xl font-bold leading-snug text-center">
            {isRegistering ? "Join Us Today 🚀" : "Welcome Back 👋"}
          </h2>
        </motion.div>

        {/* Right Side Form */}
        <motion.div
          animate={{ x: isRegistering ? "-100%" : "0%" }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="w-full p-8 md:w-1/2"
        >
          <h2 className="mb-6 text-2xl font-bold text-center text-blue-600">
            {isRegistering ? "Create Account" : "Sign In"}
          </h2>

          <form
            onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit}
            className="space-y-4"
          >
            {isRegistering && (
              <>
                <InputField
                  id="name"
                  label="Full Name"
                  type="text"
                  value={name}
                  setValue={setName}
                  icon={<FaUser />}
                />
                <InputField
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  value={phone}
                  setValue={setPhone}
                  icon={<FaPhone />}
                />
              </>
            )}

            <InputField
              id="email"
              label="Email Address"
              type="email"
              value={email}
              setValue={setEmail}
              icon={<FaEnvelope />}
            />

            <PasswordField
              id="password"
              label="Password"
              value={password}
              setValue={setPassword}
            />

            {isRegistering && (
              <PasswordField
                id="confirmPassword"
                label="Confirm Password"
                value={confirmPassword}
                setValue={setConfirmPassword}
              />
            )}

            <button
              type="submit"
              className="w-full py-2 font-semibold text-white transition bg-blue-600 rounded-lg shadow-md cursor-pointer hover:bg-blue-700 hover:shadow-xl"
            >
              {isRegistering ? "Register" : "Sign In"}
            </button>
          </form>

          {/* Social Buttons */}
          <div className="mt-6 space-y-3">
            <p className="text-sm text-center text-gray-500">or continue with</p>
            <div className="flex justify-center gap-4">
              <SocialButton
                icon={<FcGoogle className="text-2xl" />}
                bg="bg-white border"
                glow="0 0 20px 4px rgba(66,133,244,0.5)"
              />
              <SocialButton
                icon={<FaFacebook className="text-2xl text-white" />}
                bg="bg-blue-600"
                glow="0 0 20px 4px rgba(59,89,152,0.6)"
              />
              <SocialButton
                icon={<FaTwitter className="text-2xl text-white" />}
                bg="bg-sky-400"
                glow="0 0 20px 4px rgba(29,155,240,0.6)"
              />
            </div>
          </div>

          <div className="flex justify-between mt-4 text-sm">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-500 hover:underline"
            >
              {isRegistering
                ? "Already have an account?"
                : "Create an account"}
            </button>
            {!isRegistering && (
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot Password?
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Forgot Password Modal */}
      {isForgotPassword && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl"
          >
            <button
              onClick={() => setIsForgotPassword(false)}
              className="absolute z-50 text-2xl text-gray-500 transition top-4 right-4 hover:text-red-500"
            >
              <FaTimes />
            </button>
            <h2 className="mb-6 text-2xl font-bold text-center text-blue-600">
              Forgot Password
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!otpSent) {
                  // Send OTP
                  const loadingToast = toast.loading("Sending OTP...");
                  try {
                    const response = await fetch(`${API_BASE_URL}/send-otp`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email }),
                    });
                    const data = await response.json();
                    if (response.ok) {
                      toast.success(data.message, { id: loadingToast });
                      setOtpSent(true);
                    } else {
                      toast.error(data.message || "Failed to send OTP", { id: loadingToast });
                    }
                  } catch (error) {
                    console.error("Send OTP error:", error);
                    toast.error("An error occurred while sending OTP.", { id: loadingToast });
                  }
                } else {
                  // Verify OTP
                  const loadingToast = toast.loading("Verifying OTP...");
                  try {
                    const response = await fetch(`${API_BASE_URL}/verify-otp`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email, otp }),
                    });
                    const data = await response.json();
                    if (response.ok) {
                      toast.success(data.message, { id: loadingToast });
                      setIsForgotPassword(false);
                      setIsResetPassword(true);
                    } else {
                      toast.error(data.message || "Invalid OTP", { id: loadingToast });
                    }
                  } catch (error) {
                    console.error("Verify OTP error:", error);
                    toast.error("An error occurred while verifying OTP.", { id: loadingToast });
                  }
                }
              }}
              className="space-y-4"
            >
              {!otpSent ? (
                <InputField
                  id="forgot-email"
                  label="Email Address"
                  type="email"
                  value={email}
                  setValue={setEmail}
                  icon={<FaEnvelope />}
                />
              ) : (
                <InputField
                  id="otp"
                  label="OTP"
                  type="text"
                  value={otp}
                  setValue={setOtp}
                  icon={<FaLock />}
                />
              )}
              <button
                type="submit"
                className="w-full py-2 font-semibold text-white transition bg-blue-600 rounded-lg shadow-md cursor-pointer hover:bg-blue-700 hover:shadow-xl"
              >
                {otpSent ? "Verify OTP" : "Send OTP"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Reset Password Modal */}
      {isResetPassword && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl"
          >
            <button
              onClick={() => setIsResetPassword(false)}
              className="absolute z-50 text-2xl text-gray-500 transition top-4 right-4 hover:text-red-500"
            >
              <FaTimes />
            </button>
            <h2 className="mb-6 text-2xl font-bold text-center text-blue-600">
              Reset Password
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const loadingToast = toast.loading("Resetting password...");
                try {
                  const response = await fetch(`${API_BASE_URL}/reset-password`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, otp, newPassword }),
                  });
                  const data = await response.json();
                  if (response.ok) {
                    toast.success(data.message, { id: loadingToast });
                    setIsResetPassword(false);
                  } else {
                    toast.error(data.message || "Failed to reset password", { id: loadingToast });
                  }
                } catch (error) {
                  console.error("Reset password error:", error);
                  toast.error("An error occurred while resetting password.", { id: loadingToast });
                }
              }}
              className="space-y-4"
            >
              <PasswordField
                id="new-password"
                label="New Password"
                value={newPassword}
                setValue={setNewPassword}
              />
              <button
                type="submit"
                className="w-full py-2 font-semibold text-white transition bg-blue-600 rounded-lg shadow-md cursor-pointer hover:bg-blue-700 hover:shadow-xl"
              >
                Reset Password
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

function InputField({ id, label, type, value, setValue, icon }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-1 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 flex items-center text-gray-400 left-3">
          {icon}
        </span>
        <input
          type={type}
          id={id}
          className="w-full py-2 pl-10 pr-3 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
      </div>
    </div>
  );
}

function PasswordField({ id, label, value, setValue }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-1 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 flex items-center text-gray-400 left-3">
          <FaLock />
        </span>
        <input
          type={show ? "text" : "password"}
          id={id}
          className="w-full py-2 pl-10 pr-10 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
        <span
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 flex items-center text-gray-400 cursor-pointer right-3"
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
    </div>
  );
}

function SocialButton({ icon, bg, glow }) {
  return (
    <motion.button
      whileHover={{ scale: 1.15, rotate: 8 }}
      whileTap={{ scale: 0.9 }}
      className={`${bg} w-12 h-12 flex items-center justify-center rounded-full shadow-lg cursor-pointer transition`}
      style={{ boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = glow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
      }}
    >
      {icon}
    </motion.button>
  );
}
