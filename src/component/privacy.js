import React from 'react';
import { Box, Typography } from '@mui/material';


const PrivacyPolicy = () => {
  return (
    <>
    <Box sx={{ padding: '20px', display: { xs: 'block', md: 'none' } }}>
      <Typography variant="h4" gutterBottom>
        Privacy Policy
      </Typography>
      <Typography variant="body1" paragraph>
        Your privacy is important to us. It is Ideaz's policy to respect your privacy regarding any information we may collect from you across our website,<span>www.ideaz.org.in</span>, and other sites we own and operate.
      </Typography>
      <Typography variant="h5" gutterBottom>
        Information We Collect
      </Typography>
      <Typography variant="body1" paragraph>
        We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
      </Typography>
      <Typography variant="h5" gutterBottom>
        How We Use Information
      </Typography>
      <Typography variant="body1" paragraph>
        We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use, or modification.
      </Typography>
      <Typography variant="h5" gutterBottom>
        Your Rights
      </Typography>
      <Typography variant="body1" paragraph>
        You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.
      </Typography>
      <Typography variant="h5" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="body1" paragraph>
        If you have any questions about how we handle user data and personal information, feel free to contact us.
      </Typography>
      <Typography variant="body1" paragraph>
        This policy is effective as of [date].
      </Typography>
    </Box>
    <Box sx={{ padding: '20px', display: { xs: 'none', md: 'block' },width: '50%',marginLeft:'400px' }}>
      <Typography variant="h4" gutterBottom>
        Privacy Policy
      </Typography>
      <Typography variant="body1" paragraph>
        Your privacy is important to us. It is Ideaz's policy to respect your privacy regarding any information we may collect from you across our website, <span > <a href="/home">www.ideaz.org.in</a></span>, and other sites we own and operate.
      </Typography>
      <Typography variant="h5" gutterBottom>
        Information We Collect
      </Typography>
      <Typography variant="body1" paragraph>
        We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
      </Typography>
      <Typography variant="h5" gutterBottom>
        How We Use Information
      </Typography>
      <Typography variant="body1" paragraph>
        We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use, or modification.
      </Typography>
      <Typography variant="h5" gutterBottom>
        Your Rights
      </Typography>
      <Typography variant="body1" paragraph>
        You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.
      </Typography>
      <Typography variant="h5" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="body1" paragraph>
        If you have any questions about how we handle user data and personal information, feel free to contact us.
      </Typography>
      <Typography variant="body1" paragraph>
        This policy is effective as of 2025.
      </Typography>
    </Box>
    </>
  );
};

export default PrivacyPolicy;