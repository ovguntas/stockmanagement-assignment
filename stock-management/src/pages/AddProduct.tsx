import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import UseProductForm from '../components/UseProductForm';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Stok İşlemleri
        </Typography>
        <UseProductForm onSuccess={() => navigate('/')} />
      </Paper>
    </Container>
  );
};

export default AddProduct; 