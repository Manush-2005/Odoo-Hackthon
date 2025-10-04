import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Box,
  IconButton,
  Typography,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Dashboard,
  Receipt,
  People,
  Settings,
  Assignment,
  History,
  CheckCircle,
  AdminPanelSettings,
  Menu as MenuIcon,
  Close,
  AccountBalance,
  MoreVert,
  Person,
  Logout,
  ExitToApp,
  Brightness4,
  Brightness7,
  BusinessCenter,
} from "@mui/icons-material";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const ModernSidebar = ({ onClose, onSidebarToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [logoutDialog, setLogoutDialog] = useState(false);

  useEffect(() => {
    onSidebarToggle?.(isOpen);
  }, [isOpen, onSidebarToggle]);

  const menuItems = React.useMemo(() => {
    const items = [
      {
        title: "Employee Dashboard",
        icon: <Dashboard />,
        path: "/employee",
        roles: ["employee", "manager", "admin"],
      },
      {
        title: "Submit Expense",
        icon: <Receipt />,
        path: "/employee/submit",
        roles: ["employee", "manager", "admin"],
      },
      {
        title: "Expense History",
        icon: <History />,
        path: "/employee/history",
        roles: ["employee", "manager", "admin"],
      },
    ];

    if (user?.role === "manager" || user?.role === "admin") {
      items.push(
        { divider: true },
        {
          title: "Manager Dashboard",
          icon: <Assignment />,
          path: "/manager",
          roles: ["manager", "admin"],
        },
        {
          title: "Pending Approvals",
          icon: <CheckCircle />,
          path: "/manager/approvals",
          roles: ["manager", "admin"],
          badge: 3,
        }
      );
    }

    if (user?.role === "admin") {
      items.push(
        { divider: true },
        {
          title: "Admin Dashboard",
          icon: <AdminPanelSettings />,
          path: "/admin",
          roles: ["admin"],
        },
        {
          title: "User Management",
          icon: <People />,
          path: "/admin/users",
          roles: ["admin"],
        },
        {
          title: "Approval Rules",
          icon: <Settings />,
          path: "/admin/approval-rules",
          roles: ["admin"],
        }
      );
    }

    return items;
  }, [user?.role]);

  const handleUserMenuOpen = (event) => setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);
  const handleProfileClick = () => {
    handleUserMenuClose();
    navigate("/profile");
  };

  const handleLogoutClick = () => {
    handleUserMenuClose();
    setLogoutDialog(true);
  };
  const handleLogoutConfirm = () => {
    logout();
    setLogoutDialog(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onSidebarToggle?.(newState);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        zIndex: 1200,
        top: 20,
        left: 20,
        bottom: 26,
        borderRadius: "16px",
        border: `2px solid ${
          isDark
            ? "rgba(143, 107, 132, 0.2)"
            : "rgba(113, 75, 103, 0.15)"
        }`,
        width: isOpen ? "280px" : "78px",
        background: isDark
          ? "linear-gradient(145deg, rgba(31,41,55,0.95) 0%, rgba(17,24,39,0.95) 100%)"
          : "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(243,244,246,0.95) 100%)",
        backdropFilter: "blur(20px)",
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        boxShadow: isDark
          ? "0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(143,107,132,0.1)"
          : "0 20px 40px rgba(113,75,103,0.15), 0 0 0 1px rgba(113,75,103,0.05)",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isOpen ? "flex-start" : "center",
          height: "80px",
          padding: isOpen ? "0 16px" : "0",
          borderBottom: `1px solid ${
            isDark
              ? "rgba(143, 107, 132, 0.1)"
              : "rgba(113, 75, 103, 0.1)"
          }`,
        }}
      >
        <IconButton
          onClick={toggleSidebar}
          sx={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            color: "#714B67",
            backgroundColor: isDark
              ? "rgba(143,107,132,0.1)"
              : "rgba(113,75,103,0.08)",
            "&:hover": {
              backgroundColor: isDark
                ? "rgba(143,107,132,0.2)"
                : "rgba(113,75,103,0.15)",
              transform: "scale(1.05)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          {isOpen ? <Close fontSize="small" /> : <MenuIcon fontSize="small" />}
        </IconButton>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginLeft: "16px",
              }}
            >
              <Box
                component="img"
                src="/logo.png"
                alt="Odoo Logo"
                sx={{
                  width: "40px",
                  height: "40px",
                  filter: "drop-shadow(0 2px 4px rgba(113, 75, 103, 0.3))",
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  color: "#714B67",
                  fontFamily: "Caveat, cursive",
                  fontWeight: 700,
                  fontSize: "24px",
                }}
              >
                ExpenseHub
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* NAVIGATION */}
      <Box sx={{ display: "grid", p: "8px 6px", gap: "2px" }}>
        {menuItems.map((item, i) => {
          if (item.divider)
            return (
              <Divider
                key={`divider-${i}`}
                sx={{
                  my: 1.5,
                  borderColor: isDark
                    ? "rgba(143,107,132,0.2)"
                    : "rgba(113,75,103,0.15)",
                }}
              />
            );

          const active = isActive(item.path);

          return (
            <Tooltip
              key={item.path}
              title={!isOpen ? item.title : ""}
              placement="right"
              arrow
            >
              <Box
                onClick={() => navigate(item.path)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isOpen ? "flex-start" : "center",
                  gap: isOpen ? "16px" : 0,
                  height: "50px",
                  mx: 1.5,
                  borderRadius: "12px",
                  px: isOpen ? 2 : 0,
                  color: active
                    ? "#714B67"
                    : isDark
                    ? "#E5E7EB"
                    : "#374151",
                  background: active
                    ? isDark
                      ? "rgba(143,107,132,0.15)"
                      : "rgba(113,75,103,0.1)"
                    : "transparent",
                  fontWeight: active ? 700 : 600,
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    background: isDark
                      ? "rgba(143,107,132,0.1)"
                      : "rgba(113,75,103,0.08)",
                    transform: "translateY(-1px)",
                    boxShadow:
                      "0 4px 10px rgba(113,75,103,0.15)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "24px",
                    "& .MuiSvgIcon-root": {
                      fontSize: "22px",
                      color: active ? "#714B67" : "inherit",
                    },
                  }}
                >
                  {item.icon}
                </Box>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flex: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, whiteSpace: "nowrap" }}
                      >
                        {item.title}
                      </Typography>
                      {item.badge && (
                        <Chip
                          label={item.badge}
                          size="small"
                          sx={{
                            height: "20px",
                            fontSize: "11px",
                            backgroundColor: "#ef4444",
                            color: "white",
                          }}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </Tooltip>
          );
        })}
      </Box>

      {/* USER SECTION */}
      <Box
        sx={{
          position: "absolute",
          bottom: "20px",
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          onClick={handleUserMenuOpen}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: isOpen ? "space-between" : "center",
            gap: isOpen ? "16px" : 0,
            px: isOpen ? 2 : 0,
            py: 1.5,
            width: isOpen ? "85%" : "50px",
            borderRadius: "14px",
            cursor: "pointer",
            background: isDark
              ? "rgba(143,107,132,0.15)"
              : "rgba(113,75,103,0.08)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: isDark
                ? "rgba(143,107,132,0.25)"
                : "rgba(113,75,103,0.12)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(113,75,103,0.2)",
            },
          }}
        >
          <Box
            sx={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, #714B67 0%, #8F6B84 100%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
              boxShadow: "0 4px 12px rgba(113,75,103,0.3)",
            }}
          >
            {user?.name?.charAt(0) || "U"}
          </Box>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                style={{ flex: 1 }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#714B67",
                    fontWeight: 700,
                    fontSize: "16px",
                    lineHeight: 1.2,
                  }}
                >
                  {user?.name || "User"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: isDark ? "#D1D5DB" : "#6B7280",
                    fontSize: "13px",
                    textTransform: "capitalize",
                  }}
                >
                  {user?.role || "employee"}
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>

          {isOpen && (
            <IconButton size="small" sx={{ color: "#714B67" }}>
              <MoreVert fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* USER MENU */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: isDark ? "#1e293b" : "#fff",
            border: `1px solid ${
              isDark
                ? "rgba(148,163,184,0.1)"
                : "rgba(0,0,0,0.1)"
            }`,
            borderRadius: 2,
          },
        }}
      >
        <MenuItem onClick={handleProfileClick}>
          <Person sx={{ mr: 2 }} /> Profile
        </MenuItem>
        <MenuItem onClick={toggleTheme}>
          {isDark ? <Brightness7 sx={{ mr: 2 }} /> : <Brightness4 sx={{ mr: 2 }} />}
          {isDark ? "Light Mode" : "Dark Mode"}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogoutClick}>
          <ExitToApp sx={{ mr: 2, color: "#ef4444" }} /> Logout
        </MenuItem>
      </Menu>

      {/* LOGOUT DIALOG */}
      <Dialog open={logoutDialog} onClose={() => setLogoutDialog(false)}>
        <DialogTitle>
          <Logout sx={{ mr: 1, color: "#ef4444" }} /> Confirm Logout
        </DialogTitle>
        <DialogContent>
          Are you sure you want to logout?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialog(false)}>Cancel</Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            sx={{ backgroundColor: "#ef4444", "&:hover": { backgroundColor: "#dc2626" } }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ModernSidebar;
