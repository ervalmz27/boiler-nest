import { Controller, Get, Res } from '@nestjs/common';
import * as excel from 'exceljs';
@Controller('template')
export class TemplateController {
    @Get('sample-import')
    async downloadExcel(@Res() res) {
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');
        worksheet.addRow(['Name', 'Category', 'Description', 'Term and Condition', 'Origins', 'SKU Number', 'Refund Policy', 'Link', 'Product ID']);
        worksheet.addRow(['J5create【JVCU100】360°旋轉 USB 視像鏡頭', 'J5create', '使用 360 全方位網路攝影機增強您的視訊會議', '保養原裝行貨2年代理保養', '中國', '1', 'NA', 'https://techguyhk.com/shop/j5create%e3%80%90jvcu360%e3%80%91360-%e5%85%a8%e6%96%b9%e4%bd%8d-%e8%a6%96%e5%83%8f%e9%8f%a1%e9%a0%ad/', '1']);
        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=example.xlsx');
        res.setHeader('Content-Length', buffer.byteLength);

        res.end(buffer);
    }
}

