type AuthHeaderProps = {
  activeTab: "login" | "register";
  onChange: (tab: "login" | "register") => void;
};

function AuthHeader({ activeTab, onChange }: AuthHeaderProps) {
  return (
    <div className="mb-8">
      <div className="mb-7 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Welcome Back
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Silakan masuk atau buat akun untuk melanjutkan.
        </p>
      </div>

      <div className="grid grid-cols-2 rounded-xl bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => onChange("login")}
          className={`rounded-lg py-2.5 text-sm font-medium transition-all ${
            activeTab === "login"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => onChange("register")}
          className={`rounded-lg py-2.5 text-sm font-medium transition-all ${
            activeTab === "register"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default AuthHeader;