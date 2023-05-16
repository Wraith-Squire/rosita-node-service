import TallyModel from "../models/tally.model";
import TallyRequest from "../requests/tally.request";

export default class TallyService {
    list() {
        var result = new TallyModel().select("*").get(); 

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