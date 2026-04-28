import { useEffect, useState, type FormEvent } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import FloatingLabelInput from "../../components/Input/FloatingLabelInput";
import SubmitButton from "../../components/Button/SubmitButton";
import AuthService from "../../services/AuthService";

interface FieldErrors {
  username?: string[];
  password?: string[];
}

interface ValidationErrorResponse {
  message?: string;
  errors?: FieldErrors;
}

const LoginPage = () => {
  const uploadedLoginImage =
    "/@fs/C:/Users/PC/.cursor/projects/c-xampp-htdocs-RNLDemo/assets/c__Users_PC_AppData_Roaming_Cursor_User_workspaceStorage_f5efa903bf5f44ac1c768120f26c0f39_images_image-c8380dcc-3b9e-4264-bd95-1720c3f722cb.png";
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Login";
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    try {
      setLoading(true);
      const res = await AuthService.login({ username, password });
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/gender", { replace: true });
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ValidationErrorResponse>;
      if (axiosError.response?.status === 422 && axiosError.response.data?.errors) {
        setErrors(axiosError.response.data.errors);
      } else if (axiosError.response?.status === 401) {
        setMessage(axiosError.response.data?.message ?? "The provided credentials are incorrect.");
      } else {
        setMessage("Unable to login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      {message && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-md">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs">
            x
          </span>
          <span>{message}</span>
        </div>
      )}

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md mx-auto w-full">
          <div className="text-center mb-6">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              alt="Company Logo"
              className="w-10 h-10 mx-auto mb-2"
            />
            <h1 className="text-3xl font-semibold text-gray-900">Sign in to your account</h1>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <FloatingLabelInput
                label="Username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                errors={errors.username}
                required
                autoFocus
              />
            </div>

            <div className="mb-5">
              <FloatingLabelInput
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                errors={errors.password}
                required
              />
            </div>

            <SubmitButton
              label="Sign In"
              loading={loading}
              loadinglabel="Signing In..."
              newClassName="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow-sm"
            />
          </form>
        </div>

        <div className="hidden md:flex justify-center">
          <img
            src={uploadedLoginImage}
            alt="Company Brand"
            className="max-w-lg w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
