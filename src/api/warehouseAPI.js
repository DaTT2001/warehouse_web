import axios from "axios";
import { API_URL } from "../utils/constants";

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Lấy danh sách sản phẩm thất bại:", error);
    return [];
  }
};

export const getLogs = async () => {
  try {
    const response = await axios.get(`${API_URL}/logs`);
    return response.data;
  } catch (error) {
    console.error("Lấy logs thất bại:", error);
    return [];
  }
};

export const getReports = async () => {
  try {
    const response = await axios.get(`${API_URL}/reports`);
    return response.data;
  } catch (error) {
    console.error("Lấy báo cáo thất bại:", error);
    return [];
  }
};

export const getSuppliers = async () => {
    try {
      const response = await axios.get(`${API_URL}/suppliers`);
      return response.data;
    } catch (error) {
      console.error("Lấy danh sách nhà cung cấp thất bại:", error);
      return [];
    }
};

export const deleteSupplier = async (item) => {
    try {
      const response = await axios.get(`${API_URL}/suppliers/${item}`);
      return response.data;
    } catch (error) {
      console.error("Xóa nhà cung cấp thất bại", error);
      return [];
    }
};