import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, needAuth = true }) => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (needAuth && !user) {
        toast.error("Please sign in to access this page");
        navigate("/signin");
      } else if (!needAuth && user) {
        navigate("/");
      }
    }
  }, [user, loading, needAuth, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (needAuth && !user) {
    return null;
  }

  if (!needAuth && user) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
