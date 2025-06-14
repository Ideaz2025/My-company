import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const Cookies = () => {
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const cookiesConsent = getCookie('cookiesConsent');
    if (cookiesConsent === 'true') {
      setCookiesAccepted(true);
    } else {
      setOpen(true);
    }
  }, []);

  const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  };

  const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  const deleteCookie = (name) => {
    document.cookie = name + '=; Max-Age=-99999999;';
  };

  const handleAcceptCookies = () => {
    setCookie('cookiesConsent', 'true', 365);
    setCookiesAccepted(true);
    setOpen(false);
  };

  const handleDeclineCookies = () => {
    deleteCookie('cookiesConsent');
    setCookiesAccepted(false);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleDeclineCookies}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Cookies Consent"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          We use cookies to ensure you get the best experience on our website. By continuing to use our site, you accept our use of cookies.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeclineCookies} color="primary" sx={{ border:'1px solid #1A3F8C', marginRight: '10px' }}>
          Decline
        </Button>
        <Button onClick={handleAcceptCookies} color="primary"  sx={{ border:'1px solid #1A3F8C', marginRight: '10px' }}>
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Cookies;