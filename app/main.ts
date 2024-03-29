import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import { tallyRoutes } from "./routes/tally.route";
import { tallyProductRoutes } from "./routes/tallyProduct.route";
import { productRoutes } from "./routes/product.route";
import { initRoutes } from "./routes/init.route";

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/tally', tallyRoutes);
app.use('/api/product', productRoutes);
app.use('/api/tallyProduct', tallyProductRoutes);
app.use('/api/init', initRoutes);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});