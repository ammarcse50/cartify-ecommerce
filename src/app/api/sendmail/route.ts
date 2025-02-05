import nodemailer from 'nodemailer';
import { NextRequest } from 'next/server';
import { generateInvoicePdf } from '@/app/lib/generateInvoicePdf';

export async function POST(req: NextRequest) {
    const { name, email, total, products } = await req.json();
    // const data = await req.json()
    // console.log("from req", data);

    // Validate that required fields are provided
    if (!email || !name || !total || !products) {
        return new Response(JSON.stringify({ error: 'Missing required information.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Generate the invoice HTML
    const invoiceHtml = `
      <div>
        <h2>Invoice for ${name}</h2>
        <p><strong>Total:</strong> ${total}</p>
        <h3>Products:</h3>
        <ul>
          ${products
            .map(
                (product) =>
                    `<li>${product.productName} (Qty: ${product.quantity}, Price: ${product.price})</li>`
            )
            .join('')}
        </ul>
        <h3>Total Price: ${total}</h3>
      </div>
    `;

    // Path where the PDF will be saved
    const pdfPath = './invoice.pdf';

    // Generate the PDF
    try {
        await generateInvoicePdf(invoiceHtml, pdfPath);
        console.log('PDF generated successfully!');
    } catch (error: Error) {
        console.error('Error generating PDF:', error.message);
        return new Response(
            JSON.stringify({ error: 'Failed to generate PDF' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
    // Check if the email is missing or invalid before sending
    if (!email || !email.trim()) {
        return new Response(
            JSON.stringify({ error: 'Invalid recipient email address.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ammaraslam7164@gmail.com",  // Replace with your email
            pass: "pyshxdpnnyaotsqv",  // Replace with your app password
        },
    });

    // Set up mail options with HTML content and PDF attachment

    console.log("email checking :", email);
    const mailOptions = {
        from: "ammaraslam7164@gmail.com",  // Sender's email
        to: email,  // Recipient's email
        subject: `Invoice for ${name}`,
        html: invoiceHtml,  // The generated invoice HTML
        attachments: [
            {
                filename: 'invoice.pdf',
                path: pdfPath,
            },
        ],
    };



    // Attempt to send the email
    try {
        await transporter.sendMail(mailOptions)
        return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to send email' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
