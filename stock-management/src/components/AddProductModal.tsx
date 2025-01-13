import { Box, Button, Modal, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { handleAddProductModal } from "../redux/modalsSlice";
import AddProductForm from "./AddProductForm";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

const AddProductModal = () => {
  const dispatch = useDispatch();
  const { isAddProductOpen } = useSelector((state: RootState) => state.modals);
  const handleOpenAddProductModal = () => {
    dispatch(handleAddProductModal(true));
  };
  const handleCloseAddProductModal = () => {
    dispatch(handleAddProductModal(false));
  };
  return (
    <div>
      <Button onClick={handleOpenAddProductModal}>
        <AddCircleRoundedIcon />
      </Button>
      <Modal open={isAddProductOpen} onClose={handleCloseAddProductModal}>
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
          <Typography variant="h5"  mb={4} component="h2" gutterBottom>
            Ürün Ekle
          </Typography>
          <AddProductForm />
        </Box>
      </Modal>
    </div>
  );
};

export default AddProductModal;
