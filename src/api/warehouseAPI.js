import axios from "axios";
import { API_URL } from "../utils/constants";

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Lấy danh sách sản phẩm thất bại:", error);
    throw new Error("Không thể tải danh sách sản phẩm!");
  }
};

export const addProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/products`, productData);
    return response.data;
  } catch (error) {
    console.error(error.response?.data.error || error.message);
    throw error; // Ném lỗi để xử lý ở frontend
  }
};

export const deleteProduct = async (productID) => {
  try {
    const response = await axios.delete(`${API_URL}/products/${productID}`);
    return response.data;
  } catch (error) {
    console.error("API lỗi khi xóa sản phẩm:", error.response?.data || error.message);
    throw error; // Quan trọng: ném lỗi ra ngoài để catch được
  }
};

export const updateProduct = async (productid, productData) => {
  try {
    const response = await axios.put(`${API_URL}/products/${productid}`, productData);
    console.log(`${API_URL}/products/${productid}`)
    return response.data;
  } catch (error) {
    console.error(error.response?.data.error || error.message);
    throw error; // Ném lỗi để xử lý ở frontend
  }
};

export const getLogs = async () => {
  try {
    const response = await axios.get(`${API_URL}/logs`);
    return response.data;
  } catch (error) {
    console.error("Lấy logs thất bại:", error);
    throw new Error("Không thể tải logs!");
  }
};

export const getReports = async () => {
  try {
    const response = await axios.get(`${API_URL}/reports`);
    return response.data;
  } catch (error) {
    console.error("Lấy báo cáo thất bại:", error);
    throw new Error("Không thể tải báo cáo!");
  }
};

export const getSuppliers = async () => {
  try {
    const response = await axios.get(`${API_URL}/suppliers`);
    return response.data;
  } catch (error) {
    console.error("Lấy danh sách nhà cung cấp thất bại:", error);
    throw new Error("Không thể tải danh sách nhà cung cấp!");
  }
};

export const deleteSupplier = async (supplierId) => {
  try {
    const response = await axios.delete(`${API_URL}/suppliers/${supplierId}`);
    return response.data;
  } catch (error) {
    console.error("API lỗi khi xóa nhà cung cấp:", error.response?.data || error.message);
    throw error; // Quan trọng: ném lỗi ra ngoài để catch được
  }
};

export const addSupplier = async (supplierData) => {
  try {
    const response = await axios.post(`${API_URL}/suppliers`, supplierData);
    return response.data;
  } catch (error) {
    console.error(error.response?.data.error || error.message);
    throw error; // Ném lỗi để xử lý ở frontend
  }
};

export const updateSupplier = async (supplierid, supplierData) => {
  try {
    const response = await axios.put(`${API_URL}/suppliers/${supplierid}`, supplierData);
    console.log(`${API_URL}/suppliers/${supplierid}`)
    return response.data;
  } catch (error) {
    console.error(error.response?.data.error || error.message);
    throw error; // Ném lỗi để xử lý ở frontend
  }
};