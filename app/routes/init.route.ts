import express from "express";

export const initRoutes = express.Router();

initRoutes.get('/',  async (req, res, next) => {
    res.send({message: "loaded"});
});