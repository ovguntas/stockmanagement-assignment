import { Provider } from "react-redux";
import "./App.css";
import { Box, Container, Typography } from "@mui/material";
import { store } from "./redux/store";
import SearchBar from "./components/SearchBar";
import ProductList from "./components/ProductList";
import Navbar from "./components/Navbar";
function App() {
  return (
    <>
      <Provider store={store}>
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
      </Provider>
    </>
  );
}

export default App;
