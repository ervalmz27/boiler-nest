import { Controller, Get, Res } from '@nestjs/common';
import * as excel from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';
@Controller('template')
export class TemplateController {
    @Get('sample-import')
    async downloadExcel(@Res() res): Promise<void> {
        const filePath = path.join(__dirname, '..', '..', '..', 'src', 'Public', 'sample-import.xlsx');
        try {
            if (fs.existsSync(filePath)) {
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename=template-example.xlsx');
                const fileStream = fs.createReadStream(filePath);
                fileStream.pipe(res);
            } else {
                res.status(404).send('File not found');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
}

