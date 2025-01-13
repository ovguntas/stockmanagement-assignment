import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { Box, Container, Typography } from "@mui/material";
import { AppDispatch, RootState } from "./redux/store";
import SearchBar from "./components/SearchBar";
import ProductList from "./components/ProductList";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import { fetchProducts } from "./redux/productSlice";
function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.products);
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch]);

  // if (status === "loading") {
  //   return <p>Yükleniyor...</p>;
  // }

  // if (status === "failed") {
  //   return <p>Hata: {error}</p>;
  // }
  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" gutterBottom>
          Stok Yönetimi
        </Typography>
        <SearchBar />
        <Box my={4}>
          <ProductList />
        </Box>
      </Container>
    </>
  );
}

export default App;
