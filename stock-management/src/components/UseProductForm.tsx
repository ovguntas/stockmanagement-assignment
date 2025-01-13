import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField, Button, Grid, MenuItem } from '@mui/material';
import { RootState } from '../redux/store';
import { useProduct } from '../redux/productSlice';


const schema = z.object({
  productId: z.string().min(1, 'Ürün seçimi gereklidir'),
  amount: z.number().min(1, 'Miktar 1 veya daha büyük olmalıdır'),
});

type FormData = z.infer<typeof schema>;

const UseProductForm: React.FC = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.products);

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      productId: '',
      amount: 1,
    },
  });

  const onSubmit = (data: FormData) => {
    dispatch(useProduct({ id: data.productId, amount: data.amount }));
    reset();
  };

  return (
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
                  <MenuItem key={product.id} value={product.id}>
                    {product.name} ({product.tag})
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
                label="Kullanılacak Miktar"
                type="number"
                fullWidth
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Malzeme Kullan
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default UseProductForm;

