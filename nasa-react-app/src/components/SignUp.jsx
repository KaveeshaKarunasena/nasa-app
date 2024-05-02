import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import backgroundImage from '../assets/spaceImage5.jpg';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const defaultTheme = createTheme();

export default function SignUp() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [showOtpForm, setShowOtpForm] = React.useState(false);
  const [otp, setOtp] = React.useState('');
  const [userData, setUserData] = React.useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
  });

  const handleSubmit = async event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (
      !data.get('fname') ||
      !data.get('lname') ||
      !data.get('email') ||
      !data.get('password')
    ) {
      enqueueSnackbar('All fields are required', { variant: 'error' });
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@my.sliit.lk$/;
    if (!emailPattern.test(data.get('email'))) {
      enqueueSnackbar('Invalid email format. Please use a Gmail address', {
        variant: 'error',
      });
      return;
    }

    if (data.get('password').length < 8) {
      enqueueSnackbar('Password must be at least 8 characters long', {
        variant: 'error',
      });
      return;
    }

    setUserData({
      fname: data.get('fname'),
      lname: data.get('lname'),
      email: data.get('email'),
      password: data.get('password'),
    });

    try {
      await axios.post('https://cosmiclens.onrender.com/api/v1/users/sendOtp', {
        email: data.get('email'),
      });
      setShowOtpForm(true);
    } catch (err) {
      enqueueSnackbar(err.response.data.err, { variant: 'error' });
    }
  };

  const handleOtpSubmit = async event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (!otp) {
      enqueueSnackbar('OTP is required', { variant: 'error' });
      return;
    }

    try {
      await axios
        .post('https://cosmiclens.onrender.com/api/v1/users/verifyOTP', {
          email: userData.email,
          code: otp,
        })
        .then(async (res) => {
          enqueueSnackbar('Otp verified', { variant: 'success' });
          await axios
            .post('https://cosmiclens.onrender.com/api/v1/users/createAccount', {
              fname: userData.fname,
              lname: userData.lname,
              email: userData.email,
              password: userData.password,
              email_token: res.data,
            })
            .then(navigate('/signin'))
            .catch(err =>
              enqueueSnackbar(err.response.data.err, { variant: 'error' }),
            );
        })
        .catch(err =>
          enqueueSnackbar(err.response.data.err, { variant: 'error' }),
        );
    } catch (err) {
      console.log(err)
      enqueueSnackbar(err.response.data.err, { variant: 'error' });
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: t =>
              t.palette.mode === 'light'
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              p: 3,
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            {!showOtpForm ? (
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1, width: '100%', maxWidth: 350 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="fname"
                  label="First Name"
                  name="fname"
                  autoFocus
                  InputProps={{ sx: { borderRadius: 4 } }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="lname"
                  label="Last Name"
                  name="lname"
                  autoFocus
                  InputProps={{ sx: { borderRadius: 4 } }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  InputProps={{ sx: { borderRadius: 4 } }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  InputProps={{ sx: { borderRadius: 4 } }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    borderRadius: 4,
                    fontSize: 'bold',
                    height: 35,
                  }}
                >
                  Sign Up
                </Button>
                <Grid container>
                  <Grid item>
                    <NavLink to="/signin" variant="body2">
                      Already have an account? Sign In
                    </NavLink>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box
                component="form"
                noValidate
                onSubmit={handleOtpSubmit}
                sx={{ mt: 1, width: '100%', maxWidth: 400 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="otp"
                  label="OTP"
                  name="otp"
                  autoFocus
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  InputProps={{ sx: { borderRadius: 4 } }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    borderRadius: 4,
                    fontSize: 'bold',
                    height: 35,
                  }}
                >
                  Verify OTP
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
