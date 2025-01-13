import { Container, Typography, Paper } from '@mui/material';
import AddProductForm from '../components/AddProductForm';
import { Helmet } from 'react-helmet-async';

const NewProduct = () => {

  return (
    <>
      <Helmet>
        <title>Yeni Ürün Ekle | Stok Yönetimi</title>
      </Helmet>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Yeni Ürün Ekle
          </Typography>
          <AddProductForm />
        </Paper>
      </Container>
    </>
  );
};

export default NewProduct; 