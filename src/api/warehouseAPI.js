import axios from 'axios';
const API_URL = 'http://192.168.10.87:3000';

export const getProducts = async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  };
export const getLogs = async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
};
export const getReports = async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
};
  
  