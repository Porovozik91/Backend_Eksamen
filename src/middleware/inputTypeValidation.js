import validationRules from "../utils/validationRules.js";
import { responseLog } from "../utils/allLogManager.js";

/* 
Validerer inputdata før viderebehandling.
*/

const validateRequest = (validationType) => {
  return (req, res, next) => {
    const rules = validationRules[validationType];
    if (!rules) {
      return responseLog(res, 400, { message: "Invalid validation rules" });  
    }

    const { error } = rules.validate(req.body);
    if (error) {
      return responseLog(res, 400, { message: error.details[0].message });  
    }
    
    next();
  };
};

export default validateRequest;
