import { Link } from "react-router-dom";
import Button from "./Button";
import Input from "./Input";

const LoginForm: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-main-50 via-white to-primary-100">
      <div className="auth-card-border w-80">
        <div className="auth-card-surface bg-white p-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-main-700">
            Login
          </h2>

          <div className="space-y-4">
            <Input placeholder="Username" className="w-full" />
            <Input placeholder="Password" type="password" className="w-full" />
          </div>

          <Button
            label="Login"
            className="mt-6 w-full bg-main-400 text-white hover:bg-main-500"
          />

          <p className="mt-4 text-center text-sm text-main-600">
            <Link
              to="/dashboard"
              className="mr-3 font-medium text-main-600 hover:underline"
            >
              Home
            </Link>
            <span className="text-main-300">|</span>{" "}
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-main-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
