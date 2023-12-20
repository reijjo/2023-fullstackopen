import { Link } from "react-router-dom";

const Navbar = ({ user }) => {
  if (!user) {
    return null;
  }

  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "lightgray",
        padding: "8px 16px",
      }}
    >
      <Link style={{ marginRight: "8px" }} to="/">
        blogs
      </Link>
      <Link style={{ marginRight: "8px" }} to="/users">
        users
      </Link>
      <div>{user.name} logged in</div>
      <button
        onClick={() => {
          window.localStorage.removeItem("blogUser");
          window.location.replace("/");
        }}
      >
        logout
      </button>
    </nav>
  );
};

export default Navbar;
