import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import AuthFooterLink from "../components/auth/AuthFooterLink";
import InputField from "../components/ui/InputField";
import PasswordInput from "../components/ui/PasswordInput";
import Button from "../components/ui/Button";

import { useLogin } from "../src/hooks/mutuations/useLogin";
import { useAuth } from "../Context/authContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { checkLoginStatus } = useAuth();

  const { mutate, isPending, error: loginError, reset } = useLogin();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
    if (loginError) reset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Enter your email and password to continue.");
      return;
    }

    setError("");

    mutate(
      { email: form.email, password: form.password },
      {
        onSuccess: (response) => {
         
          navigate("/register", { replace: true });
        },
      }
    );
  };

  const errorMessage = error || loginError?.message;

  return (
    <AuthLayout title="Login to your account">
      {errorMessage && (
        <div className="mb-2 text-sm text-red-500">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <InputField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />

        <PasswordInput
          name="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </Button>
      </form>

      <AuthFooterLink
        text="Don't have an account?"
        linkText="Sign up"
        to="/signup"
      />
    </AuthLayout>
  );
}