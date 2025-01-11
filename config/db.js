import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

//databaseforbindelse -håndterer samtidige tilkobliner (10)--(skallerbar)
const poolConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}).promise();


const isDbConnected = async () => {
    try {
      await poolConnection.execute("SELECT 0");
      console.log("Connected to DB");  
    } catch (error) {
      console.error("Could not connect to DB", error);
      throw error;
    } 
  };

  export { poolConnection, isDbConnected };
  