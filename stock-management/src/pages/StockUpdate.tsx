import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Container, Paper, Typography, TextField, Button, Box } from '@mui/material';
import { AppDispatch } from '../redux/store';
import { updateProductAsync } from '../redux/productSlice';
import { Product } from '../types/product';
import { ApiRequest } from '../api/ApiRequest';
import { useNotification } from "../hooks/useNotification";

const StockUpdate = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { showSuccess, showError } = useNotification();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await ApiRequest.getAllProducts();
        const foundProduct = response.products.find(p => p._id === id);
        if (foundProduct) {
          setProduct(foundProduct);
          setQuantity(foundProduct.quantity);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      await dispatch(
        updateProductAsync({
          id: product._id,
          product: {
            ...product,
            quantity: Number(quantity),
          },
        })
      );
      showSuccess("Stok miktarı başarıyla güncellendi");
      navigate("/");
    } catch (error) {
      showError("Stok güncellenirken bir hata oluştu");
      console.error("Error updating stock:", error);
    }
  };

  if (!product) {
    return (
      <Container maxWidth="sm">
        <Typography>Ürün yükleniyor...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Stok Güncelle
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {product.name}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Stok Miktarı"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            margin="normal"
            InputProps={{
              endAdornment: <Typography>{product.unit}</Typography>
            }}
          />
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate('/')} color="inherit">
              İptal
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Güncelle
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default StockUpdate; 