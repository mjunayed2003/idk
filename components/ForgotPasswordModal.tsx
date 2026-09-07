"use client";

import { useState } from "react";
import { 
  HiOutlineLockClosed, 
  HiOutlineXMark, 
  HiOutlineCheckCircle, 
  HiOutlineArrowPath, 
  HiOutlineEye, 
  HiOutlineEyeSlash,
  HiOutlineKey,
  HiOutlineIdentification
} from "react-icons/hi2";
import { useForgotPasswordMutation, useResetPasswordMutation } from "@/lib/store";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (identifier: string) => void;
  initialIdentifier?: string;
  isBn?: boolean;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  onSuccess,
  initialIdentifier = "",
  isBn = false,
}: ForgotPasswordModalProps) {
  const [step, setStep] = useState<"REQUEST_CODE" | "VERIFY_RESET" | "SUCCESS">("REQUEST_CODE");
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [forgotPassword, { isLoading: isSendingCode }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  if (!isOpen) return null;

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage(isBn ? "অনুগ্রহ করে আপনার ইমেইল অথবা মোবাইল নম্বর লিখুন।" : "Please enter your email or phone number.");
      return;
    }

    try {
      const res = await forgotPassword({ identifier: identifier.trim() }).unwrap();
      if (res.otp) {
        setGeneratedOtp(res.otp);
        setOtp(res.otp); // Pre-fill for ultra smooth testing
      }
      setStep("VERIFY_RESET");
    } catch (err: any) {
      setErrorMessage(
        err?.data?.message || 
        (isBn ? "এই ইমেইল বা নম্বরে কোনো অ্যাকাউন্ট পাওয়া যায়নি।" : "No account found with this email or phone number.")
      );
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!otp.trim()) {
      setErrorMessage(isBn ? "যাচাই কোড লিখুন।" : "Please enter the verification code.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage(isBn ? "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।" : "Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(isBn ? "উভয় পাসওয়ার্ড একই হতে হবে।" : "Passwords do not match.");
      return;
    }

    try {
      await resetPassword({
        identifier: identifier.trim(),
        otp: otp.trim(),
        newPassword,
      }).unwrap();

      setStep("SUCCESS");
      setTimeout(() => {
        onSuccess(identifier.trim());
        handleClose();
      }, 2000);
    } catch (err: any) {
      setErrorMessage(
        err?.data?.message || 
        (isBn ? "ভুল অথবা মেয়াদোত্তীর্ণ কোড! আবার চেষ্টা করুন।" : "Invalid or expired code. Please try again.")
      );
    }
  };

  const handleClose = () => {
    setStep("REQUEST_CODE");
    setOtp("");
    setGeneratedOtp(null);
    setNewPassword("");
    setConfirmPassword("");
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <HiOutlineXMark className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#064E3B]/10 text-[#064E3B] border border-[#D4AF37]/30">
            <HiOutlineKey className="h-6 w-6 text-[#D4AF37]" />
          </div>
          <h2 className="text-xl font-bold text-[#022C22]">
            {isBn ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot Password?"}
          </h2>
          <p className="mt-1 text-xs text-[#065F46] max-w-xs">
            {isBn 
              ? "আপনার অ্যাকাউন্টের ইমেইল বা মোবাইল নম্বর দিয়ে নতুন পাসওয়ার্ড সেট করুন।"
              : "Reset your password using your registered email or mobile number."}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-200">
            {errorMessage}
          </div>
        )}

        {/* STEP 1: Enter Email or Phone */}
        {step === "REQUEST_CODE" && (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#022C22]">
                {isBn ? "ইমেইল অথবা মোবাইল নম্বর" : "Email or Phone Number"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder={isBn ? "যেমন: admin@example.com বা 01700000000" : "e.g. admin@example.com or 01700000000"}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-[#D4AF37] focus:bg-white focus:outline-none"
                  autoFocus
                />
              </div>
              <p className="mt-1.5 text-[11px] text-[#065F46]/80">
                {isBn ? "ডিফল্ট অ্যাডমিন নম্বর: 01700000000" : "Default admin phone: 01700000000"}
              </p>
            </div>

            <button
              type="submit"
              disabled={isSendingCode}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#064E3B] hover:bg-[#043c2e] py-3 text-center text-xs font-bold uppercase tracking-wider text-white transition shadow-lg shadow-[#064E3B]/30 border border-[#D4AF37] disabled:opacity-50"
            >
              {isSendingCode ? (
                <>
                  <HiOutlineArrowPath className="h-4 w-4 animate-spin text-[#D4AF37]" />
                  {isBn ? "যাচাই করা হচ্ছে..." : "Sending Code..."}
                </>
              ) : (
                isBn ? "যাচাইকরণ কোড পাঠান" : "Send Verification Code"
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Enter OTP & New Password */}
        {step === "VERIFY_RESET" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* Generated Code Alert Box */}
            {generatedOtp && (
              <div className="rounded-xl bg-[#F0FDF4] border border-[#D4AF37] p-3 text-center">
                <p className="text-[11px] font-medium text-[#064E3B]">
                  {isBn ? "আপনার যাচাইকরণ কোড (OTP):" : "Your Verification Code (OTP):"}
                </p>
                <div className="mt-1 font-mono text-2xl font-black tracking-widest text-[#064E3B]">
                  {generatedOtp}
                </div>
                <p className="mt-0.5 text-[10px] text-[#059669]">
                  {isBn ? "(নিচে স্বয়ংক্রিয়ভাবে বসানো হয়েছে)" : "(Auto-filled below for easy testing)"}
                </p>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#022C22]">
                {isBn ? "৬ সংখ্যার যাচাই কোড" : "6-digit Verification Code"}
              </label>
              <input
                type="text"
                value={otp}
                maxLength={6}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="123456"
                className="w-full font-mono text-center tracking-widest text-lg font-bold rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-900 focus:border-[#D4AF37] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#022C22]">
                {isBn ? "নতুন পাসওয়ার্ড" : "New Password"}
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#D4AF37] focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? <HiOutlineEyeSlash className="h-4 w-4" /> : <HiOutlineEye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#022C22]">
                {isBn ? "নতুন পাসওয়ার্ড নিশ্চিত করুন" : "Confirm New Password"}
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#D4AF37] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep("REQUEST_CODE")}
                className="w-1/3 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                {isBn ? "পেছনে যান" : "Back"}
              </button>
              <button
                type="submit"
                disabled={isResetting}
                className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-[#064E3B] hover:bg-[#043c2e] py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white transition shadow-lg shadow-[#064E3B]/30 border border-[#D4AF37] disabled:opacity-50"
              >
                {isResetting ? (
                  <>
                    <HiOutlineArrowPath className="h-4 w-4 animate-spin text-[#D4AF37]" />
                    {isBn ? "রিসেট হচ্ছে..." : "Resetting..."}
                  </>
                ) : (
                  isBn ? "পাসওয়ার্ড পরিবর্তন করুন" : "Set New Password"
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Success Screen */}
        {step === "SUCCESS" && (
          <div className="py-6 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <HiOutlineCheckCircle className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {isBn ? "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!" : "Password Reset Successfully!"}
            </h3>
            <p className="text-xs text-slate-500">
              {isBn ? "এখন আপনার নতুন পাসওয়ার্ড দিয়ে লগইন করুন।" : "You can now log in with your newly set password."}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
