import { api } from "@/lib/apiClient";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await api.post('/auth/login', { email, password });
    console.log(data);
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input autoComplete="email" type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input autoComplete="off" type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button type="submit">Login</button>
      <p>Don't have an account? <Link to="/auth/register">Register</Link></p>
    </form>
  )
}