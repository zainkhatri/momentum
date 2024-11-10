// Home.jsx or pages/index.js
import React from "react";

function Feed() {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "black",
      color: "white",
      fontSize: "3rem",
      fontFamily: "Arial, sans-serif",
    },
  };

  return <div style={styles.container}>Momentum</div>;
}

export default Feed;
