import { Rules } from "validatorjs";
import RequestValidator from "../../@helpers/request/request.validator";

class TallyProductRequestValidator extends RequestValidator {
    rules: Rules = {
        product_id: 'required|integer',
        product_name: 'required|string',
        product_count: 'required|integer',
        product_unsold: 'required|integer',
        product_sold: 'integer',
        product_cost: 'numeric',
        product_sales: 'numeric',
        product_income: 'numeric',
    };
}

export default function TallyProductRequest(req, res, next) {
    new TallyProductRequestValidator(req.body).validate().then((response) => {
        next();
    }).catch((errors) => {
        res.status(403).send(errors);
    });
}