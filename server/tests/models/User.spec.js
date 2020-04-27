const assert = require("assert");
const { User } = require("../../models/User");

describe("User model", () => {
  it("create user has errors without req fields", () => {
    const user = User({});

    user.validate((err) => {
      assert(err.errors.name);
      assert(err.errors.email_address);
    });
  });

  it("create user sets default deleted flag", () => {
    const user = User({});

    assert.equal(false, user.is_deleted);
  });
});