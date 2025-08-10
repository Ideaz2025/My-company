import React, { useState } from "react";
import {
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Login as LoginIcon,
} from "@mui/icons-material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import logo from './img/1.png';   
import { auth } from "../firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// Branding
const BRANDING = {
  logo: <img src={logo} alt="IDEAZEDGE logo" style={{ height: 54 }} />,
  title: "IDEAZEDGE",
};

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#ec4899',
      light: '#f472b6',
      dark: '#db2777',
    },
    background: {
      default: '#0f0f23',
      paper: '#1a1a2e',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
    divider: '#334155',
    success: {
      main: '#10b981',
    },
    error: {
      main: '#ef4444',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
          border: '1px solid #334155',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(26, 26, 46, 0.6)',
            borderRadius: '8px',
            '& fieldset': {
              borderColor: '#475569',
            },
            '&:hover fieldset': {
              borderColor: '#6366f1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366f1',
              boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.2)',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#cbd5e1',
          },
          '& .MuiOutlinedInput-input': {
            color: '#f8fafc',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          padding: '12px 24px',
        },
        contained: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            boxShadow: '0 8px 30px rgba(99, 102, 241, 0.6)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: '#6366f1',
          color: '#6366f1',
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderColor: '#8b5cf6',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#6366f1',
          '&.Mui-checked': {
            color: '#6366f1',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#6366f1',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
            color: '#8b5cf6',
          },
        },
      },
    },
  },
});

const SignInSide = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailPasswordSignIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <CssBaseline />
        
        <Paper
          elevation={24}
          sx={{
            maxWidth: 440,
            width: '100%',
            p: 4,
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
            }
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
           <Box sx={{ mb: 2}}>
  {BRANDING.logo}
</Box>
            <Typography 
              variant="h4" 
              fontWeight={700}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ color: '#cbd5e1' }}>
              Sign in to {BRANDING.title}
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              {error}
            </Alert>
          )}

          {/* Sign In Form */}
          <Box component="form" onSubmit={handleEmailPasswordSignIn} sx={{ width: "100%" }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              sx={{ mb: 2 }}
            />
            
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      sx={{ color: '#cbd5e1' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            
            <FormControlLabel
              control={<Checkbox value="remember" />}
              label={
                <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                  Remember me
                </Typography>
              }
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
              sx={{ mb: 2, py: 1.5 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Divider sx={{ my: 3, '&::before, &::after': { borderColor: '#334155' } }}>
              <Typography variant="body2" sx={{ color: '#94a3b8', px: 2 }}>
                OR
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              startIcon={googleLoading ? <CircularProgress size={20} /> : <GoogleIcon />}
              sx={{ mb: 3, py: 1.5 }}
            >
              {googleLoading ? 'Signing In...' : 'Continue with Google'}
            </Button>

            {/* Links */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Link href="#" variant="body2" sx={{ display: 'block', textAlign: 'center' }}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Link href="/signup" variant="body2" sx={{ display: 'block', textAlign: 'center' }}>
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>

          {/* Demo Access */}
          <Box sx={{ mt: 4, p: 3, backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <Typography variant="body2" sx={{ color: '#cbd5e1', textAlign: 'center', mb: 2 }}>
              Demo Access
            </Typography>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate("/")}
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                },
              }}
            >
              Continue to Dashboard
            </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default SignInSide;
