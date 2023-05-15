import TallyModel from "../models/tally.model";

export default class TallyService {
    list() {
        var result = new TallyModel().select("*").get(); 

        return result;
    }

    details(id: number) {
        var result = new TallyModel().find(id).one(); 

        return result;
    }
}