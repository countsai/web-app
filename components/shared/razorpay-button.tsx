"use client";

import { useEffect, useRef } from "react";

interface RazorpayButtonProps {
  paymentButtonId: string;
  prefillEmail?: string;
  className?: string;
}

export function RazorpayButton({ paymentButtonId, prefillEmail, className }: RazorpayButtonProps) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    form.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.async = true;
    script.setAttribute("data-payment_button_id", paymentButtonId);
    if (prefillEmail) {
      script.setAttribute("data-prefill.email", prefillEmail);
    }
    form.appendChild(script);
  }, [paymentButtonId, prefillEmail]);

  return <form ref={formRef} className={className} />;
}
