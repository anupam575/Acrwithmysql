"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";
import CircularProgress from "@mui/material/CircularProgress";


// 🔥 OTP INPUT
function OTPInput({ length, value, onChange }) {
  const inputs = Array(length).fill(0);

  const handleInputChange = (e, i) => {
    const val = e.target.value.replace(/\D/, "");
    if (!val) return;

    const newValue = value.split("");
    newValue[i] = val;

    onChange(newValue.join("").slice(0, length));

    const next = e.target.nextSibling;
    if (next) next.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {inputs.map((_, i) => (
        <input
          key={i}
          type="text"
          maxLength="1"
          value={value[i] || ""}
          onChange={(e) => handleInputChange(e, i)}
          className="w-12 h-12 text-center border rounded-md text-xl focus:ring-2 focus:ring-indigo-400 outline-none"
        />
      ))}
    </div>
  );
}


export default function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ EMAIL FROM URL
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  // 🔥 TIMER
  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  // ❌ EMAIL NA HO TO REDIRECT
  useEffect(() => {
    if (!email) {
      toast.error("Email missing. Please register again.");
      router.push("/register");
    }
  }, [email, router]);

  // 🔥 VERIFY
  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Enter 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.post("/verify-email", {
        email,
        otp,
      });

      toast.success(data.message || "Verified!");

      // ✅ STORE TOKENS
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      setTimeout(() => {
        router.push("/employee");
      }, 1000);

    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 RESEND OTP
  const handleResend = async () => {
    try {
      setResendLoading(true);

      const { data } = await API.post("/resend-otp", { email });

      toast.success(data.message || "OTP resent");
      setResendTimer(60);

    } catch (err) {
      toast.error(err.response?.data?.message || "Resend failed");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-5">

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

        <h2 className="text-2xl font-bold text-center mb-4">
          Verify Email
        </h2>

        <p className="text-center text-gray-600 mb-6">
          OTP sent to <strong>{email}</strong>
        </p>

        <OTPInput length={6} value={otp} onChange={setOtp} />

        {/* VERIFY BUTTON */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full mt-6 bg-indigo-500 text-white py-3 rounded-md flex justify-center items-center gap-2 hover:bg-indigo-600"
        >
          {loading && <CircularProgress size={20} color="inherit" />}
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        {/* RESEND */}
        <div className="text-center mt-4">
          <button
            onClick={handleResend}
            disabled={resendLoading || resendTimer > 0}
            className={`text-sm ${
              resendLoading || resendTimer > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-indigo-500 hover:underline"
            }`}
          >
            {resendLoading
              ? "Resending..."
              : resendTimer > 0
              ? `Resend in ${resendTimer}s`
              : "Resend OTP"}
          </button>
        </div>

      </div>
    </div>
  );
}