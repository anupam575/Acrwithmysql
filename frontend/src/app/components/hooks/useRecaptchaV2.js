"use client";

import { useState } from "react";

export default function useRecaptchaV2() {
  const [captchaToken, setCaptchaToken] = useState(null);

  const setToken = (token) => {
    setCaptchaToken(token);
  };

  const resetCaptcha = () => {
    setCaptchaToken(null);

    if (window.grecaptcha?.reset) {
      window.grecaptcha.reset();
    }
  };

  return {
    captchaToken,
    setToken,
    resetCaptcha,
  };
}