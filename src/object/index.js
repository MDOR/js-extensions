/**
 * A generated function that returns the matched value or fallback, from a given array
 * @typedef Generated~Getter
 * @param {object | null | undefined | array} object
 * @return {object}
 */

/**
 * Verify is the object is valid or no
 * @param {object | null | undefined | array} object
 * @return {boolean}
 */
function isValid(val) {
  // Is better to check typeof from undefined, as undefined can be overwritten
  return !(typeof val === "undefined" || val === null);
}

/**
 * Generated a function that will look for a value from a path, in any given array. If not the value is not present in the path, and a fallback has been passed, then the fallback value will be returned.
 * @param {string} path
 * @param {object | null | undefined | array} fallback
 * @example
 * getFrom('user.name')(object)
 * @example
 * getFrom('['0']?.name')(users)
 * @example
 * getFrom('[0]["name"]')(users)
 * @return {Generated~Getter} {@link Generated~Getter}
 */
export function getFrom(path, fallback) {
  // Normalize path, to generated an array for lookup props
  // eg: 'attributes[0].id.0.bill["total"]?.amount'
  /* this input will be transformed into: ['attributes', '0', 'id', '0', 'bill', 'total', 'amount']
   */
  const segments = path
    .replaceAll(/\[\s*('|")?/g, ".")
    .replaceAll(/('|")?\s*\]/g, "")
    .replaceAll("?.", ".")
    .split(".")
    .filter(Boolean);

  return function generatedGetterFrom(object) {
    if (!isValid(object)) return fallback;

    let currentReferencedSection = object;
    for (const segment of segments) {
      // eslint-disable-next-line no-prototype-builtins
      if (!currentReferencedSection.hasOwnProperty(segment)) return fallback;
      currentReferencedSection = currentReferencedSection[segment];
    }

    if (typeof currentReferencedSection === "undefined" && typeof fallback !== "undefined") return fallback;

    return currentReferencedSection;
  };
}
