const express = require("express");
const router = express.Router();
const gravatar = require("gravatar")
const bcrypt = require("bcryptjs")
const { check, validationResult } = require('express-validator');
const User = require("../../models/User");
//POST api/uers 
//  register user  
// public

router.post('/',[
    check('name',"Name is required").not().isEmpty(),
    check('email','please include a valid email').isEmail(),
    check('password',"please enter a password with 6 more characters ").isLength({min:6})
],
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const{name,email,password} = req.body;
 try {
    let user = await User.findOne({email});
    if(user){
        return res.status(400).json({errors:[{msg:"user already exists"}]});
    }

  const avatar = gravatar.url(email,{
      s:'200',
      r:"pg",
      d:"mm"
  })

  user = new User ({
      name,
      email,
      avatar,
      password
  });

    const salt = await bcrypt.genSalt(10);
  user.password = await  bcrypt.hash(password,salt);

  await user.save();

    // Return jsonweboken ;
   res.send("User registered");


 } catch (error) {
   console.error(error.message);  
   res.status(500).send('server error ')
 }

});

module.exports = router;