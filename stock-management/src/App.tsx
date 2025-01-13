import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProductList from "./components/ProductList";
import AddProduct from "./pages/AddProduct";
import NewProduct from "./pages/NewProduct";
import StockUpdate from "./pages/StockUpdate";
import Market from "./pages/Market";
import StockLogs from "./pages/StockLogs";
import { NotificationProvider } from "./context/NotificationContext";

const AppContent = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const showSidebar = location.pathname !== "/market";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar onMenuClick={handleDrawerToggle} />
      <Box sx={{ display: "flex", flex: 1, mt: "64px" }}>
        {showSidebar && (
          <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />
        )}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: "100%",
          }}
        >
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product-update" element={<AddProduct />} />
            <Route path="/new-product" element={<NewProduct />} />
            <Route path="/stock-update/:id" element={<StockUpdate />} />
            <Route path="/market" element={<Market />} />
            <Route path="/stock-logs" element={<StockLogs />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <NotificationProvider>
      <Router>
        <AppContent />
      </Router>
    </NotificationProvider>
  );
}

export default App;
