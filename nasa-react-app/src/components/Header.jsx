import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../auth/AuthProvide';
import { useNavigate, NavLink } from 'react-router-dom';
import logo from '../assets/cosmic.png';

export default function Header() {
  const { user, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const signIn = () => {
    navigate('/signin');
  };

  const signUp = () => {
    navigate('/signup');
  };

  const logOut = () => {
    logout();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: 'white', boxShadow: 'none' }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <NavLink to="/user">
              <img
                src={logo}
                alt="Logo"
                style={{ height: '60px', flexGrow: 1 }}
              />
            </NavLink>
          </Box>
          {user ? (
            <Button
              variant="contained"
              onClick={logOut}
              sx={{
                backgroundColor: '#102C57',
                borderRadius: 4,
                fontSize: 15,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#204C86',
                },
              }}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                sx={{
                  mr: 2,
                  backgroundColor: 'none',
                  color: '#102C57',
                  borderRadius: 4,
                  fontWeight: 'bold',
                  fontSize: 15,
                  textTransform: 'none',
                  '&:hover': {
                    color: '#204C86',
                  },
                }}
                onClick={signIn}
              >
                Login
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#102C57',
                  borderRadius: 4,
                  fontSize: 15,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#204C86',
                  },
                }}
                onClick={signUp}
              >
                Sign Up
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
