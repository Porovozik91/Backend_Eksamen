import { responseLog } from "../utils/allLogManager.js";
import { 
  allProducts, productById, createProduct, updateProductById, deleteProductById 
} from "../models/productModels.js";


export const addProducts = async (req, res) => {
  const { name, description, price, stock } = req.body;
  try {
    const id = await createProduct(name, description, price, stock);
    return responseLog(res, 201, { id, name, description, price, stock });
  } catch (err) {
    console.error("Feil ved oppretting av produkt:", err);
    return responseLog(res, 500, { message: "Kunne ikke opprette produktet." });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const products = await allProducts();
    return responseLog(res, 200, { products });
  } catch (err) {
    console.error("Feil ved henting av produkter:", err);
    return responseLog(res, 500, { message: "Kunne ikke hente produkter." });
  }
};


export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productById(id);
    if (!product) return responseLog(res, 404, { message: "Ingen produkter med denne Id." });
    return responseLog(res, 200, { product });
  } catch (err) {
    console.error("Feil ved henting av produkt:", err);
    return responseLog(res, 500, { message: "Kunne ikke hente produktet." });
  }
};


export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;
  try {
    const result = await updateProductById(id, name, description, price, stock);
    if (result.affectedRows === 0) return responseLog(res, 404, { message: "Ingen produkter med denne Id." });
    return responseLog(res, 200, { id, name, description, price, stock });
  } catch (err) {
    console.error("Feil ved oppdatering av produkt:", err);
    return responseLog(res, 500, { message: "Kunne ikke oppdatere produktet." });
  }
};


export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteProductById(id);
    if (result.affectedRows === 0) return responseLog(res, 404, { message: "Ingen produkter med denne Id." });
    return responseLog(res, 200, { message: "Produktet er slettet." });
  } catch (err) {
    console.error("Feil ved sletting av produkt:", err);
    return responseLog(res, 500, { message: "Kunne ikke slette produktet." });
  }
};



