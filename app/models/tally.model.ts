import Model from "../../@helpers/orm/model";

export default class TallyModel extends Model {
    protected table: string = 'tallies';
    protected primaryKey: string = 'tally_id';
}