import { PATH_MATCHER } from "./constants.js";

/**
 * @private
 * Generate path segments for different function in order to iterate over object internals
 * @param {string} path
 * @return {string[]}
 * @example
 * generateSegmentsFromPath('attributes[0].id.0.bill["total"].amount')
 * Output: ['attributes', '0', 'id', '0', 'bill', 'total', 'amount']
 **/

export function generateSegmentsFromPath(path) {
  const segments = [];

  path.replace(PATH_MATCHER, (match, number, quote, subString) => segments.push(quote ? subString : number || match));

  return segments;
}

/**
 * @private
 * Determines if a value is different than null or undefined
 * @param {Object} value
 * @return {boolean}
 **/
export function isValid(value) {
  return typeof value !== "undefined" && value !== null;
}
