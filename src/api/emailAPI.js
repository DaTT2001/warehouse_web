import emailjs from "emailjs-com"; // Import EmailJS
import { toast } from "react-toastify";

export const sendOrderEmail = async (erp_order_id, productid, productname, quantity, time, employeeId, employeeName) => {
    try {
        await emailjs.send(
            "service_gsef9em",        // Service ID (dịch vụ gửi email)
            "template_wzi24kx",       // Template ID (mẫu email)
            {
                erp_order_id: erp_order_id,
                productid: productid,
                productname: productname,
                quantity: quantity,
                time: time,
                employeeID: employeeId,
                employeeName: employeeName
            },
            "HhpZ4GBup32vqEdAh"  // 🔥 Quan trọng: Thêm Public Key vào đây!
        );

        console.log("📧 Email gửi thành công!");
        toast.success("Email thông báo đã được gửi!");
    } catch (error) {
        console.error("❌ Lỗi khi gửi email:", error);
        toast.error("Lỗi khi gửi email ❌");
    }
};
