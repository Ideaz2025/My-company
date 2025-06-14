import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import HomeIcon from '@mui/icons-material/Home';
import BuildIcon from '@mui/icons-material/Build';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { Link } from 'react-router-dom';
import { Button,  Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LoginIcon from "@mui/icons-material/Login";
import logo from './img/1.png';
import './style.css';

const BRANDING = {
  logo: <img src={logo} alt="Ideaz logo" className="spinning-logo" style={{ height: 54 }} />,
  title: "IDEAZ",
};

const pages = [
  { name: 'Home', icon: <HomeIcon /> },
  { name: 'Services', icon: <BuildIcon /> },
  { name: 'About us', icon: <InfoIcon /> },
  { name: 'Contact us', icon: <ContactMailIcon /> }
];

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '50px',
  marginTop: '10px',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.25),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.35),
  },
  display: 'flex',
  alignItems: 'flex-end',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#041f3a',
    },
  },
  typography: {
    fontSize: 16, // Change this value to adjust the default font size
    h5: {
      fontSize: '24px', // Custom size for h5, for example
    },
    body1: {
      fontSize: '14px', // Set font size for body text
    },
  },
});

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'white',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl1, setMobileMoreAnchorEl1] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isMobileMenuOpen1 = Boolean(mobileMoreAnchorEl1);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const handleMobileMenuClose1 = () => {
    setMobileMoreAnchorEl1(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <Link to="/dashboard"> Profile</Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenu = 'primary-search-account-menu-mobile';
  const renderMenu1 = (
    <Menu
      anchorEl={mobileMoreAnchorEl1}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenu}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen1}
      onClose={handleMobileMenuClose1}
    >
      <MenuItem>
        <Link to="/home">HOME</Link>
      </MenuItem>
      <MenuItem>
        <Link to="/services"><b>Services</b></Link>
      </MenuItem>
      <MenuItem>
        <Link to="/aboutus"><b>About us</b></Link>
      </MenuItem>
      <MenuItem>
        <Link to="/contactus"><b>Contact US</b></Link>
      </MenuItem>
    </Menu>
  );
  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const list = (
    <Box
      sx={{ width: 250, backgroundColor: 'white', height: '100%', color: 'black', borderRight: '3px solid #ccc' }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ padding: '16px', backgroundColor: '#1A3F8C', color: 'white' }}>
        <Typography variant="h6">{BRANDING.title}</Typography>
      </Box>
      <Divider />
      <List>
        {pages.map((page) => (
          <ListItem button key={page.name} component={Link} to={`/${page.name.toLowerCase().replace(/\s+/g, '')}`}>
            <ListItemIcon sx={{ color: '#1A3F8C' }}>{page.icon}</ListItemIcon>
            <ListItemText primary={page.name} sx={{ color: 'black', borderBottom: '1px solid #ccc', padding: '5px' }} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ padding: '16px',marginTop:'335px', backgroundColor: '#1A3F8C', color: 'white' ,fontSize:'12px'}}>
        <Typography variant="p"><span> &copy;Copyright </span>{BRANDING.title}<span>. All Rights Reserved</span></Typography>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenu}
                aria-haspopup="true"
                onClick={toggleDrawer(true)}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>
            {BRANDING.logo}
            <Typography
              variant="h5"
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'block', md: 'block' } }}
            >
              {BRANDING.title}
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  onClick={handleMenuClose}
                  sx={{ my: 2, color: 'white', display: 'block', marginLeft: '30px' }}
                  component={Link}
                  to={`/${page.name.toLowerCase().replace(/\s+/g, '')}`}
                >
                  {page.name}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'none' } }}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Search>
              <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={56} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={0} color="error">
                  <Link to='/login'> <LoginIcon /></Link>
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
            <Box sx={{ display: {xs:'none', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
            <Box sx={{display: {xs:'none', md: 'block' } }}>
             <Link to="/form" className="cta-btn" > JOIN A TEAM</Link>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
        {renderMenu1}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
        >
          {list}
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}