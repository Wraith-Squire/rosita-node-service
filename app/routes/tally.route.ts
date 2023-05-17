import express from "express";
import TallyService from "../sevices/tally.service";
import TallyRequest from "../requests/tally.request";

export const tallyRoutes = express.Router();
const tallyService = new TallyService;

tallyRoutes.get('/list/',  async (req, res, next) => {
    var list = await tallyService.list();

    res.send(list);
});

tallyRoutes.get('/details/', async (req, res, next) => {
    var details = await tallyService.details(req.body.id);

    res.json(details);
});

tallyRoutes.post('/create/', TallyRequest,  async (req, res, next) => {
    await tallyService.create(req.body.data);

    res.json({message: "Tally created successfully", code: 200});
});

tallyRoutes.put('/update/', TallyRequest, async (req, res, next) => {
    await tallyService.update(req.body.id, req.body.data);

    res.json({message: "Tally updated successfully", code: 200});
}); 

tallyRoutes.delete('/delete/', async (req, res, next) => {
    await tallyService.delete(req.body.id);

    res.json({message: "Tally updated successfully", code: 200});
}); 