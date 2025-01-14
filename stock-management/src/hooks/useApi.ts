import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import { ApiRequest } from '../api/ApiRequest';

export const useApi = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useApi must be used within a NotificationProvider');
  }

  const handleApiCall = async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
    try {
      return await apiCall();
    } catch (error: any) {
      context.showNotification(error.message || 'Bir hata oluştu', 'error');
      return null;
    }
  };

  return {
    getAllProducts: (page?: number, limit?: number, search?: string) =>
      handleApiCall(() => ApiRequest.getAllProducts(page, limit, search)),
    addProduct: (payload: Parameters<typeof ApiRequest.addProduct>[0]) =>
      handleApiCall(() => ApiRequest.addProduct(payload)),
    updateProduct: (id: string, body: Parameters<typeof ApiRequest.updateProduct>[1]) =>
      handleApiCall(() => ApiRequest.updateProduct(id, body)),
    deleteProduct: (id: string) =>
      handleApiCall(() => ApiRequest.deleteProduct(id)),
    getStockLogs: () =>
      handleApiCall(() => ApiRequest.getStockLogs()),
    toggleProductStatus: (id: string) =>
      handleApiCall(() => ApiRequest.toggleProductStatus(id)),
    updatePublishStatus: (id: string, status: 'published' | 'draft') =>
      handleApiCall(() => ApiRequest.updatePublishStatus(id, status)),
  };
}; 