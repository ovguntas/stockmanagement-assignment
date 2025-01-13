import React from "react";
import {
  Modal,
  Box,
  Typography,
  ButtonGroup,
  IconButton,
  Chip,
  Button,
  FormControlLabel,
  Switch,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { Product } from "../types/product";
import { ApiRequest } from "../api/ApiRequest";
import { useDispatch } from "react-redux";
import { updateProductAsync, deleteProductAsync } from "../redux/productSlice";
import { useNotification } from "../hooks/useNotification";
import { AppDispatch } from "../redux/store";

interface ProductDetailModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onQuickStockUpdate: (product: Product, change: number) => Promise<void>;
  onToggleStatus?: (updatedProduct: Product) => void;
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "90%",
    sm: "70%",
    md: 600,
  },
  maxHeight: {
    xs: "90vh",
    sm: "80vh",
  },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: 2, sm: 4 },
  borderRadius: 2,
  overflow: "auto",
};

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  open,
  onClose,
  product,
  onQuickStockUpdate,
  onToggleStatus,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { showSuccess, showError } = useNotification();

  if (!product) return null;

  const handleToggleStatus = async () => {
    try {
      const response = await ApiRequest.toggleProductStatus(product._id);
      const updatedProduct = {
        ...product,
        isEnabled: response.isEnabled,
        status: response.isEnabled ? "published" : "draft",
      };
      
      await dispatch(
        updateProductAsync({
          id: product._id,
          product: updatedProduct,
        })
      );
      
      onToggleStatus?.(updatedProduct);
      showSuccess(`Ürün durumu ${response.isEnabled ? "aktif" : "pasif"} olarak güncellendi`);
    } catch (error) {
      showError("Ürün durumu güncellenirken bir hata oluştu");
      console.error("Error toggling status:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteProductAsync(product._id));
      showSuccess("Ürün başarıyla silindi");
      onClose();
    } catch (error) {
      showError("Ürün silinirken bir hata oluştu");
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" component="h2">
            Ürün Detayları
          </Typography>
          <IconButton color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
            }}
          >
            {product.imageUrl && (
              <Box
                component="img"
                sx={{
                  width: "100%",
                  maxWidth: 200,
                  height: "auto",
                  maxHeight: 200,
                  objectFit: "contain",
                  borderRadius: 1,
                }}
                src={product.imageUrl}
                alt={product.name}
              />
            )}
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 8,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Ürün Adı
            </Typography>
            <Typography variant="body1" gutterBottom>
              {product.name}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Kategori
            </Typography>
            <Typography variant="body1" gutterBottom>
              {product.tag}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Stok Miktarı
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1">
                {product.quantity} {product.unit}
              </Typography>
              <ButtonGroup size="small">
                <IconButton
                  onClick={() => onQuickStockUpdate(product, -1)}
                  disabled={product.quantity <= 0}
                  size="small"
                  color="primary"
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => onQuickStockUpdate(product, 1)}
                  size="small"
                  color="primary"
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </ButtonGroup>
            </Box>

            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mt: 2 }}
            >
              Fiyat
            </Typography>
            <Typography variant="body1" gutterBottom>
              {product.price} TL
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                gap: 2,
                mt: 2,
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Durum
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Chip
                  label={product.isEnabled ? "Aktif" : "Pasif"}
                  color={product.isEnabled ? "success" : "default"}
                  size="small"
                />
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={product.isEnabled}
                      onChange={handleToggleStatus}
                    />
                  }
                  label={product.isEnabled ? "Pasifleştir" : "Aktifleştir"}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose}>Kapat</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProductDetailModal;
