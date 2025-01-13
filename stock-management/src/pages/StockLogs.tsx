import  { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { AppDispatch, RootState } from '../redux/store';
import { fetchStockLogs } from '../redux/stockLogSlice';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const StockLogs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { logs, status } = useSelector((state: RootState) => state.stockLogs);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchStockLogs());
    }
  }, [dispatch, status]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy HH:mm', { locale: tr });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Stok Hareket Kayıtları
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ürün Adı</TableCell>
                <TableCell align="right">Önceki Stok</TableCell>
                <TableCell align="right">Yeni Stok</TableCell>
                <TableCell align="right">İşlem Tipi</TableCell>
                <TableCell align="right">Tarih</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell component="th" scope="row">
                    {log.productName}
                  </TableCell>
                  <TableCell align="right">{log.previousQuantity}</TableCell>
                  <TableCell align="right">{log.newQuantity}</TableCell>
                  <TableCell align="right">
                    {log.operationType === 'decrease' ? 'Stok Azaltma' : 'Stok Güncelleme'}
                  </TableCell>
                  <TableCell align="right">{formatDate(log.timestamp)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default StockLogs; 