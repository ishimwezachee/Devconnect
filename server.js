const express = require("express");
const connectDB = require("./config/db");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/post");
const auth = require("./routes/api/users");
const app = express();
// connect Database;
connectDB();

app.get('/',(req,res)=> res.send("Api Running "));
// Define ROUTES 

app.use("/api/users",users);
app.use("/api/auth",auth);
app.use("/api/profile",profile);
app.use("/api/posts",posts);
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=> console.log(`Server started on port ${PORT}`));