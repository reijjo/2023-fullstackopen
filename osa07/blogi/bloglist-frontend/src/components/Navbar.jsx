import { Link } from "react-router-dom";

import { Button, AppBar, Toolbar } from "@mui/material";

const Navbar = ({ user }) => {
  if (!user) {
    return null;
  }

  return (
    // <nav
    //   style={{
    //     display: "flex",
    //     flexDirection: "row",
    //     backgroundColor: "lightgray",
    //     padding: "8px 16px",
    //   }}
    // >
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          blogs
        </Button>

        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        {/* <Link style={{ marginRight: "8px" }} to="/">
          blogs
        </Link>
        <Link style={{ marginRight: "8px" }} to="/users">
          users
        </Link> */}
        <div>{user.name} logged in</div>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            window.localStorage.removeItem("blogUser");
            window.location.replace("/");
          }}
        >
          logout
        </Button>
      </Toolbar>
    </AppBar>
    // </nav>
  );
};

export default Navbar;
