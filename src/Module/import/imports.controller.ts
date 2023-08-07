import {
  Controller,
  Res,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImportService } from './imports.service';
import { FileInterceptor } from '@nestjs/platform-express';
const xlsx = require('xlsx');
import { ProductsService } from '../product/products.service';
import { ProductCategoriesService } from '../productCategory/productCategories.service';
import { ProductOptionsService } from '../product/productOptions.service';

@Controller('import')
export class ImportController {
  constructor(
    private readonly service: ImportService,
    private readonly productServices: ProductsService,
    private readonly productCategoryServices: ProductCategoriesService,
    private readonly productOptionServices: ProductOptionsService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('doc'))
  async create(@Res() res, @UploadedFile() file: Express.Multer.File) {
    const { buffer } = file;
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Assuming you want to convert the first sheet
    const optionSheetName = workbook.SheetNames[1]; // Assuming you want to convert the first sheet

    const worksheet = workbook.Sheets[sheetName];
    const worksheet2 = workbook.Sheets[optionSheetName];

    const jsonData = xlsx.utils.sheet_to_json(worksheet, {
      raw: true,
      cellText: false,
    });

    const jsonDataOpt = xlsx.utils.sheet_to_json(worksheet2, {
      raw: true,
      cellText: false,
    });

    // Handle Product
    const uniqueProducts = await this.service.getUniqueProduct(jsonData);

    const productArr = [];
    for (let index = 0; index < uniqueProducts.length; index++) {
      const e = uniqueProducts[index];
      const existingProduct = await this.productServices.getBySKu(
        e['SKU number'],
      );
      if (existingProduct === null) {
        const productCategory =
          await this.productCategoryServices.findAndCreate({
            name: e['Product Category'],
          });
        productArr.push({
          name: e['Name'],
          name_zh: e['Name Chinese'],
          category_id: productCategory.id,
          description: e['Description'],
          description_zh: e['Description Chinese'],
          terms: e['Term and Condition'],
          terms_zh: e['Term and Condition Chinese'],
          sku_no: e['SKU number'],
          stock_limit: e['Stock Limit Reminder'],
          hashtags: e['Hashtags'],
          refund_policy: e['Refund Policy'],
          refund_policy_zh: e['Refund Policy (Chinese)'],
          origins: e['Origin'] || null,
          origins_zh: e['Origin (Chinese)'] || null,
          status: e['Status'] === 'Active' ? 1 : 0,
          is_published: e['Publish'] === 'Publish' ? 1 : 0,
          order: parseInt(e['Order'] || 0),
        });
      } else {
        const productCategory =
          await this.productCategoryServices.findAndCreate({
            name: e['Product Category'],
          });
        await this.productServices.updateBySku({
          name: e['Name'] || null,
          name_zh: e['Name Chinese'] || null,
          category_id: productCategory.id,
          description: e['Description'] || null,
          description_zh: e['Description Chinese'] || null,
          terms: e['Term and Condition'] || null,
          terms_zh: e['Term and Condition Chinese'] || null,
          sku_no: e['SKU number'] || null,
          stock_limit: e['Stock Limit Reminder'] || 0,
          hashtags: e['Hashtags'] || null,
          refund_policy: e['Refund Policy'] || null,
          refund_policy_zh: e['Refund Policy (Chinese)'] || null,
          origins: e['Origin'] || null,
          origins_zh: e['Origin (Chinese)'] || null,
          status: e['Status'] === 'Active' ? 1 : 0,
          is_published: e['Publish'] === 'Publish' ? 1 : 0,
          order: parseInt(e['Order'] || 0),
        });
      }
    }
    await this.productServices.import(productArr);

    // Handle Product Option
    const optionProductArr = [];
    for (const e of jsonDataOpt) {
      const product = await this.productServices.findIdBySKU(e['SKU number']);

      if (product !== null) {
        // Check if product option is exists or not
        const optionName =
          typeof e['Option Name'] === 'undefined' ? ' ' : e['Option Name'];
        const option = await this.productOptionServices.findBySKUName({
          product_id: product.id,
          name: optionName,
        });
        // Insert if option name and id is not found
        if (option === null) {
          optionProductArr.push({
            product_id: product.id,
            name: optionName,
            description: e['Description'] || null,
            currency: 'HKD',
            list_price: e['List Price'] || 0,
            selling_price: e['Selling Price'] || 0,
            weight: e['Weight'] || 0,
            weight_unit: e['Weight Unit'] || 'KG',
            quantity: e['Quantity'] === 'Unlimited' ? -1 : e['Quantity'],
          });
        }
        // Update if option name and id is found
        else {
          const optionName =
            typeof e['Option Name'] === 'undefined' ? '-' : e['Option Name'];
          try {
            await this.productOptionServices.updateById(option.id, {
              name: optionName,
              description: e['Description'],
              currency: 'HKD',
              list_price: e['List Price'],
              selling_price: e['Selling Price'],
              weight: e['Weight'],
              weight_unit: e['Weight Unit'],
              quantity: e['Quantity'] === 'Unlimited' ? -1 : e['Quantity'],
            });
          } catch (error) {
            console.error('Error Update Option by Id', error);
          }
        }
      }
    }
    await this.productOptionServices.import(optionProductArr);
    res.json(productArr);
  }
}
