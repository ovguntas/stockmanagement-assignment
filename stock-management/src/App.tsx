import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import {  Container, Typography } from "@mui/material";
import { AppDispatch, RootState } from "./redux/store";
import SearchBar from "./components/SearchBar";
import { useEffect } from "react";
import { fetchProducts } from "./redux/productSlice";
import DashboardLayout from "./components/DashboardLayout";
function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.products);
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch]);


  return (
    <>

      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" gutterBottom>
          Stok Yönetimi
        </Typography>
        <SearchBar />
        <DashboardLayout />
      </Container>
    </>
  );
}

export default App;
