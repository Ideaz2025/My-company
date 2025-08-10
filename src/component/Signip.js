import React from "react";
import { Button, Container, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import logo from './img/1.png';
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, setDoc, doc } from 'firebase/firestore';

const provider="Ideaz";


export default function SignUp() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const firstName = data.get("firstName");
    const lastName = data.get("lastName");
    const email = data.get("email");
    const password = data.get("password");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });
      // Save user details to Firestore
      const db = getFirestore();
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        createdAt: new Date().toISOString(),
      });
      // Optionally add email-to-userId mapping for streak sharing
      await setDoc(doc(db, 'emailToUserId', email), { userId: userCredential.user.uid });
      // Optionally redirect or show success
      alert("Registration successful!");
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <>  
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
        <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
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
      
    </Container>
    </>

  );
}
