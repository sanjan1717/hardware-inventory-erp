const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = (billData) => {

    const invoicesDir = path.join(__dirname, "../../invoices");

    if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const invoicePath = path.join(
        invoicesDir,
        `${billData.bill_number}.pdf`
    );

    const doc = new PDFDocument({
    margin: 40,
    size: "A4"
});

doc.pipe(fs.createWriteStream(invoicePath));

// Outer Border
doc.rect(20, 20, 555, 802).stroke();

// Header Background
doc.rect(20, 20, 555, 90)
   .fill("#1565C0");

doc.fillColor("white");
    // Outer Border


    // ==========================================
    // Store Logo (Optional)
    // ==========================================

    if (billData.store_logo) {

        const logoPath = path.join(
            __dirname,
            "../../logos",
            billData.store_logo
        );

        if (fs.existsSync(logoPath)) {
            doc.image(
                logoPath,
                40,
                25,
                {
                    width: 60
                }
            );
        }
    }

    // ==========================================
    // Store Details
    // ==========================================

    doc
        .fontSize(22)
        .fillColor("white")
        .text(
            billData.store_name || "Hardware Inventory Store",
            {
                align: "center"
            }
        );

    doc
        .fontSize(10)
        .text(
            billData.store_address || "",
            {
                align: "center"
            }
        );

    doc.text(
        `Phone : ${billData.store_phone || "-"}`,
        {
            align: "center"
        }
    );

    doc.text(
        `Email : ${billData.store_email || "-"}`,
        {
            align: "center"
        }
    );

    doc.text(
        `GSTIN : ${billData.store_gst || "-"}`,
        {
            align: "center"
        }
    );
    doc.fillColor("black");

    doc.moveDown();

    doc
        .fontSize(18)
        .text(
            "GST TAX INVOICE",
            {
                align: "center",
                underline: true
            }
        );

    doc.moveDown();

    // ==========================================
    // Invoice Details
    // ==========================================

  // ==========================================
// Invoice Details Box
// ==========================================

doc.moveDown();

const invoiceBoxY = doc.y;

doc.roundedRect(40, invoiceBoxY, 510, 70, 5).stroke();

doc.fontSize(12);
doc.font("Helvetica-Bold");

doc.text(
    `Invoice No : ${billData.bill_number}`,
    55,
    invoiceBoxY + 12
);

doc.text(
    `Date : ${new Date().toLocaleDateString()}`,
    320,
    invoiceBoxY + 12
);

doc.font("Helvetica");

doc.text(
    `Store Code : ${billData.store_code}`,
    55,
    invoiceBoxY + 35
);

doc.text(
    `Payment : ${billData.payment_method}`,
    320,
    invoiceBoxY + 35
);

doc.y = invoiceBoxY + 85;

    // ==========================================
    // Customer Details
    // ==========================================

    // ==========================================
// Customer Details Box
// ==========================================

const customerBoxY = doc.y;

doc.roundedRect(
    40,
    customerBoxY,
    510,
    90,
    5
).stroke();

doc.fontSize(13);
doc.font("Helvetica-Bold");

doc.text(
    "CUSTOMER DETAILS",
    50,
    customerBoxY + 10
);

doc.moveTo(
    50,
    customerBoxY + 30
)
.lineTo(
    540,
    customerBoxY + 30
)
.stroke();

doc.font("Helvetica");
doc.fontSize(11);

doc.text(
    `Name : ${billData.customer_name}`,
    60,
    customerBoxY + 40
);

doc.text(
    `Phone : ${billData.customer_phone}`,
    60,
    customerBoxY + 58
);

doc.text(
    `Address : ${billData.customer_address}`,
    60,
    customerBoxY + 76
);

doc.y = customerBoxY + 105;

    // ==========================================
    // Product Table Header
    // ==========================================

    doc.fontSize(13).text("Items Purchased");

    doc.moveDown();

    doc.fontSize(11);

  const tableTop = doc.y;

// Header Box
doc.rect(40, tableTop - 5, 510, 30).stroke();

doc.font("Helvetica-Bold");
doc.fontSize(11);

doc.text("Sl", 45, tableTop + 5);
doc.text("Product", 80, tableTop + 5);
doc.text("HSN", 230, tableTop + 5);
doc.text("Qty", 310, tableTop + 5);
doc.text("Rate", 360, tableTop + 5);
doc.text("GST%", 430, tableTop + 5);
doc.text("Total", 490, tableTop + 5);

doc.y = tableTop + 30;;

    

    doc.moveDown();

    // ==========================================
    // Product List
    // ==========================================

   // =========================
// Products
// =========================

let y = doc.y;

billData.items.forEach((item, index) => {

    // Row Border
    doc.rect(40, y, 510, 35).stroke();

    doc.font("Helvetica");
    doc.fontSize(10);

    doc.text(index + 1, 45, y + 10);

    doc.text(
        item.product_name,
        80,
        y + 10,
        {
            width: 140
        }
    );

    doc.text(
        item.hsn_code || "-",
        230,
        y + 10
    );

    doc.text(
        String(item.quantity),
        310,
        y + 10
    );

    doc.text(
        `₹${item.price}`,
        360,
        y + 10
    );

    doc.text(
        `${item.gst_percent}%`,
        430,
        y + 10
    );

    doc.text(
        `₹${item.total.toFixed(2)}`,
        490,
        y + 10
    );

    y += 35;

});

doc.y = y + 10;

doc.y = y;

doc.moveDown();

doc.moveTo(40, doc.y)
    .lineTo(550, doc.y)
    .stroke();

doc.moveDown();
    // ==========================================
    // Totals
    // ==========================================

    // ==========================================
// Totals
// ==========================================
// ==========================================
// Amount in Words & Totals
// ==========================================

const totalBoxY = doc.y + 20;

// Amount in Words
doc.font("Helvetica-Bold");
doc.fontSize(11);

doc.text("Amount in Words", 40, totalBoxY);

doc.font("Helvetica");
doc.text(
    "Thirteen Thousand Six Hundred Fifty Eight Rupees Only",
    40,
    totalBoxY + 20,
    {
        width: 250
    }
);

// Totals Box
doc.roundedRect(
    320,
    totalBoxY,
    200,
    120,
    5
).stroke();

doc.font("Helvetica-Bold");
doc.fontSize(11);

doc.text(
    "Subtotal",
    365,
    totalBoxY + 15
);

doc.text(
    `₹${billData.subtotal.toFixed(2)}`,
    470,
    totalBoxY + 15,
    {
        width: 70,
        align: "right"
    }
);

doc.text(
    "CGST",
    365,
    totalBoxY + 40
);

doc.text(
    `₹${(billData.gst_amount / 2).toFixed(2)}`,
    470,
    totalBoxY + 40,
    {
        width: 70,
        align: "right"
    }
);

doc.text(
    "SGST",
    365,
    totalBoxY + 65
);

doc.text(
    `₹${(billData.gst_amount / 2).toFixed(2)}`,
    470,
    totalBoxY + 65,
    {
        width: 70,
        align: "right"
    }
);

doc.moveTo(
    360,
    totalBoxY + 90
)
.lineTo(
    540,
    totalBoxY + 90
)
.stroke();

doc.fontSize(13);

doc.text(
    "Grand Total",
    365,
    totalBoxY + 100
);

doc.text(
    `₹${billData.grand_total.toFixed(2)}`,
    470,
    totalBoxY + 100,
    {
        width: 70,
        align: "right"
    }
);

doc.y = totalBoxY + 140;

doc.fontSize(9);

doc.text(
    "This is a computer generated GST invoice.",
    {
        align: "center"
    }
);

    doc
        .fontSize(10)
        .text(
            "This is a computer generated invoice.",
            {
                align: "center"
            }
        );

    doc.end();

    return invoicePath;

};

module.exports = {
    generateInvoice
};