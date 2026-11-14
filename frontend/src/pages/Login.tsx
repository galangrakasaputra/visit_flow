import { useState } from "react";
import { Navigate } from "react-router";
import { isAuthenticated } from "../utils/AuthStorage";

import AuthHeader from "../components/Auth/AuthHeader";
import LoginForm from "../components/Auth/LoginForm";
import RegisterForm from "../components/Auth/RegisterForm";
function Login() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-5 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-7 shadow-sm sm:p-9">
        <AuthHeader
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === "login" ? <LoginForm /> : <RegisterForm />}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            © 2026 All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;