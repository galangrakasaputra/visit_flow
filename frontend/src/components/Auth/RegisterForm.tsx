import { useState } from "react";
import { registerUser } from "../../api/AuthApi";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    setLoading(true);

    try {
        const response = await registerUser({
            name,
            email,
            password,
        });

        if (response.status === "success") {
            setSuccess(response.message);
            setError("");

            setName("");
            setEmail("");
            setPassword("");
        } else {
            setError(response.message);
            setSuccess("");
        }
        } catch (err) {
        setError(
            err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat registrasi."
        );
        } finally {
        setLoading(false);
        }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Full Name
        </label>

        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label
          htmlFor="register-email"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>

        <input
          type="email"
          id="register-email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label
          htmlFor="register-password"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Password
        </label>

        <input
          type="password"
          id="register-password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          minLength={8}
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}

export default RegisterForm;