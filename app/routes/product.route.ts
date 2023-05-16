import express from "express";

import ProductService from "../sevices/product.service";
import ProductRequest from "../requests/product.request";

export const productRoutes = express.Router();
const productService = new ProductService;

productRoutes.get('/list/',  async (req, res, next) => {
    var list = await productService.list();

    res.json({data: list});
});

productRoutes.get('/details/', async (req, res, next) => {
    var list = await productService.details(req.body.id);

    res.json({data: list});
});

productRoutes.post('/create/', ProductRequest,  async (req, res, next) => {
    await productService.create(req.body.data);

    res.json({message: "Product created successfully", code: 200});
});

productRoutes.put('/update/', ProductRequest, async (req, res, next) => {
    await productService.update(req.body.id, req.body.data);

    res.json({message: "Product updated successfully", code: 200});
}); 

productRoutes.delete('/delete/', async (req, res, next) => {
    await productService.delete(req.body.id);

    res.json({message: "Product updated successfully", code: 200});
}); 