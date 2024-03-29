import { Rules } from "validatorjs";
import RequestValidator from "../../@helpers/request/request.validator";

class TallyRequestValidator extends RequestValidator {
    rules: Rules = {
        date_tallied: 'required|date',
        comment: 'string',
        status: 'in:draft,completed',
        products: 'array',
        total_count: 'integer',
        total_sold: 'integer',
        total_unsold: 'intger',
        total_cost: 'numeric',
        total_sales: 'numeric',
        total_income: 'numeric'
    };
}

export default function TallyRequest(req, res, next) {
    new TallyRequestValidator(req.body).validate().then((response) => {
        next();
    }).catch((errors) => {
        res.status(403).send(errors);
    });
}