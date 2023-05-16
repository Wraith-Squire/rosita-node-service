import Model from '../../@helpers/orm/model';

export default class TallyModel extends Model {
    protected table: string = 'tallies';
    protected primaryKey: string = 'tally_id';
    protected useTimestamp: boolean = true;

    protected fillables: string[] = [
        'date_tallied',
        'comment',
        'status',
        'products',
        'total_count',
        'total_sold',
        'total_unsold',
        'total_cost',
        'total_sales',
        'total_income',
    ];
}