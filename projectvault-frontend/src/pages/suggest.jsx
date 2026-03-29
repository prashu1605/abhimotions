import { useState } from "react";

export default function Suggest() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      alert("Enter valid email");
      return;
    }

    await fetch("http://localhost:5000/suggestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, message })
    });

    alert("Suggestion submitted");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="suggest-page">
      <div className="suggest-box">
        <h2>Share Your Idea</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <textarea
            placeholder="Your suggestion..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}