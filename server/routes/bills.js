const express = require("express");
const router = express.Router();
const { Bill } = require("../models/Bill");
const { User } = require("../models/User");
const { BillPayment } = require("../models/BillPayment");

/**
 * @route GET /bills
 * @group Bills
 * @returns {Array.<Bill>} 200 - An array of bills
 * @returns {object} 500 - Error
 */
router.get("/", async (req, res, next) => {
  try {
    const bills = await Bill.find().exec();
    res.send(bills);
  } catch (err) {
    next(err);
  }
});

/**
 * @route GET /bills/billId
 * @group Bills
 * @returns {Bill.model} 200 - A bill
 * @returns {object} 500 - Error
 */
router.get("/:billId/", async (req, res, next) => {
  try {
    const bill = await Bill.findById(req.params.billId).exec();
    res.send(bill);
  } catch (err) {
    next(err);
  }
});

/**
 * @route POST /bills/add
 * @group Bills
 * @param {string} date.required - The date of the issued bill in the format `dd-mm-yy`
 * @param {string} type.required - The type of the bill: `water` or `power` or `gas` or `internet` or `misc`
 * @param {Number} total_amount.required - The total dollar amount of the bill
 * @param {Number} fixed_amount - The fixed dollar amount of the bill that is always split between each member regardless of stay duration.
 * @param {string} reference_name - The  reference name to use for the payment of this bill
 * @returns {Bill.model} 200 - A bill
 * @returns {object} 500 - Error
 */
router.post("/add", async (req, res, next) => {
  try {

    // Prevent duplicate bills
    const bill = Bill(req.body);
    const existingBill = await Bill.exists({date: bill.date, type: bill.type});
    if (existingBill) {
      throw new Error(`Bill dated: ${bill.date} of type: ${bill.type} already exists`);
    }
    
    // Add bill payments for each active user
    const activeUsers = await User.getActiveUsers();
    activeUsers.forEach((user) => {
      const payment = BillPayment({
        userId: user._id,
        usage_in_days: 31,
        payable_amount: 0,
      });

      bill.payments.push(payment);
    });

    await bill.save().then(bill => res.send(bill));
  } catch (err) {
    next(err);
  }
});

/**
 * @route POST /bills/billId/update
 * @group Bills
 * @param {Boolean} is_admin_confirmed - True if the correctness of the bill has been confirmed by the admin
 * @param {Array.<BillPayment>} payments - The bill split payments
 * @returns {Bill.model} 200 - A bill
 * @returns {object} 500 - Error
 */
router.post("/:billId/update", async (req, res, next) => {
  const { billId } = req.params;
  const { is_admin_confirmed, payments } = req.body;
  
  try {
    const bill = await Bill.findById(billId).exec();

    if (is_admin_confirmed) {
      bill.is_admin_confirmed = is_admin_confirmed;
    }

    if (payments) {
      bill.updatePayments(payments);
    }

    await bill.save().then(bill => res.send(bill));
  } catch (err) {
    next(err);
  }
});

/**
 * @route POST /bills/billId/userId/update
 * @group Bills
 * @param {String} status.required - The status of the payment: `unpaid` or `marked` or `paid`
 * @param {Number} usage_in_days - The bill usage in days between `0` and `31` inclusive
 * @returns {Bill.model} 200 - A bill
 * @returns {object} 500 - Error
 */
router.post("/:billId/:userId/update", async (req, res, next) => {
  const { billId, userId } = req.params;
  const { status, usage_in_days } = req.body;

  try {
    const bill = await Bill.findById(billId).exec();

    const payment = bill.payments.find((p) => p.userId == userId);
    if (payment == null) {
      throw new Error(`User id: ${userId} was not found from bill`);
    }

    if (usage_in_days != null) {
      payment.usage_in_days = usage_in_days;
    }

    if (status) {
      payment.status = status;
    }

    await bill.save().then(bill => res.send(bill));
  } catch (err) {
    next(err);
  }
});

/**
 * @route POST /bills/billsId/delete
 * @group Bills
 * @returns {object} 200 - Success
 * @returns {object} 500 - Error
 */
router.post("/:billId/delete", async (req, res, next) => {
  await Bill.deleteOne({ _id: req.params.billId }, (err) => {
    if (err) {
      next(err);
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
