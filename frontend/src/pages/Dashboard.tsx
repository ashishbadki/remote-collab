import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();                 // token delete
    navigate("/login");       // login page
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome! You are logged in.</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
