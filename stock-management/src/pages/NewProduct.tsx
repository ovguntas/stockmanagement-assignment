import { Container, Typography, Paper } from '@mui/material';
import AddProductForm from '../components/AddProductForm';

const NewProduct = () => {

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Yeni Ürün Ekle
        </Typography>
        <AddProductForm />
      </Paper>
    </Container>
  );
};

export default NewProduct; 