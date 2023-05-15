import express from "express";
import TallyController from "../controllers/tally.controller";

export const tallyRoutes = express.Router();
const tallyController = new TallyController;

tallyRoutes.get('/list/',  async (req, res, next) => {
    var list = tallyController.list();

    res.json({data: list});
});