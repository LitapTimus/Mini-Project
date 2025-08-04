import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/auth/user", {
          credentials: "include", // Important for cookies
        });
        if (!res.ok) throw new Error("Not logged in");
        const data = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (err) {
        console.error(err);
        navigate("/"); // redirect to home if not authenticated
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <>
          <p>Welcome, {user.displayName}</p>
          <p>Email: {user.emails[0].value}</p>
          <img src={user.photos[0].value} alt="Profile" width="100" />
        </>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
}
