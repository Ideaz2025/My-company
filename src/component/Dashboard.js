import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { createTheme } from '@mui/material/styles';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import { AppProvider } from '@toolpad/core/AppProvider';
import { Account, AccountPreview, AccountPopoverFooter } from '@toolpad/core/Account';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WhatshotRoundedIcon from '@mui/icons-material/WhatshotRounded';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from './img/1.png';

// Import your page components
import Learning from './Learning';
import Profile from './Profile';
import DayStreak from './daystreak';
import CourseDetail from './course';

const NAVIGATION = [
  { kind: 'header', title: 'Main items' },
  { segment: 'learning', title: 'Learning', icon: <SchoolIcon /> },
  { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
  { segment: 'daystreak', title: 'Day Streak', icon: <WhatshotRoundedIcon /> },
  { segment: 'course', title: 'Course Detail', icon: <SchoolIcon /> },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: true,
    dark: {
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
        surface: {
          main: '#16213e',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#cbd5e1',
        },
        divider: '#334155',
        action: {
          hover: 'rgba(99, 102, 241, 0.08)',
          selected: 'rgba(99, 102, 241, 0.16)',
        },
        success: {
          main: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        warning: {
          main: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
        },
        error: {
          main: '#ef4444',
          light: '#f87171',
          dark: '#dc2626',
        },
        info: {
          main: '#3b82f6',
          light: '#60a5fa',
          dark: '#2563eb',
        },
      },
      components: {
        MuiAppBar: {
          styleOverrides: {
            root: {
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderBottom: '1px solid #334155',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
              borderRight: '1px solid #334155',
              backdropFilter: 'blur(10px)',
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
              border: '1px solid #334155',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(99, 102, 241, 0.2)',
                borderColor: '#6366f1',
              },
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(26, 26, 46, 0.6)',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)',
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
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: '8px',
              fontWeight: 600,
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
        MuiListItemButton: {
          styleOverrides: {
            root: {
              borderRadius: '8px',
              margin: '2px 8px',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                transform: 'translateX(4px)',
              },
              '&.Mui-selected': {
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                borderLeft: '3px solid #6366f1',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
                },
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              backgroundColor: 'rgba(26, 26, 46, 0.8)',
              backdropFilter: 'blur(10px)',
            },
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                transform: 'scale(1.1)',
              },
            },
          },
        },
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          color: '#f8fafc',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
        h2: {
          color: '#f8fafc',
          fontWeight: 600,
        },
        h3: {
          color: '#f8fafc',
          fontWeight: 600,
        },
        h4: {
          color: '#f8fafc',
          fontWeight: 500,
        },
        h5: {
          color: '#f8fafc',
          fontWeight: 500,
        },
        h6: {
          color: '#f8fafc',
          fontWeight: 500,
        },
        body1: {
          color: '#e2e8f0',
          lineHeight: 1.6,
        },
        body2: {
          color: '#cbd5e1',
          lineHeight: 1.5,
        },
        caption: {
          color: '#94a3b8',
        },
      },
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

// DemoPageContent switches page content based on internal pathname
function DemoPageContent({ pathname, router }) {
  let content = null;

  if (pathname === '/dashboard') {
    content = <Profile />;
  } else if (pathname === '/learning') {
    // pass router so Learning can navigate internally
    content = <Learning router={router} />;
  } else if (pathname === '/daystreak') {
    content = <DayStreak />;
  } else if (pathname.startsWith('/course')) {
    // pass courseId extracted from pathname
    const courseId = pathname.split('/')[2] || null; // e.g. "/course/abc123"
    content = <CourseDetail courseId={courseId} />;
  } else {
    content = <Typography variant="h6">Page not found</Typography>;
  }

  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        height: '100vh',
      }}
    >
      {content}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
  router: PropTypes.object.isRequired,
};

function ToolbarActionsSearch() {
  const [searchValue, setSearchValue] = React.useState("");
  const handleSearch = () => {
    if (searchValue.trim()) {
      alert(`Searching for: ${searchValue}`);
      
    }
  };

  return (
    <Stack direction="row">
      <Tooltip title="Search" enterDelay={1000}>
        <div>
          <IconButton
            type="button"
            aria-label="search"
            sx={{ display: { xs: 'inline', md: 'none' } }}
            onClick={handleSearch}
          >
            <SearchIcon />
          </IconButton>
        </div>
      </Tooltip>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        slotProps={{
          input: {
            endAdornment: (
              <IconButton type="button" aria-label="search" size="small" onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            ),
            sx: { pr: 0.5 },
          },
        }}
        sx={{ display: { xs: 'none', md: 'inline-block' }, mr: 1 }}
      />
      <ThemeSwitcher />
    </Stack>
  );
}

function CustomAppTitle() {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <img src={logo} width="50px" alt="logo" />
      <Typography variant="h6">IDEAZEDGE</Typography>
    </Stack>
  );
}

function SidebarFooterAccountPopover() {
  const { user, logout } = useAuth();

  return (
    <Stack direction="column">
      <Typography variant="body2" mx={2} mt={1}>
        Accounts
      </Typography>
      {/* You can render accounts here */}
      <Divider />
      <AccountPopoverFooter>
        {user ? (
          <Button onClick={logout} variant="outlined" size="small">
            Sign Out
          </Button>
        ) : (
          <Button variant="contained" size="small" color="primary" href="/login">
            Sign In
          </Button>
        )}
      </AccountPopoverFooter>
    </Stack>
  );
}

function SidebarFooterAccount({ mini }) {
  const PreviewComponent = React.useMemo(() => (props) => <AccountPreview {...props} variant={mini ? 'condensed' : 'expanded'} />, [mini]);

  return (
    <Account
      slots={{
        preview: PreviewComponent,
        popoverContent: SidebarFooterAccountPopover,
      }}
      slotProps={{
        popover: {
          transformOrigin: { horizontal: 'left', vertical: 'bottom' },
          anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
          disableAutoFocus: true,
          slotProps: {
            paper: {
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: (theme) =>
                  `drop-shadow(0px 2px 8px ${
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.32)'
                  })`,
                mt: 1,
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  bottom: 10,
                  left: 0,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translate(-50%, -50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            },
          },
        },
      }}
    />
  );
}

SidebarFooterAccount.propTypes = {
  mini: PropTypes.bool.isRequired,
};

function DashboardLayoutAccountSidebar({ window }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Internal pathname state controls dashboard page content
  const [pathname, setPathname] = React.useState(location.pathname === '/' ? '/dashboard' : location.pathname);

  // Sync internal pathname with browser location
  React.useEffect(() => {
    if (location.pathname === '/') {
      setPathname('/dashboard');
    } else {
      setPathname(location.pathname);
    }
  }, [location.pathname]);

  // Router object for SPA navigation
  const navigateRouter = useNavigate();
  const router = React.useMemo(
    () => ({
      pathname,
      searchParams: new URLSearchParams(location.search),
      navigate: (path) => {
        setPathname(String(path));
        navigateRouter(path);
      },
    }),
    [pathname, location.search, navigateRouter],
  );

  const session = user
    ? {
        user: {
          name: user.displayName || user.email,
          email: user.email,
          image: user.photoURL,
        },
      }
    : null;

  const authentication = {
    signIn: () => navigate('/login'),
    signOut: logout,
  };

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      authentication={authentication}
      session={session}
    >
      <DashboardLayout
        slots={{
          toolbarAccount: () => null,
          sidebarFooter: SidebarFooterAccount,
          appTitle: CustomAppTitle,
          toolbarActions: ToolbarActionsSearch,
        }}
      >
        <DemoPageContent pathname={pathname} router={router} />
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardLayoutAccountSidebar.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutAccountSidebar;
