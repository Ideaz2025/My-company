import React from "react";
import { Button, Container, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Navbar from './Navbar';
import logo from './img/1.png';

const provider="Ideaz";
function MadeWithLove() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Built with love by the "}
      <Link color="inherit" href="https://mui.com/">
        Material-UI
      </Link>
      {" team."}
    </Typography>
  );
}

export default function SignUp() {
  return (
    <>    <Navbar/>
    <Container component="main" maxWidth="xs">
     
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
          <img src={logo} width='50px'alt="logo"/>
        <Typography component="h1" variant="h5">
          Sign up with {provider}
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField autoComplete="fname" name="firstName" required fullWidth id="firstName" label="First Name" autoFocus />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth id="lastName" label="Last Name" name="lastName" autoComplete="lname" />
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth id="email" label="Email Address" name="email" autoComplete="email" />
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel control={<Checkbox value="allowExtraEmails" color="primary" />} label="I want to receive marketing promotions via email." />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box mt={5}>
        <MadeWithLove />
      </Box>
    </Container>
    </>

  );
}
