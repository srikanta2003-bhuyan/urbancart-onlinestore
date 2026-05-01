const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const connectDB = require("./db");
connectDB();

const app = express();

// ✅ PORT FIX (IMPORTANT FOR RENDER)
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ SERVE FRONTEND (FIXED)
// If your HTML files are inside "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Connect MongoDB
// ❗ LOCAL WILL NOT WORK ON RENDER → use MONGO_URI
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/urbancart")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ======================
// MODELS
// ======================

// Product Model
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    description: String
});
const Product = mongoose.model("Product", productSchema);

// User Model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const User = mongoose.model("User", userSchema);

// ✅ ORDER MODEL (ADDED)
const orderSchema = new mongoose.Schema({
    user: {
        name: String,
        email: String
    },
    product: {
        name: String,
        price: Number,
        quantity: Number
    },
    address: String,
    city: String,
    pincode: String,
    payment: String,
    status: {
        type: String,
        default: "Processing"
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const Order = mongoose.model("Order", orderSchema);

// ======================
// ROUTES
// ======================

// Home route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ======================
// PRODUCT ROUTES
// ======================

// GET all products
app.get("/api/products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// ADD product
app.post("/api/products", async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
});

// DELETE product
app.delete("/api/products/:id", async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json("Product Deleted");
});

// ======================
// AUTH ROUTES
// ======================

// REGISTER
app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ message: "User already exists" });
        }

        const user = new User({ name, email, password });
        await user.save();

        res.json({ message: "User Registered Successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

// LOGIN
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, password });

        if (!user) {
            return res.json({ message: "Invalid Credentials" });
        }

        res.json({ message: "Login Successful", user });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

// ======================
// ORDER ROUTES
// ======================

// PLACE ORDER
app.post("/api/orders", async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();

        res.json({ message: "Order placed successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

// GET ALL ORDERS
app.get("/api/orders", async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ======================
// START SERVER
// ======================

// ❗ IMPORTANT CHANGE FOR RENDER
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});