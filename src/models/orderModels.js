import executeQuery from "../utils/executeQuery.js";

export const getOrderStatusByName = async (statusName) => {
  const query = "SELECT id FROM orderStatuses WHERE `status` = ?";
  const rows = await executeQuery(query, [statusName]);
  return rows[0];
};

export const createOrder = async (customerName, orderStatusId) => {
  const query = "INSERT INTO orders (customerName, totalAmount, orderStatusId) VALUES (?, ?, ?)";
  const result = await executeQuery(query, [customerName, 0, orderStatusId]);
  return result.insertId;
};

export const productById = async (productId) => {
  const query = "SELECT id, price, stock FROM products WHERE id = ?";
  const rows = await executeQuery(query, [productId]);
  return rows[0]; 
};

export const addOrderItem = async (orderId, productId, quantity) => {
  const query = "INSERT INTO orderItems (orderId, productId, quantity) VALUES (?, ?, ?)";
  await executeQuery(query, [orderId, productId, quantity]);
};

export const updateProductStock = async (productId, quantity) => {
  const query = "UPDATE products SET stock = stock - ? WHERE id = ?";
  await executeQuery(query, [quantity, productId]);
};

export const updateOrderTotalAmount = async (orderId, totalAmount) => {
  const query = "UPDATE orders SET totalAmount = ? WHERE id = ?";
  await executeQuery(query, [totalAmount, orderId]);
};

export const allOrders = async () => {
  const query = `
    SELECT o.id, o.customerName, o.totalAmount, os.status
    FROM orders o
    JOIN orderStatuses os ON o.orderStatusId = os.id
  `;
  return await executeQuery(query);
};

export const orderById = async (orderId) => {
  const query = `
    SELECT o.id, o.customerName, o.totalAmount, os.status, oi.productId, oi.quantity
    FROM orders o
    JOIN orderStatuses os ON o.orderStatusId = os.id
    JOIN orderItems oi ON o.id = oi.orderId
    WHERE o.id = ?`;
  return await executeQuery(query, [orderId]);
};

export const updateOrderStatusById = async (orderId, statusId) => {
  const query = "UPDATE orders SET orderStatusId = ? WHERE id = ?";
  return await executeQuery(query, [statusId, orderId]);
};

export const deleteOrderById = async (orderId) => {
  const query = "DELETE FROM orders WHERE id = ?";
  return await executeQuery(query, [orderId]);
};

