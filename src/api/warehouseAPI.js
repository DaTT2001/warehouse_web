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
