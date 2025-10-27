export default function EffortlessIntegration({ width = 400, height = 250, className = "" }) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        background: "#f9f8f7",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#37322f",
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "24px", marginBottom: "8px" }}>🛣️</div>
        <div>Learning Roadmaps</div>
      </div>
    </div>
  )
}
