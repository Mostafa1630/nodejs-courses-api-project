const {body} = require('express-validator');
const validation = () => {
  return [
      body('title').notEmpty().withMessage("Title Is Required").isLength({min:5}).withMessage("Title At Least Five Charchar"),
      body('price').notEmpty().withMessage("Price Is Required")
    
  ]
};

module.exports = {
  validation
}