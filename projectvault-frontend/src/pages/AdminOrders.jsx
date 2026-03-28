import { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders/admin/pending");
      setOrders(res.data);
    } catch {
      alert("Failed to load orders");
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.post(`/orders/admin/update-status/${orderId}`, { status });
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch {
      alert("Action failed");
    }
  };

  return (
    <div className="admin-page" >
      <h2>Admin Orders</h2>

      {orders.length === 0 && <p>No pending orders</p>}
      <div className="admin-table">
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Project</th>
            <th>Amount</th>
            <th>UTR</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{o._id}</td>
              <td>{o.user?.email}</td>
              <td>{o.project?.title}</td>
              <td>₹{o.amount}</td>
              <td>{o.utr || "—"}</td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => updateStatus(o._id, "PAID")}>
                  Approve
                </button>{" "}
                <button onClick={() => updateStatus(o._id, "REJECTED")}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}
