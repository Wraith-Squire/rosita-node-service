import TallyModel from "../models/tally.model";

export default class TallyController {
    list() {
        try {
            var tallies = new TallyModel().select("tally_id").fetch();

            return tallies;
        } catch (error) {
            console.log(error);
        }
    }
}