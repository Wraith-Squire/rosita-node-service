import express from "express";
import TallyService from "../sevices/tally.service";

export const tallyRoutes = express.Router();
const tallyService = new TallyService;

tallyRoutes.get('/list/',  async (req, res, next) => {
    var list = await tallyService.list();

    res.json({data: list});
});

tallyRoutes.get('/details/', async (req, res, next) => {
    var list = await tallyService.details(req.body.id);

    res.json({data: list});
});

tallyRoutes.post('/create/', async (req, res, next) => {
    var list = await tallyService.create(req.body.data);

    res.json({data: list});
});

tallyRoutes.put('/update/', async (req, res, next) => {
    var list = await tallyService.update(req.body.id, req.body.data);

    res.json({data: list});
}); 