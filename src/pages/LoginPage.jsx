import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import RegisterLoginHeader from "../components/RegisterLoginHeader";
import Button from "../components/Button";
import api from "../lib/api";
import { toast } from "react-toastify";
import { PATHS, USER } from "../constants";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useShop();
  const appName = import.meta.env.VITE_APP_TITLE;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errorMessage = "";

    if (!email || !password)
      errorMessage = "Please fill in all fields to proceed.";

    if (password.length < 6)
      errorMessage =
        "Security verification failed. Password must be at least 6 characters.";

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        email: email,
        password: password,
      };

      const response = await api.post("/auth/login", payload);
      const { accessToken, user } = response.data.data;

      login({
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: accessToken,
      });

      toast.success("Account verified successfully! Redirecting to homepage.");

      console.log(user);
      if (user.role == USER) {
        navigate(PATHS.HOME);
      } else {
        navigate(PATHS.ADMIN_HOME);
      }
    } catch (error) {
      console.log(error.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const forms = [
    {
      name: "email",
      label: "Email Address",
      inputType: "email",
      onChange: (e) => setEmail(e.target.value),
      value: email,
      placeholder: "name@example.com",
    },
    {
      name: "password",
      label: "Password",
      inputType: "password",
      onChange: (e) => setPassword(e.target.value),
      value: password,
      placeholder: "••••••••",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased text-gray-900">
      <RegisterLoginHeader
        sloganText={"Sign in to access your cart and exclusive savings"}
      />

      <div className="mt-8 sm:mx-auto w-full max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-gray-200 rounded-xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3.5 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-100 animate-pulse">
                {error}
              </div>
            )}

            {forms.map((i) => (
              <>
                <div>
                  <label
                    htmlFor={i.name}
                    className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5"
                  >
                    {i.label}
                  </label>
                  <input
                    id={i.name}
                    name={i.name}
                    type={i.inputType}
                    value={i.value}
                    onChange={i.onChange}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow"
                    placeholder={i.placeholder}
                  />
                </div>
              </>
            ))}

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-xs font-medium text-gray-600 select-none"
                >
                  Keep me signed in
                </label>
              </div>
            </div>

            <div className="pt-2">
              <Button
                isLoading={isLoading}
                loadingText="Verifying..."
                text="Sign In"
                type="submit"
              />
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs">
            <span className="text-gray-500">New to {appName}? </span>
            <span
              onClick={() => navigate(PATHS.REGISTER)}
              className="text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Create an account
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
