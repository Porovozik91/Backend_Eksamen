import { responseLog } from "../utils/allLogManager.js";
import {
  createOrder, getOrderStatusByName, addOrderItem, updateProductStock,
  updateOrderTotalAmount, allOrders, orderById, productById, updateOrderStatusById,
  deleteOrderById
} from "../models/orderModels.js";
import { poolConnection } from "../../config/db.js"; 

export const addOrders = async (req, res) => {
  const { customerName, items } = req.body;

  let connection;

  try {
    // Henter en ny tilkobling for transaksjonen
    connection = await poolConnection.getConnection();
    await connection.query("START TRANSACTION");

    const pendingStatus = await getOrderStatusByName("pending");
    if (!pendingStatus) return responseLog(res, 400, { message: "Legg til statusene i db" });

    const orderId = await createOrder(customerName, pendingStatus.id);

    let totalAmount = 0;

    for (let item of items) {
      const product = await productById(item.productId); 
      if (!product || product.stock < item.quantity) {
        await connection.query("ROLLBACK");
        return responseLog(res, 400, { message: "Enten denne varen er tom eller ikke nok" });
      }

      await addOrderItem(orderId, item.productId, item.quantity);
      await updateProductStock(item.productId, item.quantity);

      totalAmount += product.price * item.quantity;
    }

    await updateOrderTotalAmount(orderId, totalAmount);
    await connection.query("COMMIT");

    return responseLog(res, 201, { id: orderId, customerName, totalAmount, status: "pending", items });
  } catch (err) {
    console.error("Det oppstod en feil", err);
    if (connection) await connection.query("ROLLBACK");
    return responseLog(res, 500, { message: "Kunne ikke legge til ordren." });
  } finally {
    if (connection) connection.release(); 
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await allOrders();
    return responseLog(res, 200, { orders });
  } catch (err) {
    console.error("Det oppstod en feil:", err);
    return responseLog(res, 500, { message: "Kunne ikke hente ordrer." });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await orderById(id);
    if (rows.length === 0) return responseLog(res, 404, { message: "Ingen ordre med denne ID." });

    const order = {
      id: rows[0].id,
      customerName: rows[0].customerName,
      totalAmount: rows[0].totalAmount,
      status: rows[0].status,
      items: rows.map(item => ({ productId: item.productId, quantity: item.quantity }))
    };

    return responseLog(res, 200, { order });
  } catch (err) {
    console.error("Det oppstod en feil:", err);
    return responseLog(res, 500, { message: "Kunne ikke hente ordre med ID." });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const statusResult = await getOrderStatusByName(status);
    if (!statusResult) return responseLog(res, 400, { message: `Fant ikke ${status} i db.`  });

    const result = await updateOrderStatusById(id, statusResult.id);
    if (result.affectedRows === 0) return responseLog(res, 404, { message: "Ingen ordre på denne Id." });

    return responseLog(res, 200, { id: statusResult.id, status: status });
    } catch (err) {
    console.error("Feil ved oppdatering av ordrestatus:", err);
    return responseLog(res, 500, { message: "Feil ved oppdatering av ordrestatus." });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteOrderById(id);
    if (result.affectedRows === 0) return responseLog(res, 404, { message: "Ingen ordre på denne Id." });

    return responseLog(res, 200, { message: "Ordre ble slettet." });
  } catch (err) {
    console.error("Feil ved sletting av ordre:", err);
    return responseLog(res, 500, { message: "Feil ved sletting av ordre." });
  }
};




  
