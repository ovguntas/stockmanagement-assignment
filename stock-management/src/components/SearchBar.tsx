import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField } from '@mui/material';
import { RootState } from '../redux/store';
import { setSearchTerm } from '../redux/productSlice';

const SearchBar: React.FC = () => {
    const dispatch = useDispatch();
    const searchTerm = useSelector((state: RootState) => state.products.searchTerm);
  
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchTerm(event.target.value));
    };
  
    return (
      <TextField
        label="Ürün Ara"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearch}
      />
    );
  };

export default SearchBar;

