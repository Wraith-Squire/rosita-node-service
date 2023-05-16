import { Rules } from "validatorjs";
import RequestValidator from "../../@helpers/requestValidator/request.validator";

class TallyRequestValidator extends RequestValidator {
    rules: Rules = {
        "date_tallied": 'integer'
    };
}

export default function TallyRequest(req, res, next) {
    new TallyRequestValidator(req.body.data).validate().then((response) => {
        next();
    }).catch((errors) => {
        errors.code = 400;

        res.json(errors);
    });
}