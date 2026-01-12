import { api } from "@/lib/apiClient";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/auth/register', { name, email, password, confirmPassword })
  }

  return (
    <form onSubmit={onSubmit} className=" border-2 border-amber-700">
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input autoComplete="email" type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input autoComplete="new-password" type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input autoComplete="new-password" type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
      </div>
      <button type="submit">Register</button>
      <p>already have an account? <Link to="/auth/login">Login</Link></p>
    </form>
  )
}