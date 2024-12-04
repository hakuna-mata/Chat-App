import React from "react";
import { useSpring, animated } from "@react-spring/web";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  
  const animationProps = useSpring({
    opacity: 1,
    transform: "translateY(0)",
    from: { opacity: 0, transform: "translateY(-20px)" },
    config: { duration: 300 },
  });

  return (
    <animated.div
      style={{
        ...animationProps,
        backgroundColor: "#ffe6e6",
        color: "#d8000c",
        padding: "1rem",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
      }}
      role="alert"
    >
      <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
        Something went wrong!
      </p>
      <pre style={{ marginBottom: "1rem", whiteSpace: "pre-wrap" }}>
        {error.message}
      </pre>
      <button
        onClick={resetErrorBoundary}
        style={{
          backgroundColor: "#d8000c",
          color: "#fff",
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Try Again
      </button>
    </animated.div>
  );
};

export default ErrorFallback;
