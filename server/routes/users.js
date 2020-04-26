const express = require("express");
const router = express.Router();
const User = require("../models/User");

/**
 * @route GET /users
 * @group Users
 * @returns {Array.<User>} 200 - An array of user info
 * @returns {object} 500 - Error
 */
router.get("/", async (req, res) => {
  await User.find({}, (err, users) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send(JSON.stringify(users));
    }
  });
});

/**
 * @route GET /users/userId
 * @group Users
 * @returns {User.model} 200 - A user
 */
router.get("/:userId/", async (req, res) => {
  await User.findById(req.params,userId, (err, user) => {
    if (err) {
      res.send();
    } else {
      return JSON.stringify(user);
    }
  });
});

/**
 * @route POST /users/
 * @group Users
 * @param {string} name.string - the user's name
 * @param {string} email_address.string - the user's email
 * @returns {User.model} 200 - The user
 * @returns {object} 500 - Error
 */
router.post("/", async (req, res) => {
  const newEntry = req.body;

  await User.create(newEntry, (e, newEntry) => {
    if (e) {
      console.log(e);
      res.sendStatus(500);
    } else {
      res.send(newEntry);
    }
  });
});

/**
 * @route POST /users/userId/update
 * @group Users
 * @param {string} name.string - the user's name to update
 * @param {string} email_address.string - the user's email to update
 * @returns {object} 200 - Success
 * @returns {object} 500 - Error
 */
router.post("/:userId/update", async (req, res) => {
  const changedEntry = req.body;

  await User.update({ _id: req.params.userId }, { $set: changedEntry }, (err) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

/**
 * @route POST /users/userId/delete
 * @group Users
 * @param {string} _id.string - the user's id
 * @returns {object} 200 - Success
 * @returns {object} 500 - Error
 */
router.post("/:userId/delete", async (req, res) => {
    console.log(req.params.userId);
    await User.deleteOne({ _id: req.params.userId }, (err) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  });

module.exports = router;
