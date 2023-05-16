import { Rules } from "validatorjs";
import RequestValidator from "../../@helpers/request/request.validator";

class TallyProductRequestValidator extends RequestValidator {
    rules: Rules = {
        product_id: 'required|integer',
        count: 'required|integer',
        unsold: 'required|integer',
        sold: 'integer',
        cost: 'number',
        sales: 'number',
        income: 'number',
    };
}

export default function TallyProductRequest(req, res, next) {
    new TallyProductRequestValidator(req.body.data).validate().then((response) => {
        next();
    }).catch((errors) => {
        errors.code = 400;

        res.json(errors);
    });
}