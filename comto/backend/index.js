require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { router: home } = require("./routes/AdminLoginRoute")
const { router: product } = require("./routes/ProductRoute")
const { router: productRoutes } = require("./routes/extra");
const { router: paymentRoutes } = require("./routes/paymentRoutes")
const { connectToDB } = require("./connectToDB");
const Product = require("./model/ProductModel")




const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

// CORS configuration
const allowedOrigins = [
  process.env.REACT_API_URL, // e.g., "http://localhost:5173"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
};

// Middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Optional header middleware
app.use((req, res, next) => {
  // res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

// Route to check cookies
app.get("/check-cookie", (req, res) => {
  const accessToken = req.cookies["accessToken"];
  const refreshToken = req.cookies["refreshToken"];

  if (accessToken || refreshToken) {
    res.json({
      exists: true,
      message: "Cookie exists!",
      value: {
        accessToken: accessToken || null,
        refreshToken: refreshToken || null,
      },
    });
  } else {
    res.json({
      exists: false,
      message: "No accessToken or refreshToken cookie found!",
    });
  }
});

// Connect to MongoDB
connectToDB(process.env.MONGODB_URL_APP)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Routes
app.use("/", home);

//Product
app.use("/",product)

app.use("/api/products", productRoutes);

app.use("/api/payment", paymentRoutes);



//extras

app.get("/products/:id", async (req, res) => {
    try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Invalid product ID" });
  }

});

app.get("/products/category/:category", async (req, res) => {
    try {
    const { category } = req.params;
    let products;

    if (category) {
      products = await Product.find({ category });
    } else {
      products = await Product.find({});
    }

    res.json(products);
  } catch (err) {
    
    console.log("err yrr: ",err)
    res.status(500).json({ error: "Server error" });
  }

});


app.get("/categories/getAllCategories", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// Start server
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
