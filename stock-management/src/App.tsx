import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { Container, Typography } from "@mui/material";
import { AppDispatch, RootState } from "./redux/store";
import SearchBar from "./components/SearchBar";
import { useEffect } from "react";
import { fetchProducts } from "./redux/productSlice";
import DashboardLayout from "./components/DashboardLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddProduct from "./pages/AddProduct";
import StockLogs from "./pages/StockLogs";
import Navbar from "./components/Navbar";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.products);
  
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <Container maxWidth="lg">
              <Typography variant="h3" component="h1" gutterBottom>
                Stok Yönetimi
              </Typography>
              <SearchBar />
              <DashboardLayout />
            </Container>
          }
        />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/stock-logs" element={<StockLogs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
