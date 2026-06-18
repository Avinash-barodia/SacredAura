import React, { useState } from "react";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";

import {
  Dashboard,
  Category,
  Inventory2,
  ReceiptLong,
  Logout,
  Menu as MenuIcon,
  Home as HomeIcon,
  ViewCarousel as ViewCarouselIcon,
} from "@mui/icons-material";

import { useTheme } from "@mui/material/styles";

import AdminCategory from "../Admin/AdminCategory";
import AdminProduct from "../Admin/AdminProduct";
import AdminOrders from "./AdminOrders";
import AdminHomeProducts from "./AdminHomeProducts";
import AdminLiveHomePage from "./AdminLiveHomePage";

const drawerWidth = 220;

export default function AdminDashboard() {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard /> },
    { text: "Live Editor", icon: <ViewCarouselIcon /> },
    { text: "Category", icon: <Category /> },
    { text: "Products", icon: <Inventory2 /> },
    { text: "AllOrders", icon: <ReceiptLong /> },
  ];

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "linear-gradient(180deg,#0f172a,#1e293b)",
        color: "#fff",
      }}
    >
      <Toolbar sx={{ justifyContent: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Admin Panel
        </Typography>
      </Toolbar>

      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => {
              setSelectedMenu(item.text);
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 2,
              background:
                selectedMenu === item.text
                  ? "#2563EB"
                  : "transparent",
              "&:hover": {
                background: "rgba(255,255,255,0.08)",
                cursor: "pointer",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: "#fff",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2, mt: "auto" }}>
        <Button
          variant="contained"
          startIcon={<Logout />}
          fullWidth
          sx={{
            bgcolor: "#ef4444",
            borderRadius: "12px",
            py: 1.3,
            "&:hover": { bgcolor: "#dc2626" },
          }}
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", overflow: "hidden", }}>
      
      {/* SIDEBAR */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              border: "none",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              border: "none",
              overflow: "hidden",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* MAIN */}
      <Box sx={{ flexGrow: 1, bgcolor: "#f1f5f9" }}>
        
        {/* TOPBAR */}
        <AppBar
          position="static"
          sx={{
            bgcolor: "#ffffff",
            color: "#0f172a",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {isMobile && (
                <IconButton onClick={() => setMobileOpen(true)}>
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {selectedMenu}
              </Typography>
            </Box>

            <Avatar
              sx={{
                bgcolor: "#2563EB",
                cursor: "pointer",
              }}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            />

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => setAnchorEl(null)}>
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* BODY */}
        <Box sx={{ p: 4 }}>
          {selectedMenu === "Dashboard" && (
            <Typography variant="h5">
              Welcome to Admin Dashboard
            </Typography>
          )}

          {selectedMenu === "Category" && <AdminCategory />}
          {selectedMenu === "Products" && <AdminProduct />}
          {selectedMenu === "AllOrders" && <AdminOrders />}
          {selectedMenu === "Category Prod" && <AdminHomeProducts />}
          {selectedMenu === "Live Editor" && <AdminLiveHomePage />}
        </Box>
      </Box>
    </Box>
  );
}