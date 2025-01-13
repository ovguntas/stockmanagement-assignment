import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Box,
  Typography,
  Chip,
  Menu,
  MenuItem,
  Switch,
  FormControlLabel,
  TextField,
  InputAdornment,
  Button,
  Modal,
  Grid,
  ButtonGroup,
  IconButton as MuiIconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { Product } from "../types/product";
import { RootState, AppDispatch } from "../redux/store";
import {
  deleteProductAsync,
  updateProductAsync,
  fetchProducts,
  setSearchTerm,
} from "../redux/productSlice";
import { ApiRequest } from "../api/ApiRequest";
import useHoveredImage from "../hooks/useHoveredImage";
import { useNotification } from "../hooks/useNotification";

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { products, searchTerm, total } = useSelector(
    (state: RootState) => state.products
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] =
    useState<Product | null>(null);
  const {
    hoveredImage,
    mousePosition,
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
  } = useHoveredImage();
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchProducts({ page: page + 1, search: searchTerm, limit: rowsPerPage }));
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, page, searchTerm, rowsPerPage]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(event.target.value));
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    product: Product
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const handleToggleStatus = async (product: Product) => {
    try {
      const response = await ApiRequest.toggleProductStatus(product._id);
      dispatch(
        updateProductAsync({
          id: product._id,
          product: {
            ...product,
            isEnabled: response.isEnabled,
            status: response.isEnabled ? "published" : "draft",
          },
        })
      );
      showSuccess(`Ürün durumu ${response.isEnabled ? "aktif" : "pasif"} olarak güncellendi`);
    } catch (error) {
      showError("Ürün durumu güncellenirken bir hata oluştu");
      console.error("Error toggling status:", error);
    }
    handleMenuClose();
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (product: Product) => {
    setSelectedProductForDetail(product);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedProductForDetail(null);
  };

  const handleQuickStockUpdate = async (product: Product, change: number) => {
    const newQuantity = product.quantity + change;
    if (newQuantity < 0) return;

    try {
      await dispatch(
        updateProductAsync({
          id: product._id,
          product: {
            ...product,
            quantity: newQuantity,
          },
        })
      );
      await dispatch(fetchProducts({ page: page + 1, search: searchTerm }));
      setSelectedProductForDetail({
        ...product,
        quantity: newQuantity,
      });
      showSuccess("Stok miktarı başarıyla güncellendi");
    } catch (error) {
      showError("Stok güncellenirken bir hata oluştu");
      console.error("Error updating stock:", error);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          sx={{ flex: 1, mr: 2 }}
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/new-product")}
        >
          Ürün Ekle
        </Button>
      </Box>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sn</TableCell>
                <TableCell>Ürün</TableCell>
                <TableCell>Kategori</TableCell>
                <TableCell align="right">Stok</TableCell>
                <TableCell align="right">Fiyat</TableCell>
                <TableCell align="center">Durum</TableCell>
                <TableCell align="right">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow
                  key={product._id}
                  onClick={() => handleRowClick(product)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                  }}
                >
                  <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                  <TableCell>
                    <Box 
                      onMouseEnter={(e) => handleMouseEnter(e, product.imageUrl || "")}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={handleMouseMove}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      {product.imageUrl && (
                        <Box
                          component="img"
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            mr: 2,
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                          src={product.imageUrl}
                          alt={product.name}
                        />
                      )}
                      <Typography variant="body1">{product.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{product.tag}</TableCell>
                  <TableCell align="right">{product.quantity}</TableCell>
                  <TableCell align="right">${product.price}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={product.isEnabled ? "Yayında" : "Taslak"}
                      color={product.isEnabled ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleMenuClick(e, product)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedProduct && (
          <>
            <MenuItem>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedProduct.isEnabled}
                    onChange={() => handleToggleStatus(selectedProduct)}
                  />
                }
                label={selectedProduct.isEnabled ? "Pasifleştir" : "Aktifleştir"}
              />
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate(`/stock-update/${selectedProduct._id}`);
                handleMenuClose();
              }}
            >
              Stok Güncelle
            </MenuItem>
            <MenuItem
              onClick={async () => {
                try {
                  await dispatch(deleteProductAsync(selectedProduct._id));
                  showSuccess("Ürün başarıyla silindi");
                } catch (error) {
                  showError("Ürün silinirken bir hata oluştu");
                }
                handleMenuClose();
              }}
            >
              Sil
            </MenuItem>
          </>
        )}
      </Menu>

      {hoveredImage && (
        <Box
          sx={{
            position: "fixed",
            top: `${mousePosition.y + 15}px`,
            left: `${mousePosition.x + 15}px`,
            zIndex: 1300,
            pointerEvents: "none",
            width: "150px",
            height: "150px",
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <img
            src={hoveredImage}
            alt="Hovered"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      )}

      <Modal
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
        aria-labelledby="product-detail-modal"
      >
        <Box
          sx={{
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
          }}
        >
          {selectedProductForDetail && (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" component="h2">
                  Ürün Detayları
                </Typography>
                <IconButton
                  color="error"
                  onClick={async () => {
                    try {
                      await dispatch(deleteProductAsync(selectedProductForDetail._id));
                      showSuccess("Ürün başarıyla silindi");
                      handleCloseDetailModal();
                    } catch (error) {
                      showError("Ürün silinirken bir hata oluştu");
                      console.error("Error deleting product:", error);
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Grid container spacing={2}>
                {selectedProductForDetail.imageUrl && (
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "center", mb: 2 }}
                  >
                    <Box
                      component="img"
                      src={selectedProductForDetail.imageUrl}
                      alt={selectedProductForDetail.name}
                      sx={{
                        width: "100%",
                        maxWidth: 200,
                        height: "auto",
                        maxHeight: 200,
                        objectFit: "contain",
                        borderRadius: 1,
                      }}
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ürün Adı
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedProductForDetail.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Kategori
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedProductForDetail.tag}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Stok Miktarı
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="body1">
                      {selectedProductForDetail.quantity}{" "}
                      {selectedProductForDetail.unit}
                    </Typography>
                    <ButtonGroup size="small">
                      <MuiIconButton
                        onClick={() =>
                          handleQuickStockUpdate(selectedProductForDetail, -1)
                        }
                        size="small"
                        color="primary"
                      >
                        <RemoveIcon fontSize="small" />
                      </MuiIconButton>
                      <MuiIconButton
                        onClick={() =>
                          handleQuickStockUpdate(selectedProductForDetail, 1)
                        }
                        size="small"
                        color="primary"
                      >
                        <AddIcon fontSize="small" />
                      </MuiIconButton>
                    </ButtonGroup>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Fiyat
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    ${selectedProductForDetail.price}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex',flexDirection: 'column', alignItems: 'start', gap: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Durum
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Chip
                        label={selectedProductForDetail.isEnabled ? "Yayında" : "Taslak"}
                        color={selectedProductForDetail.isEnabled ? "success" : "default"}
                        size="small"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={selectedProductForDetail.isEnabled}
                            onChange={async () => {
                              try {
                                const response = await ApiRequest.toggleProductStatus(selectedProductForDetail._id);
                                dispatch(
                                  updateProductAsync({
                                    id: selectedProductForDetail._id,
                                    product: {
                                      ...selectedProductForDetail,
                                      isEnabled: response.isEnabled,
                                      status: response.isEnabled ? "published" : "draft",
                                    },
                                  })
                                );
                                setSelectedProductForDetail({
                                  ...selectedProductForDetail,
                                  isEnabled: response.isEnabled,
                                  status: response.isEnabled ? "published" : "draft",
                                });
                                showSuccess(`Ürün durumu ${response.isEnabled ? "aktif" : "pasif"} olarak güncellendi`);
                              } catch (error) {
                                showError("Ürün durumu güncellenirken bir hata oluştu");
                                console.error("Error toggling status:", error);
                              }
                            }}
                          />
                        }
                        label={selectedProductForDetail.isEnabled ? "Pasifleştir" : "Aktifleştir"}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={handleCloseDetailModal}>Kapat</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ProductList;
