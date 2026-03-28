export default function StatusBadge({ status }) {
  const styles = {
    PAID: {
      color: "#155724",
      background: "#d4edda",
      label: "Approved",
    },
    PENDING_VERIFICATION: {
      color: "#856404",
      background: "#fff3cd",
      label: "Pending Verification",
    },
    REJECTED: {
      color: "#721c24",
      background: "#f8d7da",
      label: "Rejected",
    },
  };

  if (!styles[status]) return null;

  return (
    <span
      style={{
        padding: "4px 8px",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: "bold",
        color: styles[status].color,
        backgroundColor: styles[status].background,
        display: "inline-block",
        marginBottom: 6,
      }}
    >
      {styles[status].label}
    </span>
  );
}
