import { useEffect, useState } from "react";
import api from "../api/api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data);
    } catch {
      alert("Failed to load your orders");
    }
  };

  const handleDownload = async (projectId, title) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/download/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        alert("Download not available");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.zip`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Download failed");
    }
  };

  return (
    <div className="orders-page">

  <h1>My Orders</h1>

  <div className="orders-grid">

    {orders.map((o) => (
      <div key={o._id} className="order-card">

        <h3>{o.project?.title}</h3>
        <p>₹{o.amount}</p>

        <span className={`status ${o.status}`}>
          {o.status}
        </span>

        {o.status === "PAID" && (
          <button
            onClick={() =>
              handleDownload(o.project._id, o.project.title)
            }
          >
            Download
          </button>
        )}

      </div>
    ))}

  </div>

</div>
  );
}
