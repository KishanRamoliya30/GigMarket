import GigMarketLogo from "@/components/logo";
import * as React from "react";

interface OtpEmailProps {
  username?: string;
  otp: string;
}

export function OtpEmail({ username = "User", otp }: OtpEmailProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f4",
        padding: "40px 20px",
        color: "#333",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            color: "#1dbf73",
            margin: "0 0 20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <GigMarketLogo />
        </h2>

        <h1
          style={{
            fontSize: "24px",
            margin: "20px 0",
            display: "flex",
            justifyContent: "center",
          }}
        >
          Reset Your Password
        </h1>

        <p style={{ marginBottom: "20px" }}>
          Hi {username},
          <br />
          To set up a new password for your GigMarket account, please use the
          OTP below:
        </p>

        <div
          style={{
            backgroundColor: "#f1f5f9",
            textAlign: "center",
            fontSize: "28px",
            fontWeight: "bold",
            padding: "20px",
            borderRadius: "8px",
            color: "#2e7d32",
            letterSpacing: "6px",
            marginBottom: "24px",
          }}
        >
          {otp}
        </div>

        <p style={{ fontSize: "14px", color: "#555", marginBottom: "20px" }}>
          This OTP will expire in{" "}
          <strong style={{ color: "#1e40af" }}>10 minutes</strong>.
        </p>

        <p style={{ marginTop: "40px", fontSize: "14px", color: "#555" }}>
          Thanks,
          <br />
          The GigMarket Team
        </p>
      </div>
    </div>
  );
}
