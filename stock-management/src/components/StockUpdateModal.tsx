import { Box, Button, Modal, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { handleStockUpdateModal } from "../redux/modalsSlice";
import UseProductForm from "./UseProductForm";

const StockUpdateModal = () => {
  const dispatch = useDispatch();
  const { isStockUpdateOpen } = useSelector((state: RootState) => state.modals);
  const handleOpenStockModal = () => {
    dispatch(handleStockUpdateModal(true));
  };
  const handleCloseStockUpdateModal = () => {
    dispatch(handleStockUpdateModal(false));
  };
  return (
    <div>
      <Button onClick={handleOpenStockModal}>Stok Güncelle</Button>
      <Modal open={isStockUpdateOpen} onClose={handleCloseStockUpdateModal}>
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
          <Typography variant="h5" mb={4} component="h2" gutterBottom>
            Stok Güncelle
          </Typography>
          <UseProductForm />
        </Box>
      </Modal>
    </div>
  );
};

export default StockUpdateModal;
