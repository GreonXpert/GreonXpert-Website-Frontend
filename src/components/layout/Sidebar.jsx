// src/components/layout/Sidebar.jsx
import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Collapse,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon,
  Description as PagesIcon,
  ViewQuilt as ComponentsIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  ChevronLeft as ChevronLeftIcon,
  Article as ArticleIcon,
  Edit as EditIcon,
  Home as HomeIcon,
  ShowChart as ShowChartIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import logo from '../../assests/images/logo.jpg'; // Adjust the path as necessary

// Define drawer sizes
const DRAWER_WIDTH = 280;
const DRAWER_COLLAPSED_WIDTH = 64;

const Sidebar = () => {
  const { sidebarOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openSubmenu, setOpenSubmenu] = useState({
    pages: false,
    components: false,
  });

  const handleSubmenuToggle = (key) => {
    setOpenSubmenu((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      dispatch(toggleSidebar());
    }
  };

  // Main menu items
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      text: 'Home',
      icon: <HomeIcon />,
      path: '/home',
    },
    
    {
      text: 'Pages',
      icon: <PagesIcon />,
      hasSubmenu: true,
      key: 'pages',
      submenu: [
        {
          text: 'All Pages',
          icon: <ArticleIcon />,
          path: '/pages',
        },
        {
          text: 'Add New',
          icon: <EditIcon />,
          path: '/pages/new',
        },
      ],
    },
    {
      text: 'Components',
      icon: <ComponentsIcon />,
      hasSubmenu: true,
      key: 'components',
      submenu: [
        
        {
          text: 'All Components',
          icon: <ArticleIcon />,
          path: '/components',
        },
        {
      text: 'Emissions',
      icon: <ShowChartIcon />,
      path: '/emissions',
    },
        
      ],
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
    },
  ];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Drawer Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'space-between' : 'center',
          padding: 2,
          minHeight: 64,
        }}
      >
        {sidebarOpen && (
          <Box component="img" src={logo} alt="Logo" sx={{ height: 32 }} />
        )}
        {!isMobile && (
          <IconButton onClick={() => dispatch(toggleSidebar())}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* Navigation Items */}
      <List sx={{ flexGrow: 1, overflow: 'auto' }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            {item.hasSubmenu ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleSubmenuToggle(item.key)}
                    sx={{
                      minHeight: 48,
                      justifyContent: sidebarOpen ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: sidebarOpen ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {sidebarOpen && (
                      <>
                        <ListItemText primary={item.text} />
                        {openSubmenu[item.key] ? <ExpandLess /> : <ExpandMore />}
                      </>
                    )}
                  </ListItemButton>
                </ListItem>
                {sidebarOpen && (
                  <Collapse in={openSubmenu[item.key]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.submenu.map((subItem) => (
                        <ListItemButton
                          key={subItem.text}
                          sx={{ pl: 4 }}
                          selected={isActiveRoute(subItem.path)}
                          onClick={() => handleNavigate(subItem.path)}
                        >
                          <ListItemIcon>{subItem.icon}</ListItemIcon>
                          <ListItemText primary={subItem.text} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </>
            ) : (
              <ListItem disablePadding>
                <ListItemButton
                  selected={isActiveRoute(item.path)}
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: sidebarOpen ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: sidebarOpen ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {sidebarOpen && <ListItemText primary={item.text} />}
                </ListItemButton>
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>

      <Divider />

      {/* Version Info (optional) */}
      {sidebarOpen && (
        <Box
          sx={{
            p: 2,
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: '0.75rem',
          }}
        >
          GreonXpert Admin v1.0
        </Box>
      )}
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: sidebarOpen ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH },
        flexShrink: { md: 0 },
      }}
    >
      {/* Mobile drawer (temporary variant) */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={() => dispatch(toggleSidebar())}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              zIndex: (theme) => theme.zIndex.drawer,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        // Desktop drawer (persistent variant)
        <Drawer
          variant="permanent"
          open={sidebarOpen}
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              position: 'fixed',
              boxSizing: 'border-box',
              width: sidebarOpen ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
              overflowX: 'hidden',
              borderRight: '1px solid',
              borderColor: 'divider',
              zIndex: (theme) => theme.zIndex.drawer,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;