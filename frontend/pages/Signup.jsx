import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import AuthFooterLink from "../components/auth/AuthFooterLink";
import InputField from "../components/ui/InputField";
import PasswordInput from "../components/ui/PasswordInput";
import Button from "../components/ui/Button";

import { useSignup } from "../src/hooks/mutuations/useSignup";
import { useAuth } from "../Context/authContext";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { checkLoginStatus } = useAuth();

  const { mutate, isPending, error: signupError, reset } = useSignup();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
    if (signupError) reset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");

    mutate(
      { name: form.name, email: form.email, password: form.password },
      {
        onSuccess: (response) => {
          checkLoginStatus(response);
          navigate("/", { replace: true });
        },
      }
    );
  };

  const errorMessage = error || signupError?.message;

  return (
    <AuthLayout title="Create an Account" subtitle="Register to start chat">
      {errorMessage && (
        <div className="mb-2 text-sm text-red-500">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <InputField
          label="Name"
          name="name"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your name"
        />

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
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>

      <AuthFooterLink
        text="Already have an account?"
        linkText="Login"
        to="/login"
      />
    </AuthLayout>
  );
}