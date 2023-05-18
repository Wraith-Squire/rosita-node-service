import ProductModel from "../models/product.model";

export default class ProductService {
    list(payload: Record<string, any>) {
        var result = new ProductModel().select("*").paginate(payload.currentPage, payload.perPage); 

        return result;
    }

    details(id: number) {
        var result = new ProductModel().find(id).one(); 

        return result;
    }

    create(data: Record<string, any>) {
        new ProductModel().insert(data).then((response) => {
            return response;
        }).catch((errors) => {
            console.error(errors);
        });
    }

    update(id: number, data: Record<string, any>) {
        new ProductModel().find(id).update(data).then((response) => {
            return response;
        }).catch((errors) => {
            console.log(errors);
        });
    }

    delete(id: number) {
        new ProductModel().find(id).delete().then((response) => {
            return response;
        }).catch((errors) => {
            console.log(errors);
        });
    }
}