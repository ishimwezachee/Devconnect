const express = require("express");
const router = express.Router();

//GET api/uers 
// test route 
// public

router.get("/",(req,res)=> res.send("users route"));

module.exports = router;