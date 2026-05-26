import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import api from "../lib/api";
import { toast } from "react-toastify";
import RegisterLoginHeader from "../components/RegisterLoginHeader";
import { PATHS } from "../constants";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const forms = [
    {
      name: "fullName",
      label: "Full Name",
      inputType: "text",
      onChange: (e) => setFullName(e.target.value),
      value: fullName,
      placeholder: "John Doe",
    },
    {
      name: "email",
      label: "Email Address",
      inputType: "email",
      onChange: (e) => setEmail(e.target.value),
      value: email,
      placeholder: "you@example.com",
    },
    {
      name: "password",
      label: "Password",
      inputType: "password",
      onChange: (e) => setPassword(e.target.value),
      value: password,
      placeholder: "••••••••",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      inputType: "password",
      onChange: (e) => setConfirmPassword(e.target.value),
      value: confirmPassword,
      placeholder: "••••••••",
    },
  ];

  const handleRegisterSubmit = async (e) => {
    let errorMessage = "";
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword)
      errorMessage = "Please fill in all fields to construct your account.";

    if (password.length < 6)
      errorMessage =
        "Password security threshold unmet. Minimum length is 6 characters.";

    if (password !== confirmPassword)
      errorMessage =
        "Password match failure. Ensure both entries are identical.";

    if (!agreeTerms)
      errorMessage =
        "You must accept the terms and conditions to establish an account.";

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        name: fullName,
        email: email,
        password: password,
      };

      await api.post("/users", payload);
      toast.success(
        "Account registered successfully! Redirecting to login portal.",
      );
      navigate(PATHS.LOGIN);
    } catch (error) {
      toast.error(error.response.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased text-gray-900">
      <RegisterLoginHeader
        sloganText={"Create your account to start buying and saving"}
      />

      <div className="mt-8 sm:mx-auto w-full max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-gray-200 rounded-xl sm:px-10">
          <form className="space-y-4" onSubmit={handleRegisterSubmit}>
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

            {/* Legal Terms Checkbox */}
            <div className="flex items-start pt-1">
              <div className="flex h-5 items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-xs">
                <label
                  htmlFor="terms"
                  className="font-medium text-gray-600 select-none"
                >
                  I agree to the{" "}
                  <span className="text-blue-600 underline cursor-pointer hover:text-blue-700">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-blue-600 underline cursor-pointer hover:text-blue-700">
                    Privacy Policy
                  </span>
                  .
                </label>
              </div>
            </div>

            <div className="pt-2">
              <Button
                isLoading={isLoading}
                loadingText={"Create account.."}
                text={"Create Account"}
                type="submit"
              />
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center text-xs">
            <span className="text-gray-500">Already registered? </span>
            <span
              onClick={() => navigate(PATHS.LOGIN)}
              className="text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Sign in here
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
