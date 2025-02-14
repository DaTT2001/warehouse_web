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

// 🔹 Lấy thông tin chi tiết sản phẩm theo ID
export const getInventoryByID = async (productID) => {
  return requestInventory({ id: productID });
};
