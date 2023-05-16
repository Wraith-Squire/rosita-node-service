import Model from '../../@helpers/orm/model';

export default class ProductModel extends Model {
    protected table: string = 'products';
    protected primaryKey: string = 'product_id';
    protected useTimestamp: boolean = true;

    protected fillables: string[] = [
        'product_name',
        'product_price',
        'product_components',
        'product_cost'
    ];
}