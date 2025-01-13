import React from "react";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, Button, Grid, MenuItem } from "@mui/material";
import { addProduct } from "../redux/productSlice";

const schema = z.object({
  name: z.string().min(1, "Ürün adı gereklidir"),
  quantity: z.coerce.number().min(0, "Miktar 0 veya daha büyük olmalıdır"),
  unit: z.string().min(1, "Birim gereklidir"),
  tag: z.enum(["kırtasiye", "temizlik", "diğer"]),
  imageUrl: z
    .string()
    .url("Geçerli bir URL giriniz")
    .optional()
    .or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

const AddProductForm: React.FC = () => {
  const dispatch = useDispatch();
  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      quantity: 0,
      unit: "",
      tag: "diğer",
      imageUrl: "",
    },
  });

  const onSubmit = (data: FormData) => {
    dispatch(addProduct({ id: Date.now().toString(), ...data }));
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Ürün Adı"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="quantity"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                type="number"
                label="Miktar"
                fullWidth
                error={!!error}
                helperText={error?.message}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="unit"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Birim"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="tag"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                select
                label="Etiket"
                fullWidth
                error={!!error}
                helperText={error?.message}
              >
                <MenuItem value="kırtasiye">Kırtasiye</MenuItem>
                <MenuItem value="temizlik">Temizlik</MenuItem>
                <MenuItem value="diğer">Diğer</MenuItem>
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="imageUrl"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Fotoğraf URL"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Ürün Ekle
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddProductForm;
