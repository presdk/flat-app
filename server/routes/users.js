const express = require("express");
const router = express.Router();

/**
 * This function comment is parsed by doctrine
 * @route GET /users
 * @group Users
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get("/", function (req, res) {
  res.send("Users home page");
});

module.exports = router;
