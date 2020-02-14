const express = require("express");
const router = express.Router();

//GET api/profile
// test route 
// public

router.get("/",(req,res)=> res.send("post route"));

module.exports = router;