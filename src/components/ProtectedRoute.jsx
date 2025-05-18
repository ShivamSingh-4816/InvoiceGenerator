import { Navigate } from 'react-router-dom';
import { useGlobalContext } from "@/context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { userInitState } = useGlobalContext();
  
  if (!userInitState.currentUser) {
    return <Navigate to="/signin" />;
  }
  
  return children;
};

export default ProtectedRoute;