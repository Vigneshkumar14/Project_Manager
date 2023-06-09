class CustomError extends Error {
  constructor(message, code) {
    super(message);
    console.log("Cutomerr", message);
    this.code = code || 500;
  }
}

export default CustomError;
