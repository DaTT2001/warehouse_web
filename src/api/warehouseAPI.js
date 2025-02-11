import axios from "axios";
import { API_URL } from "../utils/constants";

const getToken = () => sessionStorage.getItem("token");

// Chuyển timestamp về UTC+7 và format "yyyy-MM-dd HH:mm:ss"
const convertToUTC7 = (data) => {
  if (!data) return data;

  const convertTime = (val) => {
    if (typeof val === "string" && val.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
      const date = new Date(val);
      date.setHours(date.getHours() + 7); // Chuyển sang UTC+7
      return date.toISOString().replace("T", " ").substring(0, 19); // Format "yyyy-MM-dd HH:mm:ss"
    }
    return val;
  };

  if (Array.isArray(data)) {
    return data.map(item => convertToUTC7(item));
  } else if (typeof data === "object") {
    return Object.fromEntries(Object.entries(data).map(([key, val]) => [key, convertTime(val)]));
  }
  return data;
};

// Hàm request chung
const request = async (method, endpoint, data = null, auth = true) => {
  try {
    const headers = auth ? { Authorization: `Bearer ${getToken()}` } : {};
    const response = await axios({ method, url: `${API_URL}${endpoint}`, data, headers });
    return convertToUTC7(response.data);
  } catch (error) {
    console.error(error.response?.data?.error || error.message);
    throw new Error("Lỗi khi thực hiện request!");
  }
};

// API Calls
export const getProducts = () => request("get", "/products");

export const addProduct = (productData) => request("post", "/products", productData);

export const deleteProduct = (productID) => request("delete", `/products/${productID}`);

export const updateProduct = (productID, updatedProduct) => request("put", `/products/${productID}`, updatedProduct);

export const getLogs = () => request("get", "/logs", null, false);

export const getReports = () => request("get", "/reports");

export const getSuppliers = () => request("get", "/suppliers");

export const deleteSupplier = (supplierId) => request("delete", `/suppliers/${supplierId}`);

export const addSupplier = (supplierData) => request("post", "/suppliers", supplierData);

export const updateSupplier = (supplierId, supplierData) => request("put", `/suppliers/${supplierId}`, supplierData);

export const saveOrder = (orderData) => request("post", "/orders", orderData);

export const getOrders = () => request("get", "/orders");

export const getProductWithID = (productID) => request("get", `/products/${productID}`);

export const deleteOrder = (orderId) => request("delete", `/orders/${orderId}`);
