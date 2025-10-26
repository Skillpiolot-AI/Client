export default function NumbersThatSpeak({ width = "100%", height = "100%", theme = "light", className = "" }) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        background: theme === "light" ? "#ffffff" : "#333937",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: theme === "light" ? "#1b1919" : "#f8f8f8",
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "24px", marginBottom: "8px" }}>🌍</div>
        <div>Global Workshops</div>
      </div>
    </div>
  )
}
