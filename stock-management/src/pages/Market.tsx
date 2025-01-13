import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Box,
  IconButton,
  CardActions,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { RootState, AppDispatch } from '../redux/store';
import { fetchProducts, setSearchTerm } from '../redux/productSlice';
import { Product } from '../types/product';
import Grid from '@mui/material/Grid2';
import { Helmet } from 'react-helmet-async';

interface CartItem extends Product {
  cartQuantity: number;
}

const Market: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, searchTerm } = useSelector((state: RootState) => state.products);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchProducts({ page: 1, search: searchTerm }));
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, searchTerm]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(event.target.value));
  };

  const handleUpdateCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      
      let updatedCart;
      if (existingItem) {
        const newQuantity = existingItem.cartQuantity + quantity;
        if (newQuantity <= 0) {
          updatedCart = prevCart.filter(item => item._id !== product._id);
        } else {
          updatedCart = prevCart.map(item =>
            item._id === product._id
              ? { ...item, cartQuantity: newQuantity }
              : item
          );
        }
      } else {
        if (quantity > 0) {
          updatedCart = [...prevCart, { ...product, cartQuantity: quantity }];
        } else {
          updatedCart = prevCart;
        }
      }
      
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      // Dispatch custom event for cart update
      window.dispatchEvent(new Event('cartUpdated'));
      return updatedCart;
    });
  };

  const publishedProducts = products.filter(product => product.isEnabled);

  return (
    <>
      <Helmet>
        <title>Market | Stok Yönetimi</title>
      </Helmet>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Grid container spacing={3}>
          {publishedProducts.map((product) => (
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4,
                lg: 3,
              }}
              key={product._id}
            >
              <Card>
                {product.imageUrl && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.imageUrl}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.tag}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    ${product.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stok: {product.quantity} {product.unit}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleUpdateCart(product, -1)}
                      disabled={!cart.find(item => item._id === product._id)}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography>
                      {cart.find(item => item._id === product._id)?.cartQuantity || 0}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleUpdateCart(product, 1)}
                      disabled={product.quantity === 0}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleUpdateCart(product, 1)}
                    disabled={product.quantity === 0}
                  >
                    Sepete Ekle
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Market; 