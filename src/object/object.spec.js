import { getFrom } from ".";

describe("getFrom", () => {
  const obj = { a: { b: { c: { d: { e: "Yes" } } } } };
  const objWithArr = { a: { b: { c: [{}, { d: { e: "Yes" } }] } } };

  describe("expect falsy values", () => {
    it("should handle falsy values", () => {
      // eslint-disable-next-line unicorn/prefer-number-properties
      const falsyElements = [null, undefined, false, "", NaN, 0];

      console.log(Object.entries(falsyElements));

      for (const [index, value] of Object.entries(falsyElements))
        expect(getFrom(`[${index}]`)(falsyElements)).toEqual(value);
    });
  });

  describe("invalid", () => {
    it("should not break if any invalid input has been passed", () => {
      for (const v of [null, undefined, {}, Array, -0, false]) {
        expect(getFrom("a.b.c.name")(v)).toEqual(undefined);
      }
    });
  });

  describe("objects", () => {
    it("should return undefined if prop does not exist and fallback is emmpty", () => {
      expect(getFrom("a.b.c.name")(obj)).toEqual(undefined);
    });

    it("should return fallback if prop does not exist", () => {
      for (const v of [1, {}, "testing", true]) {
        expect(getFrom("a.b.1.name", v)(obj)).toEqual(v);
      }
    });

    it("should return value if it exist, using dot notation", () => {
      expect(getFrom("a.b.c.d.e")(obj)).toEqual("Yes");
    });

    it("should return value if it exist, using mixed notation", () => {
      expect(getFrom("a[\"b\"]['c']?.d.e")(obj)).toEqual("Yes");
    });
  });

  describe("arrays", () => {
    it("should return undefined if prop does not exist and fallback is emmpty", () => {
      expect(getFrom("a.b.c.name")(objWithArr)).toEqual(undefined);
    });

    it("should return fallback if prop does not exist", () => {
      for (const v of [1, {}, "testing", true]) {
        expect(getFrom("a.b.1.name", v)(objWithArr)).toEqual(v);
      }
    });

    it("should return value if it exist, using dot notation", () => {
      expect(getFrom("a.b.c.1.d.e")(objWithArr)).toEqual("Yes");
    });

    it("should return value if it exist, using mixed notation", () => {
      expect(getFrom("a.b[\"c\"][1]?.d['e']")(objWithArr)).toEqual("Yes");
    });
  });
});
