import Model from "../../@helpers/orm/model";

export default class TallyModel extends Model {
    protected table: string = 'tally';
    protected primaryKey: string = 'tally_id';
}