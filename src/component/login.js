import React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Navbar from './Navbar.js';
import logo from './img/1.png';   
// Branding
const BRANDING = {
  logo: <img src={logo} alt="MUI logo" style={{ height: 54 }} />,
  title: "IDEAZ",
};
const darkTheme = createTheme({
    palette: {
      primary: {

        main: '#1A3F8C',
      },
    },
  });

// Sign-in function (Mock API Call)
const signIn = async (provider) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Sign in with ${provider}`);
      resolve();
    }, 500);
  });
};

const SignInSide = () => {
  return (
    <ThemeProvider theme={darkTheme} >
        <Navbar/>
            <Grid container component="main" maxWidth="xs" sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
      <CssBaseline />

      {/* Login Form - Centered */}
      <Grid item xs={6} sm={8} md={4} component={Paper} elevation={5} sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>

       <Typography>{BRANDING.logo}</Typography>
        <Typography component="h1" variant="h5" >
        Sign In {BRANDING.title} 
        </Typography>

        <Box component="form" noValidate sx={{ mt: 3, width: "100%" }}>
          <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus />
          <TextField variant="outlined" margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />

          {/* Sign In Button */}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => signIn("credentials")}>
            Sign In
          </Button>

          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
    </ThemeProvider>

  );
};

export default SignInSide;
