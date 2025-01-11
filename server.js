import express from "express";
import { isDbConnected } from "./config/db.js";
import userAuthRoutes from "./src/routes/userAuthRoutes.js"
import productRoutes from "./src/routes/productsRoutes.js"
import ordersRoutes from "./src/routes/ordersRoutes.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import { allLogManager } from "./src/utils/allLogManager.js";

allLogManager(); // Aktivirer/deaktiverer logging basert på LOGGING_ENABLED i .env

const Port = process.env.PORT;

const app = express();

app.use(express.json()); 
app.use(cookieParser()); // for sikker lagring i stedet for local/session storage
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // hvis klient er på annen port

app.use("/api", userAuthRoutes);
app.use("/api", productRoutes); 
app.use("/api", ordersRoutes);



app.get("/", (req, res) => {
 res.send("Sandefjord Blomsterbutikk REST API");
});

app.listen(Port, () => {
    console.log(`Serveren kjører på port ${Port}`);
    isDbConnected();
});


