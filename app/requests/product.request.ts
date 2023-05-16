import { Rules } from "validatorjs";
import RequestValidator from "../../@helpers/request/request.validator";

class ProductRequestValidator extends RequestValidator {
    rules: Rules = {
        product_name: 'required|alpha',
        product_price: 'required|number',
        product_components: 'required|array',
        product_cost: 'required|number'
    };
}

export default function ProductRequest(req, res, next) {
    new ProductRequestValidator(req.body.data).validate().then((response) => {
        next();
    }).catch((errors) => {
        errors.code = 400;

        res.json(errors);
    });
}