const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const razorpay = new Razorpay({
  key_id: "replace_with_your_key_id",
  key_secret: "replace_with_your_key_secret",
});


// Create Order API
app.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: 100, // ₹500 (in paise)
      currency: "INR",
      receipt: "receipt_order_1",
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Verify Payment
app.post("/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", razorpay.key_secret)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.json({ success: true, message: "Payment Verified" });
  } else {
    res.json({ success: false, message: "Invalid Signature" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
