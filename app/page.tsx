// Home.jsx or pages/index.js
import React from "react";
import Link from "next/link";
import type { CSSProperties } from "react";

function Home() {
  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "black",
    color: "white",
    fontSize: "3rem",
    fontFamily: "Arial, sans-serif",
  };

  const buttonStyle: CSSProperties = {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "1rem",
    color: "black",
    backgroundColor: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    textDecoration: "none",
  };

  return (
    <div style={containerStyle}>
      Momentum
      <Link href="/login" style={buttonStyle}>
        Go to Login
      </Link>
    </div>
  );
}

export default Home;
