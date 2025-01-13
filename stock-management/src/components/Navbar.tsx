import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Drawer,
  List,
  ListItemText,
  useMediaQuery,
  useTheme,
  ListItemButton,
  Button,
} from "@mui/material";
import { 
  Menu as MenuIcon, 
  Search as SearchIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Add as AddIcon
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setSearchTerm } from "../redux/productSlice";
import { useTheme as useCustomTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { toggleTheme, isDarkMode } = useCustomTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(event.target.value));
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setIsDrawerOpen(open);
    };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          sx={{ mr: 2 }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
        >
          Stok Yönetimi
        </Typography>
        <Button
          color="inherit"
          startIcon={<AddIcon />}
          onClick={() => navigate('/add-product')}
          sx={{ mr: 2 }}
        >
          Stok Ekle
        </Button>
        <Button
          color="inherit"
          onClick={() => navigate('/stock-logs')}
          sx={{ mr: 2 }}
        >
          Hareket Kayıtları
        </Button>
        <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Ara..."
            inputProps={{ "aria-label": "search" }}
            onChange={handleSearchChange}
          />
        </Search>
      </Toolbar>
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <List sx={{ width: 250 }} onClick={toggleDrawer(false)}>
          <ListItemButton onClick={() => navigate('/')}>
            <ListItemText primary="Ana Sayfa" />
          </ListItemButton>
          <ListItemButton onClick={() => navigate('/add-product')}>
            <ListItemText primary="Stok İşlemleri" />
          </ListItemButton>
          <ListItemButton onClick={() => navigate('/stock-logs')}>
            <ListItemText primary="Hareket Kayıtları" />
          </ListItemButton>
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;

