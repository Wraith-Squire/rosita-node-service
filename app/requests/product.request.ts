import { Rules } from "validatorjs";
import RequestValidator from "../../@helpers/request/request.validator";
import { rejects } from "assert";

class ProductRequestValidator extends RequestValidator {
    rules: Rules = {
        product_name: 'required|string',
        product_price: 'required|numeric',
        product_components: 'array',
        product_cost: 'required|numeric'
    };
}

export default function ProductRequest(req, res, next) {
    new ProductRequestValidator(req.body).validate().then((response) => {
        next();
    }).catch((errors) => {
        console.log(errors);
        res.status(403).send(errors);
    });
}