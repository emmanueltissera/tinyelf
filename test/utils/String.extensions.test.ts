import "../../src/utils/String.extensions";

describe("test toBoolean function", () => {
  it('should return true for "Yes".toBoolean()', () => {
    expect("Yes".toBoolean()).toBe(true);
  });
  it('should return true for "yes".toBoolean()', () => {
    expect("Yes".toBoolean()).toBe(true);
  });
  it('should return false for "no".toBoolean()', () => {
    expect("no".toBoolean()).toBe(false);
  });
  it('should return false for "".toBoolean()', () => {
    expect("".toBoolean()).toBe(false);
  });
});
