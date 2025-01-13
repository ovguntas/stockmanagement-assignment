import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Modal,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  ButtonGroup,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme as useAppTheme } from '../context/ThemeContext';


interface CartItem {
  _id: string;
  name: string;
  price: number;
  cartQuantity: number;
  unit: string;
}

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { mode, toggleTheme } = useAppTheme();
  const isDarkMode = mode === 'dark';
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const isMarketPage = location.pathname === '/market';

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    const handleCartUpdate = () => {
      const updatedCart = localStorage.getItem('cart');
      if (updatedCart) {
        setCartItems(JSON.parse(updatedCart));
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const handleCartOpen = () => setCartOpen(true);
  const handleCartClose = () => setCartOpen(false);

  const totalItems = cartItems.reduce((sum, item) => sum + item.cartQuantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);

  const handleUpdateQuantity = (itemId: string, change: number) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item._id === itemId) {
          const newQuantity = item.cartQuantity + change;
          return newQuantity > 0 ? { ...item, cartQuantity: newQuantity } : null;
        }
        return item;
      }).filter((item): item is CartItem => item !== null);

      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item._id !== itemId);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        {isMobile && !isMarketPage && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          Stok Yönetimi
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <IconButton color="inherit" onClick={() => navigate('/market')}>
            <Typography variant="button" sx={{ mr: 1 }}>
              Market
            </Typography>
          </IconButton>
          {isMarketPage && (
            <IconButton color="inherit" onClick={handleCartOpen}>
              <Badge badgeContent={totalItems} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          )}
          <IconButton color="inherit" onClick={toggleTheme}>
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>

      <Modal
        open={cartOpen}
        onClose={handleCartClose}
        aria-labelledby="cart-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: '80vh',
          overflow: 'auto'
        }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Sepetim
          </Typography>
          {cartItems.length === 0 ? (
            <Typography color="text.secondary">
              Sepetiniz boş
            </Typography>
          ) : (
            <>
              <List>
                {cartItems.map((item) => (
                  <React.Fragment key={item._id}>
                    <ListItem>
                      <ListItemText
                        primary={item.name}
                        secondary={`Birim Fiyat: $${item.price}`}
                      />
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ButtonGroup size="small">
                            <IconButton
                              size="small"
                              onClick={() => handleUpdateQuantity(item._id, -1)}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <Typography sx={{ mx: 1 }}>
                              {item.cartQuantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleUpdateQuantity(item._id, 1)}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </ButtonGroup>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleRemoveItem(item._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                      Toplam: ${(item.price * item.cartQuantity).toFixed(2)}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                  </React.Fragment>
                ))}
              </List>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Toplam: ${totalPrice.toFixed(2)}
                </Typography>
                <Button variant="contained" color="primary">
                  Siparişi Tamamla
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </AppBar>
  );
};

export default Navbar;

