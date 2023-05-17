import TallyModel from "../models/tally.model";

export default class TallyService {
    list(payload: Record<string, any>) {
        var result = new TallyModel().select("*").paginate(payload.currentPage, payload.perPage); 

        return result;
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