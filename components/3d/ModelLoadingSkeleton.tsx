export function ModelLoadingSkeleton() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          border: "1px solid rgba(255,255,255,0.15)",
          borderTop: "1px solid rgba(0,229,255,0.8)",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <span
        style={{
          fontSize: "11px",
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
        }}
      >
        Loading 3D Model
      </span>
    </div>
  )
}
