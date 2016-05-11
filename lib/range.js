"use strict";

/**
 * A simple iterator over a range; can iterate forward or backward.
 */
function* range(begin, end) {
  let interval = 1;
  if (end > begin) {
    for (let i = begin; i < end; i += 1) {
      yield i;
    }
  } else {
    for (let i = begin - 1; i >= end; i -= 1) {
      yield i;
    }
  }
}

module.exports = range;
