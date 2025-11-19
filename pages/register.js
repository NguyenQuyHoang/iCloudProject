import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setMessage(data.message || "Đăng ký thành công!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Đăng ký</h1>
      <form onSubmit={handleRegister}>
        <input
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          placeholder="Mật khẩu"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
