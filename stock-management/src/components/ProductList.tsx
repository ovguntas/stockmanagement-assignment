import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
  Typography,
  TablePagination,
  Grid2,
  Avatar,
} from "@mui/material";
import PreviewRoundedIcon from "@mui/icons-material/PreviewRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { Product } from "../types/product";
import { RootState } from "../redux/store";
import { removeProduct } from "../redux/productSlice";
import AddProductModal from "./AddProductModal";
import StockUpdateModal from "./StockUpdateModal";

const ProductList: React.FC = () => {
  const dispatch = useDispatch();
  const { products, searchTerm } = useSelector(
    (state: RootState) => state.products
  );

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleRemove = (id: string) => {
    dispatch(removeProduct(id));
  };

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
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

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLElement>,
    imageUrl: string
  ) => {
    setHoveredImage(imageUrl);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLImageElement>) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredImage(null);
  };

  return (
    <>
      <Grid2 container rowSpacing={1}>
        <Grid2 size={9}>
          <Typography variant="h5" component="h2" gutterBottom>
            Ürün Listesi
          </Typography>
        </Grid2>
        <Grid2 size={3} container>
          <StockUpdateModal />
          <AddProductModal />
        </Grid2>
      </Grid2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Resim</TableCell>
              <TableCell>Ürün Adı</TableCell>
              <TableCell align="right">Miktar</TableCell>
              <TableCell align="right">Birim</TableCell>
              <TableCell align="right">Etiket</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell component="th" scope="row">
                  <Avatar
                    alt="Product"
                    src={product.imageUrl}
                    onClick={() => handleOpenModal(product)}
                    onMouseEnter={(event) =>
                      handleMouseEnter(event, product.imageUrl || "")
                    }
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    sx={{ cursor: "pointer" }}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {product.name}
                </TableCell>
                <TableCell align="right">{product.quantity}</TableCell>
                <TableCell align="right">{product.unit}</TableCell>
                <TableCell align="right">{product.tag}</TableCell>
                <TableCell align="right">
                  <Button onClick={() => handleRemove(product.id)}>
                    <DeleteOutlineRoundedIcon />
                  </Button>
                  <Button onClick={() => handleOpenModal(product)}>
                    <PreviewRoundedIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

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
            }}
          />
        </Box>
      )}

      <Modal
        open={!!selectedProduct}
        onClose={handleCloseModal}
        aria-labelledby="product-modal-title"
        aria-describedby="product-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedProduct && (
            <>
              <Typography id="product-modal-title" variant="h6" component="h2">
                {selectedProduct.name}
              </Typography>
              <Typography id="product-modal-description" sx={{ mt: 2 }}>
                Miktar: {selectedProduct.quantity} {selectedProduct.unit}
                <br />
                Etiket: {selectedProduct.tag}
              </Typography>
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ProductList;
