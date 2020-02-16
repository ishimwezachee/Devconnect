const express = require("express");
const router = express.Router();
const auth  = require("../../middleware/auth")
const {check,validationResult } = require("express-validator");
const Profile = require('../../models/Profile');
const User = require('../../models/User');
//GET api/profile/me 
// Get current users profile
// private

// GET PROFILE
router.get('/me',auth,async(req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.tokenData.user.id}).populate('user',['name','avatar']);
        if(!profile){
            return res.status(400).json({msg:'There is no profile for this user '});
        }
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

//POST api/profile
// Get crate or update a user profile 
// private

router.post('/',[auth,[
  check("status","status is required").not().isEmpty(),
  check("skills","skills is required").not().isEmpty()
]
],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {
        company,
        location,
        website,
        bio,
        skills,
        status,
        githubusername,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook
      } = req.body;

      //Build profile object 
      const profileFields = {};
      profileFields.user = req.tokenData.user.id;
      if(company) profileFields.company = company;
      if(website) profileFields.website = website;
      if(location) profileFields.location = location
      if(bio) profileFields.bio = bio;
      if(status) profileFields.status = status;
      if(githubusername) profileFields.githubusername = githubusername;
      if(skills){
          profileFields.skills = skills.split(",").map(skill=>skill.trim());
      }

     // Build social object 
     profileFields.social = {};
   if(youtube) profileFields.social.youtube= youtube;
   if(twitter) profileFields.social.twitter = twitter;
   if(facebook) profileFields.social.facebook = facebook;
   if(linkedin) profileFields.social.linkedin= linkedin;
   if(instagram) profileFields.social.instagram = instagram;
// so here we can update and post the data ;
 try {
     let profile = await Profile.findOne({user:req.tokenData.user.id});
     if(profile){
         //update
         profile = await Profile.findOneAndUpdate(
             {user:req.tokenData.user.id},// filter;
             {$set:profileFields},// update
             {new:true}// new  
             );
             return res.json(profile);
     }
     // if not found , let create;
     profile = new Profile(profileFields);
     await profile.save();
     res.json(profile);
 } catch (error) {
    console.error(error.message);
    res.status(500).send("server error") 
 }

});

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/',async(req,res)=>{
    try {
        const profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})
// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get('/user/:user_id',async(req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
        if(!profile) return res.status(400).json({msg:"profile not found"})
        res.json(profile)
    } catch (error) {
        console.error(error.message);
       
        if(error.kind == 'ObjectId'){
            return res.status(400).json({msg:'Profile not found'})
        }
        res.status(500).send('Server Error');
    }
})
module.exports = router;