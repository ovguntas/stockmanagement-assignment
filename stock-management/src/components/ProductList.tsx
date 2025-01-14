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
  TextField,
  InputAdornment,
  Button,
  Container,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { Product } from "../types/product";
import { RootState, AppDispatch } from "../redux/store";
import {
  deleteProductAsync,
  updateProductAsync,
  fetchProducts,
  setSearchTerm,
} from "../redux/productSlice";
import useHoveredImage from "../hooks/useHoveredImage";
import { useNotification } from "../hooks/useNotification";
import { useApi } from "../hooks/useApi";
import { Helmet } from "react-helmet-async";
import ProductDetailModal from "./ProductDetailModal";

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
  const api = useApi();

  useEffect(() => {
    const fetchData = async () => {
      const result = await api.getAllProducts(page + 1, rowsPerPage, searchTerm);
      if (result) {
        dispatch({
          type: 'products/fetchProducts/fulfilled',
          payload: {
            products: result.products,
            total: result.total
          }
        });
      }
    };

    const timer = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, page, searchTerm, rowsPerPage, api]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
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
      const response = await api.toggleProductStatus(product._id);
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
      showSuccess(
        `Ürün durumu ${
          response.isEnabled ? "aktif" : "pasif"
        } olarak güncellendi`
      );
    } catch (error) {
      showError("Ürün durumu güncellenirken bir hata oluştu");
      console.error("Error toggling status:", error);
    }
    handleMenuClose();
  };
  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteProductAsync(id));
      showSuccess("Ürün başarıyla silindi");
    } catch (error) {
      showError("Ürün silinirken bir hata oluştu");
      console.error("Error deleting product:", error);
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
    <>
      <Helmet>
        <title>Ürünler | Stok Yönetimi</title>
      </Helmet>
      <Container maxWidth="lg" sx={{mt:1}}>
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
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
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
                  <TableCell>Sıra</TableCell>
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
                        onMouseEnter={(e) =>
                          handleMouseEnter(e, product.imageUrl || "")
                        }
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
                    <TableCell align="right">{product.price} TL</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={product.isEnabled ? "Aktif" : "Pasif"}
                        color={product.isEnabled ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuClick(e, product)}
                        size="small"
                      >
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
          <MenuItem
            onClick={() =>
              selectedProduct && handleToggleStatus(selectedProduct)
            }
          >
            {selectedProduct?.isEnabled ? "Pasif Yap" : "Aktif Yap"}
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedProduct) {
                navigate(`/stock-update/${selectedProduct._id}`);
                handleMenuClose();
              }
            }}
          >
            Stok Güncelle
          </MenuItem>
          <MenuItem
            onClick={() =>
              selectedProduct && handleDelete(selectedProduct._id)
            }
          >
            Ürün Sil
          </MenuItem>
        </Menu>

        <ProductDetailModal
          open={detailModalOpen}
          onClose={handleCloseDetailModal}
          product={selectedProductForDetail}
          onQuickStockUpdate={handleQuickStockUpdate}
          onToggleStatus={(updatedProduct) => setSelectedProductForDetail(updatedProduct)}
        />

        {hoveredImage && (
          <Box
            sx={{
              position: "fixed",
              top: mousePosition.y + 10,
              left: mousePosition.x + 10,
              zIndex: 9999,
            }}
          >
            <img
              src={hoveredImage}
              alt="Hover Preview"
              style={{
                maxWidth: "200px",
                maxHeight: "200px",
                border: "2px solid #fff",
                borderRadius: "4px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            />
          </Box>
        )}
      </Box>

      </Container>
    </>
  );
};

export default ProductList;
