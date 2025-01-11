import { poolConnection } from "../../config/db.js";


/*
  gjenbrukbar funksjon for å utføre SQL-spørringer med en pool tilkobling.
*/


const executeQuery = async (query, params = []) => {
    try {
        const [rows] = await poolConnection.query(query, params);
        return rows;
    } catch (error) {
        throw new Error(`Query error: ${error.message}`);
    }
};

export default executeQuery;