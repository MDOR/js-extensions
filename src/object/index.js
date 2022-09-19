import { generateSegmentsFromPath, isValid } from "../utils.js";

/**
 * A generated function that returns the matched value or fallback, from a given array
 * @typedef GeneratedGetter
 * @param {object | null | undefined | array} object
 * @return {object}
 */

/**
 * Generated a function that will look for a value from a path, in any given array. If not the value is not present in the path, and a fallback has been passed, then the fallback value will be returned.
 * @param {string|Array<string>} path
 * @param {object} fallback
 * @example
 * getFrom('user.name')(object)
 * @example
 * getFrom([0, "name"])(users)
 * @return {GeneratedGetter} {@link GeneratedGetter}
 */
export function getFrom(path, fallback) {
  const segments = Array.isArray(path) ? path : generateSegmentsFromPath(path);

  return function generatedGetterFrom(object) {
    if (!isValid(object)) return fallback;

    let currentReferencedSection = object;
    for (const segment of segments) {
      // eslint-disable-next-line no-prototype-builtins
      if (!currentReferencedSection || !currentReferencedSection.hasOwnProperty(segment)) return fallback;
      currentReferencedSection = currentReferencedSection[segment];
    }

    if (typeof currentReferencedSection === "undefined" && typeof fallback !== "undefined") return fallback;

    return currentReferencedSection;
  };
}

/**
 * Insert or overwritte a value, in any given path. If the path is not present it will be vreated 3.
 * @param {string|Array<string>} path
 * @param {object} fallback
 * @example
 * getFrom('user.name')(object)
 * @example
 * getFrom('[0]["name"]')(users)
 * @return {GeneratedGetter} {@link GeneratedGetter}
 */
export function setInto(path, value) {
  const generatedPathSegments = Array.isArray(path) ? path : generateSegmentsFromPath(path);

  return function generatedSetterFor(object) {
    const segments = [...generatedPathSegments];
    let currentReferencedSection = object;
    let segment;

    while (segments.length > 0) {
      segment = segments.shift();

      if (segments.length > 0) {
        // eslint-disable-next-line no-prototype-builtins
        if (!currentReferencedSection.hasOwnProperty(segment)) {
          const nextPath = /[0-9]/.test(segments[0]) ? [] : {};
          currentReferencedSection[segment] = nextPath;
        }
        currentReferencedSection = currentReferencedSection[segment];
      } else {
        // Due the fact of the prototype pollution risk, we want to mitigate any unwanted access to
        // this reserved words. I decided to throw an error in order to report any unwanted intent to modify it
        if (segment === "prototype" || segment === "__proto__" || segment === "constructor")
          throw new Error(`Intend to access to forbidden property ${segment}`);
        currentReferencedSection[segment] = value;
      }
    }
  };
}
