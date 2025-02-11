import axios from "axios";
import { API_URL } from "../utils/constants";

export const getProducts = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.get(`${API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lấy danh sách sản phẩm thất bại:", error);
    throw new Error("Không thể tải danh sách sản phẩm!");
  }
};

export const addProduct = async (productData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.post(`${API_URL}/products`, productData, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    return response.data;
  } catch (error) {
    console.error(error.response?.data.error || error.message);
    throw error; // Ném lỗi để xử lý ở frontend
  }
};

export const deleteProduct = async (productID) => {
  try {
    const token = sessionStorage.getItem("token"); // Lấy token từ sessionStorage

    const response = await axios.delete(`${API_URL}/products/${productID}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });

    return response.data;
  } catch (error) {
    console.error("API lỗi khi xóa sản phẩm:", error.response?.data || error.message);
    throw error; // Quan trọng: ném lỗi ra ngoài để catch được
  }
};

export const updateProduct = async (productid, updatedProduct) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.put(`${API_URL}/products/${productid}`, updatedProduct, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });

    return response.data; // Trả về dữ liệu cập nhật thành công
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error.response?.data.error || error.message);
    return null; // Trả về null để frontend có thể kiểm tra lỗi
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
    const token = sessionStorage.getItem("token");
    const response = await axios.get(`${API_URL}/suppliers`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lấy danh sách nhà cung cấp thất bại:", error);
    throw new Error("Không thể tải danh sách nhà cung cấp!");
  }
};

export const deleteSupplier = async (supplierId) => {
  try {
    const token = sessionStorage.getItem("token")
    const response = await axios.delete(`${API_URL}/suppliers/${supplierId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    return response.data;
  } catch (error) {
    console.error("API lỗi khi xóa nhà cung cấp:", error.response?.data || error.message);
    throw error; // Quan trọng: ném lỗi ra ngoài để catch được
  }
};

export const addSupplier = async (supplierData) => {
  try {
    const token = sessionStorage.getItem("token")
    const response = await axios.post(`${API_URL}/suppliers`, supplierData, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    return response.data;
  } catch (error) {
    console.error(error.response?.data.error || error.message);
    throw error; // Ném lỗi để xử lý ở frontend
  }
};

export const updateSupplier = async (supplierid, supplierData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.put(`${API_URL}/suppliers/${supplierid}`, supplierData, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    });
    console.log(`${API_URL}/suppliers/${supplierid}`)
    return response.data;
  } catch (error) {
    console.error(error.response?.data.error || error.message);
    throw error; // Ném lỗi để xử lý ở frontend
  }
};

export const saveOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Gửi token trong header
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi lưu đơn hàng:", error.response?.data?.error || error.message);
    throw error;
  }
};