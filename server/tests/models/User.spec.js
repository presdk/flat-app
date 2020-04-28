const assert = require("assert");
const { User, UserType } = require("../../models/User");

describe("User model", () => {
  it("create user has errors without req fields", () => {
    const user = User();

    user.validate((err) => {
      assert(err.errors.name);
      assert(err.errors.email_address);
    });
  });

  it("create user sets default deleted flag", () => {
    const user = User();

    assert.equal(false, user.is_deleted);
  });

  it("create user sets default user type", () => {
    const user = User();

    assert.equal(UserType.User, user.type);
  });

  it("create user has errors when invalid type given", () => {
    const testCases = [
      { type: "other", isValid: false },
      { type: "user", isValid: true },
      { type: "admin", isValid: true },
    ];

    testCases.forEach((tc) => {
      const { type, isValid } = tc;
      const user = User({ type: type });

      user.validate((err) => {
        assert.equal(isValid, err.errors.type == null);
      });
    });
  });
});
