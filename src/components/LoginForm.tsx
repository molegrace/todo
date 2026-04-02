import { Link } from "react-router-dom";
import Button from "./Button";
import Input from "./Input";


const LoginForm: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-main-50 shadow-lg rounded-2xl p-8 w-80 border border-main-200">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <div className="space-y-4">
          <Input placeholder="Username" className="w-full" ></Input>
          <Input placeholder="Password" type="password" className="w-full" />
        </div>

        <Button
          label="Login"
          className="bg-main-400 hover:bg-main-500 text-white w-full mt-6"
        ></Button>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-main-600 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
