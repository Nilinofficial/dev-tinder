var validator = require("validator");

const validateSignUp = (req) => {
  const { firstName, lastName, email, skills } = req.body;

  if (!firstName) {
    throw new Error("First Name is required");
  }
  if (!lastName) {
    throw new Error("Last Name is required");
  }
  if (firstName.length < 3 || firstName.length > 20) {
    throw new Error("Enter a valid first name");
  }
  if (lastName.length < 3 || lastName.length > 20) {
    throw new Error(" Enter a valid first name");
  }

  const isValidEmail = validator.isEmail(email);

  if (!isValidEmail) {
    throw new Error(" email not valid");
  }

  if (skills.length > 10) {
    throw new Error("skills cannot be more than 10");
  }
};

module.exports = { validateSignUp };
