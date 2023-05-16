import express from "express";
import TallyService from "../sevices/tally.service";
import TallyRequest from "../requests/tally.request";

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

tallyRoutes.put('/update/', TallyRequest, async (req, res, next) => {

    await tallyService.update(req.body.id, req.body.data);

    res.json({message: "Tally updated successfully", code: 200});
    // await new TallyRequest(req.body.data).validate().then(async (validated) => {
    //     await tallyService.update(req.body.id, validated);

    //     res.json({message: "Tally updated successfully", code: 200});
    // }).catch((errors) => {
    //     errors.code = 400;

    //     res.json(errors);
    // });
}); 