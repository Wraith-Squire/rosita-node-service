import TallyModel from "../models/tally.model";

export default class TallyService {
    list(payload: Record<string, any>) {
        var result = new TallyModel().select("*");
        console.log(payload);

        if (payload.fromDate && payload.fromDate.length > 0) {
            result.where("date_tallied", ">=", payload.fromDate);
        }

        if (payload.toDate && payload.toDate.length > 0) {
            result.where("date_tallied", "<=", payload.toDate);
        }

        return result.paginate(payload.currentPage, payload.perPage);
    }

    details(id: number) {
        var result = new TallyModel().find(id).one(); 

        return result;
    }

    create(data: Record<string, any>) {
        new TallyModel().insert(data).then((response) => {
            return response;
        }).catch((errors) => {
            console.error(errors);
        }); 
    }

    update(id: number, data: Record<string, any>) {
        new TallyModel().find(id).update(data).then((response) => {
            return response;
        }).catch((errors) => {
            console.log(errors);
        }); 
    }

    delete(id: number) {
        new TallyModel().find(id).delete().then((response) => {
            return response;
        }).catch((errors) => {
            console.log(errors);
        }); 
    }
}