const pool = require("../config/db");
const { generateInvoice } = require("../services/invoiceGenerator");

const createBill = async (req, res) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const { customer_id, payment_method, items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No products selected"
            });
        }

      let subtotal = 0;
      let totalGST = 0;
      const billItems = [];

        // Validate Products & Calculate Total
        for (const item of items) {

            const productResult = await client.query(
                "SELECT * FROM products WHERE id = $1",
                [item.product_id]
            );

            if (productResult.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `Product ID ${item.product_id} not found`
                });
            }

 const product = productResult.rows[0];

if (product.quantity < item.quantity) {
    return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${product.name}`
    });
}

const price = Number(product.selling_price);
const gstPercent = Number(product.gst_percent);

const taxableAmount = price * item.quantity;
const gstAmount = taxableAmount * gstPercent / 100;

// Same-state billing (CGST + SGST)
const cgst = gstAmount / 2;
const sgst = gstAmount / 2;
const igst = 0;

subtotal += taxableAmount;
totalGST += gstAmount;

billItems.push({
    product_id: product.id,
    product_name: product.name,
    hsn_code: product.hsn_code,

    quantity: item.quantity,

    price,

    taxable_amount: taxableAmount,

    gst_percent: gstPercent,

    gst_amount: gstAmount,

    cgst,

    sgst,

    igst,

    total: taxableAmount + gstAmount
});
console.log("Bill Item:", billItems[billItems.length - 1]);
        }

        // Generate Bill Number
        const billNumber = `INV-${Date.now()}`;

       const discount = 0;

const grandTotal =
    subtotal +
    totalGST -
    discount;
        // Insert Bill
        console.log("About to insert bill...");
console.log("Running NEW insert query...");

const billResult = await client.query(
    `INSERT INTO bills (
        bill_number,
        store_id,
        customer_id,
        subtotal,
        cgst_amount,
        sgst_amount,
        igst_amount,
        discount,
        grand_total,
        payment_method,
        payment_status,
        created_by
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    RETURNING id`,
    [
        billNumber,
        req.user.store_id,
        customer_id,
        subtotal,
        totalGST / 2,
        totalGST / 2,
        0,
        discount,
        grandTotal,
        payment_method,
        "PAID",
        req.user.id
    ]
);
        const billId = billResult.rows[0].id;

        // Fetch Customer Details
        const customerResult = await client.query(
            `SELECT
                customer_name,
                phone,
                address
             FROM customers
             WHERE id = $1`,
            [customer_id]
        );

        const customer = customerResult.rows[0];

        // Fetch Store Details
        const storeResult = await client.query(
            `SELECT
                name,
                code,
                address,
                phone,
                email,
                gst_number,
                logo_path
             FROM stores
             WHERE id = $1`,
            [req.user.store_id]
        );

        const store = storeResult.rows[0];

        // Insert Bill Items & Reduce Stock
        for (const item of billItems) {

            await client.query(
                `INSERT INTO bill_items
(
    bill_id,
    product_id,
    quantity,
    price,
    taxable_amount,
    gst_percent,
    gst_amount,
    cgst_amount,
    sgst_amount,
    igst_amount,
    hsn_code,
    total,
    product_name
)
VALUES
($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
                [
    billId,
    item.product_id,
    item.quantity,
    item.price,
    item.taxable_amount,
    item.gst_percent,
    item.gst_amount,
    item.cgst,
    item.sgst,
    item.igst,
    item.hsn_code,
    item.total,
    item.product_name
]
            );

            // Reduce Stock
            await client.query(
                `UPDATE products
                 SET quantity = quantity - $1
                 WHERE id = $2`,
                [
                    item.quantity,
                    item.product_id
                ]
            );
        }

        await client.query("COMMIT");

        // Generate PDF Invoice
        const invoicePath = generateInvoice({
    // Store Details
    store_name: store.name,
    store_code: store.code,
    store_address: store.address,
    store_phone: store.phone,
    store_email: store.email,
    store_gst: store.gst_number,
    store_logo: store.logo_path,

    // Customer Details
    customer_name: customer.customer_name,
    customer_phone: customer.phone,
    customer_address: customer.address,

    // Bill Details
    bill_number: billNumber,
    payment_method,
    subtotal,
    gst_amount: totalGST,
    grand_total: grandTotal,

    // Products
    items: billItems
});

return res.status(201).json({
    success: true,
    message: "Bill created successfully",
    bill_id: billId,
    bill_number: billNumber,
    subtotal,
    gst_amount: totalGST,
    grand_total: grandTotal,

    invoice_url: `/invoices/${billNumber}.pdf`
});

    } catch (err) {

        await client.query("ROLLBACK");

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Bill creation failed",
            error: err.message
        });

    } finally {

        client.release();

    }

};
module.exports = {
    createBill,

};