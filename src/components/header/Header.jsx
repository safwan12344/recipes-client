import { Button, Container, Nav, Navbar } from "react-bootstrap";
import "./Header.css";
import { useSnapshot } from "valtio";
import userState from "../../states/user";
import authState from "../../states/auth";
import Search from "../search/Search";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const userSnap = useSnapshot(userState);
  const authSnap = useSnapshot(authState);
  const user = userSnap.user;
  const location = useLocation();

  const hideSearch =
    /(\/login|\/signup|\/recipes\/new|\/edit-recipe|\/recipe-details|\/category|\/my-books|\/books)/g.test(
      location.pathname,
    );

  const logout = () => {
    userSnap.setUser(null);
    authSnap.setToken(null);
    localStorage.clear();
    // TODO: fix navidation to login
    // navigate("/login");
  };

  return (
    <>
      <Navbar bg='mycolor' expand='lg' className='bg-body-tertiary'>
        <Container>
          <Navbar.Brand href='/'>
            <i className='fa-solid fa-house'></i>
          </Navbar.Brand>
          <Navbar.Brand as={Link} to='/'>
            Recipes & Foods
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto'>
              <Nav.Link as={Link} to='/'>
                {" "}
                Home
              </Nav.Link>

              {user?.role === "business" && (
                <>
                  <Nav.Link as={Link} to='/my-recipes'>
                    My Recipes
                  </Nav.Link>

                  <Nav.Link as={Link} to='/my-books'>
                    My Books
                  </Nav.Link>

                  <Nav.Link as={Link} to='/my-activities'>
                    My Activities
                  </Nav.Link>
                </>
              )}

              {!user?._id && (
                <>
                  <Nav.Link as={Link} to='/signup'>
                    sign up
                  </Nav.Link>
                  <Nav.Link as={Link} to='/login'>
                    log in
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
          {!hideSearch && <Search />}
          <Navbar.Collapse className='justify-content-end'>
            {user?._id && (
              <>
                <Navbar.Text>
                  <i style={{ marginRight: 10 }}>@{user.username}</i>
                </Navbar.Text>
                <Button size='sm' onClick={logout} variant='danger'>
                  Logout
                </Button>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
