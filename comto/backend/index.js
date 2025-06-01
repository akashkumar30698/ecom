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

/////////////////////////////////////////////////////////////////////////////////



// GET /api/products
app.get("/api/products/filtered", async (req, res) => {
  try {
    let {
      category,
      minPrice,
      maxPrice,
      sizes,
      colors,
      sortBy,
    } = req.query;

    const pipeline = [];

    // 🧮 Add finalPrice field
    pipeline.push({
      $addFields: {
        finalPrice: {
          $cond: [
            { $gt: ["$discount", 0] },
            {
              $multiply: [
                "$price",
                { $subtract: [1, { $divide: ["$discount", 100] }] },
              ],
            },
            "$price",
          ],
        },
      },
    });

    const matchStage = {};

    // 📂 Category filter
    if (category) {
      matchStage.category = category;
    }

    // 💸 Price filter
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      matchStage.finalPrice = {};
      if (!isNaN(minPrice)) {
        matchStage.finalPrice.$gte = Number(minPrice);
      }
      if (!isNaN(maxPrice)) {
        matchStage.finalPrice.$lte = Number(maxPrice);
      }
    }

    // 📏 Sizes
    if (sizes) {
      const sizeArray = Array.isArray(sizes) ? sizes : sizes.split(",");
      matchStage.sizes = { $in: sizeArray.map(s => s.trim()) };
    }

    // 🎨 Colors
    if (colors) {
      const colorArray = Array.isArray(colors) ? colors : colors.split(",");
      matchStage.colors = { $in: colorArray.map(c => c.trim()) };
    }

    pipeline.push({ $match: matchStage });

    // 📊 Sorting
    const sortStage = {};
    switch (sortBy) {
      case "price-low-to-high":
        sortStage.finalPrice = 1;
        break;
      case "price-high-to-low":
        sortStage.finalPrice = -1;
        break;
      case "newest":
        sortStage.createdAt = -1;
        break;
      default:
        // no sorting
        break;
    }

    if (Object.keys(sortStage).length > 0) {
      pipeline.push({ $sort: sortStage });
    }

    // ✅ Final aggregation
    const products = await Product.aggregate(pipeline);
    res.status(200).json(products);

  } catch (error) {
    console.error("Error fetching products:", error);

    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: "Invalid query parameters" });
    }

    res.status(500).json({ message: "Something went wrong on the server" });
  }
});









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
