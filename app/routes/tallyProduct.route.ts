import express from "express";
import TallyProductRequest from "../requests/tallyProduct.request";


export const tallyProductRoutes = express.Router();

tallyProductRoutes.post('/validate/', TallyProductRequest,  async (req, res, next) => {

    res.json({message: "Tally Product is valid.", code: 200});
});
