import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import { AppDispatch } from "../redux/store";
import { updateProductAsync } from "../redux/productSlice";
import { Product } from "../types/product";
import { ApiRequest } from "../api/ApiRequest";
import { useNotification } from "../hooks/useNotification";
import { Helmet } from "react-helmet-async";
import { PRODUCT_UNITS } from '../constants/units';

const StockUpdate = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { showSuccess, showError } = useNotification();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await ApiRequest.getAllProducts();
        const foundProduct = response.products.find((p) => p._id === id);
        if (foundProduct) {
          setProduct(foundProduct);
          setQuantity(foundProduct.quantity.toString());
        }
      } catch (error) {
        console.error("Error fetching product:", error);
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
            quantity: quantity === "" ? 0 : Number(quantity),
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
      <>
        <Helmet>
          <title>Stok Güncelle | Stok Yönetimi</title>
        </Helmet>
        <Container maxWidth="lg">
          <Typography>Ürün yükleniyor...</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${product.name} - Stok Güncelle | Stok Yönetimi`}</title>
      </Helmet>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Stok Güncelle
          </Typography>
          <Typography variant="h5" my={2} textAlign={"center"} gutterBottom>
            {product.name}
          </Typography>
          {product.imageUrl && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <Box
                component="img"
                src={product.imageUrl}
                alt={product.name}
                sx={{
                  width: "100%",
                  maxWidth: 200,
                  height: "auto",
                  maxHeight: 200,
                  objectFit: "contain",
                  borderRadius: 1,
                }}
              />
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Yeni Stok Miktarı"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              margin="normal"
              onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
              sx={{
                '& input[type=number]': {
                  MozAppearance: 'textfield',
                  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
                },
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="start">
                      {product.unit}
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              select
              label="Birim"
              fullWidth
              value={product.unit}
              disabled
            >
              {PRODUCT_UNITS.map((unit) => (
                <MenuItem key={unit.value} value={unit.value}>
                  {unit.label}
                </MenuItem>
              ))}
            </TextField>
            <Box
              sx={{
                mt: 3,
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
              }}
            >
              <Button onClick={() => navigate("/")} color="inherit">
                İptal
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Güncelle
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default StockUpdate;
