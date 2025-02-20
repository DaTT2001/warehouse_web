import axios from "axios";
import { API_ERP_URL } from "../utils/constants";

// Hàm gọi API Inventory
const requestInventory = async (params = {}) => {
    try {
      // ❌ Loại bỏ undefined/null/rỗng trước khi gửi request
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([key, v]) => 
          v !== undefined && v !== null && (key !== "search" || v.trim() !== "")
        )
      );
  
      const queryParams = new URLSearchParams(filteredParams).toString();
      const response = await axios.get(`${API_ERP_URL}/inventory?${queryParams}`);
  
      console.log(`🔗 API Request: ${API_ERP_URL}/inventory?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi API Inventory:", error.response?.data?.error || error.message);
      throw new Error("Lỗi khi gọi API Inventory!");
    }
  };
  

// 🏪 API Inventory (Hàng tồn kho)

// 🔹 Lấy danh sách hàng tồn kho có phân trang & filter

export const getInventory = async ({
  id,
  category,
  minQty,
  maxQty,
  search,
  page = 1,
  limit = 50,
} = {}) => {
  return requestInventory({ id, category, minQty, maxQty, search, page, limit });
};

// 🔹 Lấy tổng số lượng sản phẩm
export const getTotalQuantity = async () => {
  try {
    const response = await axios.get(`${API_ERP_URL}/inventory/total-qty`);
    if (response.data && response.data.totalQty !== undefined) {
      return response.data.totalQty;
    } else {
      throw new Error("Không tìm thấy tổng số lượng sản phẩm");
    }
  } catch (error) {
    console.error("❌ Lỗi lấy tổng số lượng sản phẩm:", error.response?.data?.error || error.message);
    throw new Error("Lỗi khi lấy tổng số lượng sản phẩm!");
  }
};

// 🔹 Lấy thông tin chi tiết sản phẩm theo ID
export const getInventoryByID = async (productID) => {
  try {
    const response = await axios.get(`${API_ERP_URL}/inventory/${productID}`);
    if (response.data) {
      return response.data;
    } else {
      throw new Error("Không tìm thấy sản phẩm");
    }
  } catch (error) {
    console.error("❌ Lỗi lấy thông tin sản phẩm:", error.response?.data?.error || error.message);
    throw new Error("Lỗi khi lấy thông tin sản phẩm!");
  }
};

export const updateProductQuantity = async (productId, quantityToSubtract) => {
  try {
    const response = await axios.put(`${API_ERP_URL}/inventory/${productId}/qty`, {
      qty_to_subtract: quantityToSubtract,
    });

    if (response.data) {
      return response.data;
    } else {
      throw new Error("Không thể cập nhật số lượng sản phẩm");
    }
  } catch (error) {
    console.error("❌ Lỗi cập nhật số lượng sản phẩm:", error.response?.data?.error || error.message);
    throw new Error("Lỗi khi cập nhật số lượng sản phẩm!");
  }
};

export const updoProductQuantity = async (productId, quantityToUndo) => {
  try {
    const response = await axios.put(`${API_ERP_URL}/inventory/${productId}/add-qty`, {
      qty_to_add: quantityToUndo,
    });

    if (response.data) {
      return response.data;
    } else {
      throw new Error("Không thể cập nhật số lượng sản phẩm");
    }
  } catch (error) {
    console.error("❌ Lỗi hoàn tác số lượng sản phẩm:", error.response?.data?.error || error.message);
    throw new Error("Lỗi khi hoàn tác số lượng sản phẩm!");
  }
};

