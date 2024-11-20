import { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import { Loader2 } from "lucide-react";

export default function RegisterAndLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("login");
  const [error, setError] = useState("");
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  async function handleSubmit(e) {
    e.preventDefault();

    if (username.length < 4) {
      setError("Username must be at least 4 characters long.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    const url = isLoginOrRegister === "register" ? "register" : "login";
    try {
      setIsLoading(true);
      setError(""); 
      const { data } = await axios.post(url, { username, password });
      setLoggedInUsername(username);
      setId(data.id);
    } catch (error) {
     
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError("Invalid username or password");
            break;
          case 404:
            setError("User not found");
            break;
          case 409:
            setError("Username already exists");
            break;
          default:
            setError("An error occurred. Please try again later.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-gray-50 h-screen flex items-center justify-center">
      <form
        className="w-full max-w-md mx-auto mb-12 bg-white shadow-lg rounded-lg p-8"
        onSubmit={handleSubmit}
      >
        <div className="mb-6">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Learniee
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please {isLoginOrRegister === "register" ? "create an account" : "sign in to your account"}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <span className="flex-1">{error}</span>
          </div>
        )}
        
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          disabled={isLoading}
          className="block w-full rounded-md p-3 mb-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          disabled={isLoading}
          className="block w-full rounded-md p-3 mb-6 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button 
          disabled={isLoading}
          className="bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-bold py-3 px-4 rounded-full w-full transition duration-150 ease-in-out shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              {isLoginOrRegister === "register" ? "Registering..." : "Logging in..."}
            </>
          ) : (
            isLoginOrRegister === "register" ? "Register" : "Login"
          )}
        </button>
        
        <div className="text-center mt-4">
          {isLoginOrRegister === "register" ? (
            <div className="text-sm text-gray-600">
              Already a member?{" "}
              <button
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLoginOrRegister("login");
                  setError("");
                }}
              >
                Login here
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLoginOrRegister("register");
                  setError("");
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}