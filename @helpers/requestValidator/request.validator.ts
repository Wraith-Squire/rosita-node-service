import Validator from "validatorjs";

export default class RequestValidator {
    data: Record<string, any>;
    rules: Validator.Rules;

    constructor(data: Record<string, any>) {
        this.data = data;

        this.validate();
    }

    validate(): Promise<Record<string, any>> {
        var validator = new Validator(this.data, this.rules);

        return new Promise((resolve, reject) => {
            if (validator.fails()) {
                reject(validator.errors);
            }
    
            if (validator.passes()) {
                resolve(this.data);
            }
        })
    }
}