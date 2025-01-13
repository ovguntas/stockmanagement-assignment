import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField, Button, Grid, MenuItem, Tabs, Tab } from '@mui/material';
import { RootState, AppDispatch } from '../redux/store';
import { updateProductAsync } from '../redux/productSlice';

const schema = z.object({
  productId: z.string().min(1, 'Ürün seçimi gereklidir'),
  amount: z.number().min(0, 'Miktar 0 veya daha büyük olmalıdır'),
});

type FormData = z.infer<typeof schema>;

interface UseProductFormProps {
  onSuccess?: () => void;
}

const UseProductForm: React.FC<UseProductFormProps> = ({ onSuccess }) => {
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.products.products);

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      productId: '',
      amount: 1,
    },
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    reset();
  };

  const onSubmit = async (data: FormData) => {
    try {
      const product = products.find(p => p._id === data.productId);
      if (product) {
        const updatedProduct = {
          ...product,
          quantity: tabValue === 0 
            ? product.quantity - data.amount 
            : data.amount
        };
        await dispatch(updateProductAsync({ id: data.productId, product: updatedProduct })).unwrap();
        reset();
        onSuccess?.();
      }
    } catch (error) {
      console.error("Ürün güncellenirken bir hata oluştu:", error);
    }
  };

  return (
    <>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Stok Azalt" />
        <Tab label="Stok Güncelle" />
      </Tabs>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="productId"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  select
                  label="Ürün"
                  fullWidth
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  helperText={error?.message}
                >
                  {products.map((product) => (
                    <MenuItem key={product._id} value={product._id}>
                      {product.name} ({product.tag}) - Mevcut Stok: {product.quantity}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="amount"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  label={tabValue === 0 ? "Azaltılacak Miktar" : "Yeni Stok Miktarı"}
                  type="number"
                  fullWidth
                  value={value}
                  onChange={(e) => onChange(Number(e.target.value))}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {tabValue === 0 ? "Malzeme Kullan" : "Stok Güncelle"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default UseProductForm;

