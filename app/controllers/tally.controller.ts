import TallyModel from "../models/tally.model";

export default class TallyController {
    list() {
        var result = new TallyModel().select("*").fetch();

        return result;
    }
}