import { useEffect, useState } from "react";
import api from "../api/api";

export default function Projects() {
  const isLogged = !!localStorage.getItem("token");
  const [orderId, setOrderId] = useState(null);
  const [utr, setUtr] = useState("");
  const [projects, setProjects] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingBuyId, setLoadingBuyId] = useState(null);
  const [loadingDownloadId, setLoadingDownloadId] = useState(null);

  useEffect(() => {
  fetchProjects();

  if (localStorage.getItem("token")) {
    fetchOrders();
  }
}, []);

  const fetchProjects = async () => {
    const res = await api.get("/projects");
    setProjects(res.data);
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data);
    } catch {
      // not logged in — ignore
    }
  };

  const getOrderForProject = (projectId) => {
    return orders.find((o) => o.project?._id === projectId);
  };

  // 🔥 LOGIN CHECK + BUY
  const isLoggedIn = () => !!localStorage.getItem("token");
const handleBuy = async () => {

  if (!isLoggedIn()) {
    alert("Please login first");
    window.location.href = "/login";
    return;
  }

  try {
    const res = await api.post("/manual-payment/create-order", {
      projectId: project._id,
    });

    setOrderId(res.data._id);

  } catch (err) {
    alert(err.response?.data?.message || "Error");
  }
};


const submitUTR = async () => {
  try {
    await api.post(`/manual-payment/submit-utr/${orderId}`, {
      utr,
    });

    alert("Payment submitted for verification");
    setOrderId(null);
    setUtr("");
  } catch (err) {
    alert("Error submitting UTR");
  }
};
  const handleDownload = async (projectId, title) => {
    if (!localStorage.getItem("token")) {
    window.location.href = "/login";
    return;
  }
    try {
      setLoadingDownloadId(projectId);

      const res = await api.get(`/download/${projectId}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${title}.zip`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert(err.response?.data?.message || "Download failed");
    } finally {
      setLoadingDownloadId(null);
    }
  };

  return (
    <div className="projects-page">

      <div className="projects-header">
        <h1>Explore Projects</h1>
        <p>Production-ready systems you can actually use.</p>
      </div>

      <div className="projects-grid">

        {projects.map((p) => {
          const order = getOrderForProject(p._id);

          return (
            <div key={p._id} className="project-card-main">

              <img src="https://picsum.photos/500/300" alt="" />

              <div className="project-content-main">
                <h3>{p.title}</h3>
                <p>{p.description}</p>

                <strong>₹{p.price}</strong>

                <div className="project-actions">

                  {/* BUY / BUY AGAIN */}
                  {isLogged && (!order || order.status === "REJECTED") && (
                    <button
                      disabled={loadingBuyId === p._id}
                      onClick={() => handleBuy(p._id)}
                    >
                      {loadingBuyId === p._id
                        ? "Processing..."
                        : order?.status === "REJECTED"
                        ? "Buy Again"
                        : "Buy"}
                    </button>
                  )}
                  {orderId && (
  <div style={{ marginTop: "20px" }}>
    <h3>Complete Payment</h3>

    <p>Send payment to UPI:</p>
    <b>yourupi@okaxis</b>

    <br /><br />

    <input
      type="text"
      placeholder="Enter UTR number"
      value={utr}
      onChange={(e) => setUtr(e.target.value)}
    />

    <br /><br />

    <button onClick={submitUTR}>
      Submit Payment
    </button>
  </div>
)}

                  {/* DOWNLOAD */}
                 {isLogged && order?.status === "PAID" && (
                    <button
                      disabled={loadingDownloadId === p._id}
                      onClick={() =>
                        handleDownload(p._id, p.title)
                      }
                    >
                      {loadingDownloadId === p._id
                        ? "Preparing..."
                        : "Download"}
                    </button>
                  )}

                  {/* STATUS */}
                  {order && (
                    <span className="status">
                      {order.status}
                    </span>
                  )}

                  {/* REJECT MESSAGE */}
                  {order?.status === "REJECTED" && (
                    <p style={{ color: "red", fontSize: "12px" }}>
                      Payment rejected. Try again.
                    </p>
                  )}

                </div>
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}