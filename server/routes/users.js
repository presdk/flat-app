const express = require("express");
const router = express.Router();
const { User } = require("../models/User");

/**
 * @route GET /users
 * @group Users
 * @returns {Array.<User>} 200 - An array of user info
 * @returns {object} 500 - Error
 */
router.get("/", async (req, res, next) => {
  await User.find({}, (err, users) => {
    if (err) {
      next(err);
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
router.get("/:userId/", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).exec();
    res.send(user);
  } catch (err) {
    next(err);
  }
});

/**
 * @route POST /users/add
 * @group Users
 * @param {string} name.string.required - the user's name
 * @param {string} email_address.string.required - the user's email
 * @param {string} type - The type of user: `user` or `admin`
 * @returns {User.model} 200 - The user
 * @returns {object} 500 - Error
 */
router.post("/add", async (req, res, next) => {
  const newEntry = req.body;
  const { name, email_address } = newEntry;

  try {
    const existingUsers = await User.find({
      $or: [{ name: name }, { email_address: email_address }],
    }).exec();

    if (existingUsers && existingUsers.length > 0) {
      throw new Error("User already exists with same name or email address");
    }

    const newUser = await User.create(newEntry);
    res.send(newUser);
  } catch (err) {
    next(err);
  }
});

/**
 * @route POST /users/userId/update
 * @group Users
 * @param {string} name.string - the user's name to update
 * @param {string} email_address.string - the user's email to update
 * @returns {object} 200 - Success
 * @returns {object} 500 - Error
 */
router.post("/:userId/update", async (req, res, next) => {
  const changedEntry = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      changedEntry,
      { new: true }
    );

    res.send(user);
  } catch (err) {
    next(err);
  }
});

/**
 * @route POST /users/userId/delete
 * @group Users
 * @returns {object} 200 - Success
 * @returns {object} 500 - Error
 */
router.post("/:userId/delete", async (req, res) => {
  console.log(req.params.userId);
  try {
    await User.deleteOne({ _id: req.params.userId }).exec();
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
