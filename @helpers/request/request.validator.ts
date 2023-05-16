import Validator from "validatorjs";

export default class RequestValidator {
    data: Record<string, any>;
    rules: Validator.Rules;

    constructor(data: Record<string, any>) {
        this.data = data;

        this.validate();
    }

    validate(): Promise<Record<string, any>> {
        var snakeCasedDate = this.keysToSnake(this.data);
        var validator = new Validator(snakeCasedDate, this.rules);

        return new Promise((resolve, reject) => {
            if (validator.fails()) {
                reject(validator.errors);
            }
    
            if (validator.passes()) {
                resolve(this.data);
            }
        })
    }

    private keysToSnake(data: Record<string, any>) {
        var returnValue = {};

        Object.entries(data).forEach((value) => {
            returnValue[this.camelToSnake(value[0])] = value[1];
        });

        return returnValue;
    }

    private camelToSnake(string = '') {
        return (string || '')
          .replace(/([A-Z])/g, (match, group) => `_${group.toLowerCase()}`)
          .replace(/^_/, '');
    }
}