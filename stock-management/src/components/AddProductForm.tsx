import React from "react";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, Button, MenuItem } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { fetchProducts } from "../redux/productSlice";
import { ApiRequest } from "../api/ApiRequest";
import { ProductInput } from "../types/product";
import { AppDispatch } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { PRODUCT_UNITS } from '../constants/units';

const schema = z.object({
  name: z.string().min(1, "Ürün adı gereklidir"),
  quantity: z.coerce.number().min(0, "Miktar 0 veya daha büyük olmalıdır"),
  price: z.coerce.number().min(0.01, "Fiyat 0'dan büyük olmalıdır"),
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
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      quantity: 0,
      price: 0,
      unit: "",
      tag: "diğer",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: ProductInput) => {
    try {
      await ApiRequest.addProduct({
        url: "/products",
        body: data,
      });
      await dispatch(fetchProducts({ page: 1, search: "" }));
      navigate("/");
    } catch (error) {
      console.error("Ürün eklenirken hata oluştu:", error);
    }
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Ürün Adı *"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <Controller
            name="quantity"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                type="number"
                label="Miktar *"
                fullWidth
                error={!!error}
                helperText={error?.message}
                onChange={(e) => field.onChange(Number(e.target.value))}
                onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
                sx={{
                  '& input[type=number]': {
                    MozAppearance: 'textfield',
                    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                      WebkitAppearance: 'none',
                      margin: 0,
                    },
                  },
                }}
              />
            )}
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <Controller
            name="price"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                type="number"
                label="Fiyat *"
                fullWidth
                error={!!error}
                helperText={error?.message}
                onChange={(e) => field.onChange(Number(e.target.value))}
                onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
                sx={{
                  '& input[type=number]': {
                    MozAppearance: 'textfield',
                    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                      WebkitAppearance: 'none',
                      margin: 0,
                    },
                  },
                }}
              />
            )}
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <Controller
            name="unit"
            control={control}
            render={({
              field: { onChange, value },
              fieldState: { error },
            }) => (
              <TextField
                select
                label="Birim"
                fullWidth
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error?.message}
              >
                {PRODUCT_UNITS.map((unit) => (
                  <MenuItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <Controller
            name="tag"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                select
                label="Etiket *"
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
        <Grid
          size={{
            xs: 12,
            sm: 6,
          }}
        >
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
        <Grid
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <Button type="submit" variant="contained" color="primary">
            Ürün Ekle
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddProductForm;
