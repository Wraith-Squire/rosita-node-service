import Excel, { Workbook } from 'exceljs';
import TallyModel from "../models/tally.model";
import * as path from 'path';

export default class TallyService {
    list(payload: Record<string, any>) {
        var result = new TallyModel().select("*");

        if (payload.fromDate && payload.fromDate.length > 0) {
            result.where("date_tallied", ">=", payload.fromDate);
        }

        if (payload.toDate && payload.toDate.length > 0) {
            result.where("date_tallied", "<=", payload.toDate);
        }

        result.orderBy('date_tallied', 'desc');

        return result.paginate(payload.currentPage, payload.perPage);
    }

    details(id: number) {
        var result = new TallyModel().find(id).one(); 

        return result;
    }

    create(payload: Record<string, any>) {
        new TallyModel().insert(payload).then((response) => {
            return response;
        }).catch((errors) => {
            console.error(errors);
        }); 
    }

    update(id: number, payload: Record<string, any>) {
        new TallyModel().find(id).update(payload).then((response) => {
            return response;
        }).catch((errors) => {
            console.error(errors);
        }); 
    }

    delete(id: number) {
        new TallyModel().find(id).delete().then((response) => {
            return response;
        }).catch((errors) => {
            console.error(errors);
        }); 
    }

    getExportData(payload: Record<string, any>) {
        var result = new TallyModel().select("*");

        if (payload.fromDate && payload.fromDate.length > 0) {
            result.where("date_tallied", ">=", payload.fromDate);
        }

        if (payload.toDate && payload.toDate.length > 0) {
            result.where("date_tallied", "<=", payload.toDate);
        }

        result.orderBy('date_tallied', 'desc');

        return result.get();
    }

    async exportToExcel(payload: Record<string, any>) {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Tally List');

        const tallyColumns: Array<Partial<Excel.Column>>  = [
            {key: 'date_tallied', header: 'Date Tallied', width: 16, alignment: {vertical: 'middle', horizontal: 'center', wrapText: true}},
            {key: 'product_name', header: 'Product Name', width: 20, alignment: {vertical: 'middle', horizontal: 'center', wrapText: true}},
            {key: 'product_count', header: 'Made', width: 10, alignment: {vertical: 'middle', horizontal: 'center', wrapText: true}, },
            {key: 'product_sold', header: 'Sold', width: 10, alignment: {vertical: 'middle', horizontal: 'center', wrapText: true}},
            {key: 'product_sales', header: 'Sales', width: 10, alignment: {vertical: 'middle', horizontal: 'center', wrapText: true}}
        ];

        worksheet.columns = tallyColumns;

        var tallies = [] as Array<any>;
        await this.getExportData(payload).then((response: Array<any>) => {
            console.log(response);
            tallies = response;
        });

        var rowCount = 0;

        tallies = tallies.filter((tally) => tally.product && JSON.parse(tally.product).length > 0);

        tallies.forEach((tally, index) => {
            var tallyStartRowCount = 2;
            JSON.parse(tally.products).forEach((product, index) => {
                rowCount++;
                if (index == 0) {
                    tallyStartRowCount = rowCount;
                }

                worksheet.addRow({
                    date_tallied: tally.date_tallied as Date, 
                    product_name: product.product_name as string,
                    product_count: product.product_count as number,
                    product_sold: product.product_sold as number,
                    product_sales: product.product_sales as number
                });
            });
            rowCount++;

            worksheet.addRow({
                date_tallied: tally.date_tallied as Date,
                product_name: 'Total',
                product_count: tally.total_count as number,
                product_sold: tally.total_sold as number,
                product_sales: tally.total_sales as number
            });

            worksheet.getRow(rowCount+1).font = {size: 13, bold: true};
            worksheet.mergeCells(`A${tallyStartRowCount+1}`, `A${rowCount+1}`);
            worksheet.getCell(`A${tallyStartRowCount+1}`, `A${rowCount+1}`).alignment = {vertical: "middle", horizontal: "center"};
        });

        const alpha = Array.from(Array(26)).map((e, i) => i + 65);
        const alphabet = alpha.map((x) => String.fromCharCode(x));

        worksheet.columns.forEach((column, index) => {
            worksheet.getCell(`${alphabet[index]}1`).alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell(`${alphabet[index]}1`).font = {size: 13, bold: true};
        });

        return workbook;
    }
}