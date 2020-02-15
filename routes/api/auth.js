const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require('config');
const { check, validationResult } = require('express-validator');

//GET api/auth
// test route 
// public

router.get("/",auth,async(req,res)=> {
    console.log(req.tokenData.user.id)
    try {
        const user = await User.findById(req.tokenData.user.id).select("-password");
        // user found by  using authenticated Id;
        res.json(user);
    } catch (err) {
        res.status(500).send("Server error ")
    }
});

// @route POST api/auth 
// @desc  Authenticate user & get token 
// @ access public 

//LOGIN
router.post('/',[
    check('email','please include a valid email').isEmail(),
    check('password',"password is required").exists()
],
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res
        .status(400)
        .json({errors:errors.array()})
    }
// extract user email and password;
    const{email,password} = req.body;
 try {
     // request user from the datatbase
    let user = await User.findOne({email});
    if(!user){
        return res
        .status(400)
        .json({errors:[{msg:"Invalid Credentials"}]});
    }

  const isMatch = await bcrypt.compare(password,user.password);
  if(!isMatch){
    return res
    .status(400)
    .json({errors:[{msg:"Invalid Credentials"}]});
  }

   const payload = { 
       user:{
           id:user.id
       }
   }
   jwt.sign(
    payload,
    config.get("jwtSecret"),
    {expiresIn:360000},
   (err,token)=>{
       if(err) throw err;
       res.json({token});
   }
);

 } catch (error) {
   console.error(error.message);  
   res.status(500).send('server error ')
 }

});
module.exports = router;