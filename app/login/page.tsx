"use client";
import React from "react";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const supabase = createClient(
  process.env.NEXT_PUBLIC_MOMENTUM_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_MOMENTUM_ANON_KEY as string
);

function App() {
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column" as "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#1a1a1a",
      color: "#fff",
      fontFamily: "Arial, sans-serif",
      padding: "20px",
    },
    title: {
      fontSize: "2rem",
      fontFamily: "Gill Sans",
      marginBottom: "20px",
    },
    auth: {
      width: "100%",
      maxWidth: "400px",
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "8px",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Momentum</h1>
      <div style={styles.auth}>
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
      </div>
    </div>
  );
}

export default App;
