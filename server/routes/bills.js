const express = require("express");
const router = express.Router();
const Bill = require("../models/Bill");

/**
 * @route GET /bills
 * @group Bills
 * @returns {Array.<Bill>} 200 - An array of bills
 * @returns {object} 500 - Error
 */
router.get("/", async (req, res) => {
  await Bill.find({}, (err, bills) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send(JSON.stringify(bills));
    }
  });
});

/**
 * @route GET /bills/billId
 * @group Bills
 * @returns {Bill.model} 200 - A bill
 * @returns {object} 500 - Error
 */
router.get("/:billId/", async (req, res) => {
  await User.findById(req.params.billId, (err, bill) => {
    if (err) {
      res.send();
    } else {
      return JSON.stringify(bill);
    }
  });
});

module.exports = router;
