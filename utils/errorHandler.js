
const AppError = function(type, detail) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
    this.detail = detail;
  };
  
  AppError.prototype = Object.create(Error.prototype);
  AppError.prototype.constructor = AppError; 
  
  const errorHandlers = {
    handleError(err, res) {
      res.status(err?.type || 500 ).json({status: "fail", data: err.detail })
    },
    handleDbCastError(err, res){
      console.log(err.reason.BSONError)
      res.status(400).json({ status: "fail", error: { status: "fail", data:{error: `Invalid ${err.path} value. Check the parameter/query.`}} })
    },
    handleDbValidationError(err, res) {
      const propertyNames = Object.keys(err.errors);
      const firstPropertyName = propertyNames[0];
      const firstPropertyValue = err.errors[firstPropertyName];
      res.status(400).json({ status: "fail", data: {error: `Invalid ${firstPropertyValue.path} value. Check the parameter/query.`}})
    }
  }
  
  export { errorHandlers , AppError };
  