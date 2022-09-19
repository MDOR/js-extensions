import { getFrom, setInto } from ".";

describe("getFrom", () => {
  const obj = { a: { b: { c: { d: { e: "Yes" } } } } };
  const objWithArr = { a: { b: { c: [{}, { d: { e: "Yes" } }] } } };

  describe("general", () => {
    it("should handle falsy values", () => {
      // eslint-disable-next-line unicorn/prefer-number-properties
      const falsyElements = [null, undefined, false, "", NaN, 0];

      for (const [index, value] of Object.entries(falsyElements))
        expect(getFrom(`[${index}]`)(falsyElements)).toEqual(value);
    });

    it("should not break if any invalid input has been passed", () => {
      for (const v of [null, undefined, {}, Array, -0, false]) {
        expect(getFrom("a.b.c.name")(v)).toBeUndefined();
      }
    });
  });

  describe("objects", () => {
    it("should return fallback if prop does not exist", () => {
      expect(getFrom("a.b.v.c", 0)({ a: undefined })).toBe(0);
      expect(getFrom("a.b.v.c", 0)()).toBe(0);
      expect(getFrom("a.b.v.c", 0)(null)).toBe(0);
      expect(getFrom("a.b.v.c", 0)({ a: { b: null } })).toBe(0);
    });

    it("should return undefined if prop does not exist and fallback is empty", () => {
      expect(getFrom("a.b.c.name")(obj)).toBeUndefined();
    });

    it("should return fallback if prop does not exist and fallback is not empty", () => {
      for (const v of [1, {}, "testing", true]) {
        expect(getFrom("a.b.1.name", v)(obj)).toEqual(v);
        expect(getFrom(["a", "b", 1, "name"], v)(obj)).toEqual(v);
      }
    });

    it("should return value if it exist, using dot notation", () => {
      expect(getFrom("a.b.c.d.e")(obj)).toBe("Yes");
    });

    it("should return value if it exist, using mixed notation", () => {
      expect(getFrom("a[\"b\"]['c'].d.e")(obj)).toBe("Yes");
    });

    it("should return value when passing an array as parameter", () => {
      expect(getFrom(["a", "b", "c", "d", "e"])(obj)).toBe("Yes");
    });
  });

  describe("arrays", () => {
    it("should return fallback if prop does not exist", () => {
      expect(getFrom("a", 0)({ a: undefined })).toBe(0);
    });

    it("should return undefined if prop does not exist and fallback is empty", () => {
      expect(getFrom("a.b.c.name")(objWithArr)).toBeUndefined();
    });

    it("should return fallback if prop does not exist and fallback is not empty", () => {
      for (const v of [1, {}, "testing", true]) {
        expect(getFrom("a.b.1.name", v)(objWithArr)).toEqual(v);
      }
    });

    it("should return value if it exist, using dot notation", () => {
      expect(getFrom("a.b.c.1.d.e")(objWithArr)).toBe("Yes");
      expect(getFrom(["a", "b", 1, "name"], "Yes")(obj)).toBe("Yes");
    });

    it("should return value if it exist, using mixed notation", () => {
      expect(getFrom("a.b[\"c\"][1].d['e']")(objWithArr)).toBe("Yes");
      expect(getFrom(["a", "b", "c", 1, "d", "e"])(objWithArr)).toBe("Yes");
    });
  });
});

describe("setInto", () => {
  describe("security", () => {
    it("should not let overwrite constructor", () => {
      class Test {
        constructor(name) {
          this.name = name;
        }
      }
      const test = () => {
        setInto("constructor", () => alert())(Test);
      };

      expect(test).toThrow(Error);
      expect(test).toThrow("Intend to access to forbidden property constructor");
    });
    it("should not let overwrite __proto__", () => {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      function Test(name) {
        this.name = name;
      }
      const test = () => {
        setInto("__proto__", () => alert())(Test);
      };

      expect(test).toThrow(Error);
      expect(test).toThrow("Intend to access to forbidden property __proto__");
    });

    it("should not let overwrite prototype", () => {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      function Test(name) {
        this.name = name;
      }
      const test = () => {
        setInto("prototype", () => alert())(Test);
      };

      expect(test).toThrow(Error);
      expect(test).toThrow("Intend to access to forbidden property prototype");
    });
  });
  describe("objects", () => {
    it("should create a value if it does not exist and the parent prop is an object - string notation", () => {
      const obj = {};
      setInto("user.config['name']", "Marco")(obj);

      const { config } = obj.user;
      expect(config.name).toBe("Marco");
      expect(config && typeof config === "object").toBe(true);
    });
    it("should update a value if it does not exist and the parent prop is an object - array notation", () => {
      const obj = { config: { name: "Antonio" } };
      setInto(["user", "config", "name"], "Marco")(obj);

      const { config } = obj.user;
      expect(config.name).toBe("Marco");
      expect(config && typeof config === "object").toBe(true);
    });
  });

  describe("arrays", () => {
    it("should create a value if it does not exist and the parent prop is an array - string notation", () => {
      const obj = {};
      setInto("orgs.[3].name", "Fake company")(obj);

      const { orgs } = obj;
      expect(orgs[3].name).toBe("Fake company");
      expect(Array.isArray(orgs)).toBe(true);
    });
    it("should update a value if it does not exist and the parent prop is an array - array notation", () => {
      const obj = {};
      setInto(["orgs", "3", "name"], "Fake company")(obj);

      const { orgs } = obj;
      expect(orgs[3].name).toBe("Fake company");
      expect(Array.isArray(orgs)).toBe(true);
    });
  });
});
