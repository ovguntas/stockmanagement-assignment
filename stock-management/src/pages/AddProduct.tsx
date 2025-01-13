import { Container, Typography, Paper } from '@mui/material';
import UseProductForm from '../components/UseProductForm';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const AddProduct = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Stok İşlemleri | Stok Yönetimi</title>
      </Helmet>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Stok İşlemleri
          </Typography>
          <UseProductForm onSuccess={() => navigate('/')} />
        </Paper>
      </Container>
    </>
  );
};

export default AddProduct; 