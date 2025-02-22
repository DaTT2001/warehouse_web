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
const checkOrderID = async (orderID) => {
  try {
    if (!orderID) {
      throw new Error("Thiếu orderID");
    }

    const response = await axios.post(`${API_ERP_URL}/check-order-id`, { orderID });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi kiểm tra Order ID:", error);
    return { error: error.message };
  }
};

export const generateUniqueOrderID = async () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().slice(-2);
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const prefix = `I100-${year}${month}`;

  let uniqueID;
  let isDuplicate = true;

  while (isDuplicate) {
    const randomPart = String(Math.floor(100000 + Math.random() * 900000));
    uniqueID = `${prefix}${randomPart}`;

    try {
      const response = await checkOrderID(uniqueID);
      if (response.isUnique) {
        isDuplicate = false;
      }
    } catch (error) {
      console.error("❌ Lỗi kiểm tra orderID:", error.message);
      throw new Error("Lỗi khi kiểm tra orderID!");
    }
  }

  return uniqueID;
};
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

export const insertData = async (orderID, deptID, userID, time) => {
  const data = {
    "INA00": "1",
    "INA01": orderID,
    "INA04": deptID,
    "INACONF": "N",
    "INA08": "0",
    "INA11": userID,
    "INAUSER": userID,
    "INAMODU": userID,
    "INAMKSG": "N",
    "INACONT": time,
    "INACONU": userID,
    "INAPOST": "N",
    "INAORIU": userID,
    "INAORIG": deptID,
    "INAGRUP": deptID,
    "INASPC": "0",
    "INAPOS": "N"
  };
  console.log(data);
  
  try {
    const response = await axios.post(`${API_ERP_URL}/insert`, data);
    
    if (response.data) {
      console.log('✅ Dữ liệu đã được insert thành công:', response.data.message);
      return response.data;
    } else {
      throw new Error("❌ Không thể insert dữ liệu");
    }
  } catch (error) {
    console.error("❌ Lỗi khi insert dữ liệu:", error.response?.data?.error || error.message);
    throw new Error("Lỗi khi insert dữ liệu!");
  }
};

export const insertINBData = async (orderID, productID, quantity, unit) => {
  const data = {
    "INB01" : orderID,
    "INB04" : productID,
    "INB09" : quantity,
    "INB16" : quantity,
    "INB08" : unit
  }
  try {
    const response = await axios.post('/api/insert-inb', data);
    if (response.data) {
      console.log('✅ Dữ liệu INB đã được insert thành công:', response.data.message);
      return response.data;
    } else {
      throw new Error("❌ Không thể insert dữ liệu INB");
    }
  } catch (error) {
    console.error("❌ Lỗi khi insert dữ liệu INB:", error.response?.data?.error || error.message);
    throw new Error("Lỗi khi insert dữ liệu INB!");
  }
};

export const getEmployeeData = async (employeeID) => {
  try {
    const response = await axios.get(`${API_ERP_URL}/get-gen/${employeeID}`);
    if (response.data) {
      return response.data;
    } else {
      throw new Error("Không tìm thấy nhân viên");
    }
  } catch (error) {
    console.error("❌ Lỗi khi lấy dữ liệu nhân viên:", error.response?.data?.error || error.message);
    throw new Error("Lỗi khi lấy dữ liệu nhân viên!");
  }
};