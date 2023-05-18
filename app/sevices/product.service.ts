import ProductModel from "../models/product.model";

export default class ProductService {
    list(payload: Record<string, any>) {
        var result = new ProductModel().select("*"); 

        return result.paginate(payload.currentPage, payload.perPage);
    }

    details(id: number) {
        var result = new ProductModel().find(id).one(); 

        return result;
    }

    create(payload: Record<string, any>) {
        new ProductModel().insert(payload).then((response) => {
            return response;
        }).catch((errors) => {
            console.error(errors);
        });
    }

    update(id: number, payload: Record<string, any>) {
        new ProductModel().find(id).update(payload).then((response) => {
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