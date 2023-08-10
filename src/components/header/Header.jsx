import { Button, Container, Nav, Navbar } from "react-bootstrap";
import "./Header.css";
import { useContext } from "react";
import UserContext, { USER } from "../../context/UserContext";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const userContext = useContext(UserContext);
  const authContext = useContext(AuthContext);
  const user = userContext.user;
  const navigate = useNavigate();

  const logout = () => {
    userContext.setUser(USER);
    authContext.setToken(null);
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Navbar bg='mycolor' expand='lg' className='bg-body-tertiary'>
      <Container>
        <Navbar.Brand href='#home'>
          <i className='fa-solid fa-house'></i>
        </Navbar.Brand>
        <Navbar.Brand href='/'>Recipes & Foods</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto'>
            <Nav.Link href='/'>Home</Nav.Link>
            {!user._id && (
              <>
                <Nav.Link href='/signup'>sign up</Nav.Link>
                <Nav.Link href='/login'>log in</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className='justify-content-end'>
          {user._id && (
            <>
              <Navbar.Text>
                @<i>{user.username}</i>
              </Navbar.Text>
              <Button size='sm' onClick={logout} variant='danger'>
                Logout
              </Button>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
