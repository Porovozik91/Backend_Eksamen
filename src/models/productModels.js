import executeQuery from "../utils/executeQuery.js";

export const createProduct = async (name, description, price, stock) => {
  const query = "INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)";
  const result = await executeQuery(query, [name, description, price, stock]);
  return result.insertId;
};

export const allProducts = async () => {
  const query = "SELECT * FROM products";
  return await executeQuery(query);
};

export const productById = async (id) => {
  const query = "SELECT * FROM products WHERE id = ?";
  const rows = await executeQuery(query, [id]);
  return rows[0];
};

export const updateProductById = async (id, name, description, price, stock) => {
  const query = `
    UPDATE products SET 
      name = COALESCE(?, name), 
      description = COALESCE(?, description),
      price = COALESCE(?, price),
      stock = COALESCE(?, stock)
    WHERE id = ?`;
  return await executeQuery(query, [name, description, price, stock, id]);
};

export const deleteProductById = async (id) => {
  const query = "DELETE FROM products WHERE id = ?";
  return await executeQuery(query, [id]);
};
