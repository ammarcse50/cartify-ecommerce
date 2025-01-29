
import puppeteer, { Page } from 'puppeteer';


export async function generateInvoicePdf(invoiceHtml, pdfPath) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage()


    await page.setContent(invoiceHtml);


    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true
    })
    await browser.close();
}


