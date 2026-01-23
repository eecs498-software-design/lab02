/**
 * EECS 498 Lab 02
 * Arrays In Depth
 *
 * BIG IDEA:
 *   Arrays are objects. Passing an array to a function passes a reference to the same array.
 *
 * KEY CONCEPTS:
 *   - "Pure" function: does not mutate its inputs, only returns new data
 *   - In-place function: intentionally mutates its input (and should be named/documented clearly)
 *
 * WHAT YOU WILL DO:
 *   1) Make appendPure truly pure
 *   2) Make removeFirstInPlace actually mutate
 *   3) Fix a subtle impurity bug in sumPure
 *   4) Use array slicing to extract subarrays
 *   5) Understand array methods: slice, concat, filter
 *   6) Practice with array destructuring
 */

// EXERCISE 1: appendPure should return a NEW array with x appended, without mutating input.
function appendPure(xs: number[], x: number): number[] {
  // TODO: return a new array (do not call xs.push)
  // Hint: [ ...xs, x ] creates a new array
  xs.push(x); // WRONG on purpose
  return xs;
}

// EXERCISE 2: removeFirstInPlace should mutate the array by removing the first element.
function removeFirstInPlace(xs: number[]): void {
  // TODO: mutate xs to remove the first element
  // Hint: xs.shift()
}

// EXERCISE 3: sumPure must be pure (must not mutate xs).
function sumPure(xs: number[]): number {
  // TODO: remove impurity
  //
  // Why is this currently impure?
  //   Sorting an array in JS mutates it in place.
  //   Even if sorting doesn't "change the sum", it changes the caller's array order.
  //
  xs.sort((a, b) => a - b); // WRONG on purpose: mutates input
  let total = 0;
  for (const x of xs) total += x;
  return total;
}

// EXERCISE 4: getMiddleSlice should return a NEW array containing elements from start to end (exclusive).
// Use array.slice() to create a shallow copy of a portion of the array.
// slice(start, end) returns elements from index start up to (but not including) end.
function getMiddleSlice(xs: number[], start: number, end: number): number[] {
  // TODO: use xs.slice() to return a new array with elements from start to end
  // Hint: slice() does NOT mutate the original array
  return xs; // WRONG on purpose: returns entire array
}

// EXERCISE 5: combineArrays should return a NEW array that combines xs and ys.
// Use concat() or spread operator. concat() does NOT mutate the original arrays.
function combineArrays(xs: number[], ys: number[]): number[] {
  // TODO: return a new array combining xs and ys
  xs.push(...ys); // WRONG on purpose: mutates xs
  return xs;
}

// EXERCISE 6: removeElements should return a NEW array with elements at indices removed.
// The indices array contains the positions to remove (assume indices are valid and sorted).
// Hint: Use filter() with index parameter, or build a new array excluding those indices.
function removeElements(xs: number[], indices: number[]): number[] {
  // TODO: return new array without elements at the specified indices
  // Hint: filter((val, idx) => !indices.includes(idx))
  for (const idx of indices) {
    xs.splice(idx, 1); // WRONG on purpose: mutates xs
  }
  return xs;
}

// EXERCISE 7: removeRangePure should return a NEW array with the range [start, end) removed.
//
// Example:
//   removeRangePure([10,20,30,40,50], 1, 4) -> [10,50]
//
// Requirements:
//   - must NOT mutate xs
//   - must treat end as exclusive (like slice)
//
// Hint:
//   Combine slices: xs.slice(0, start) and xs.slice(end)
function removeRangePure(xs: number[], start: number, end: number): number[] {
  // TODO: return a new array without mutating xs
  // WRONG on purpose: splice mutates xs
  xs.splice(start, end - start);
  return xs;
}

function main() {
  const a = [1, 2, 3];
  const b = appendPure(a, 4);

  console.log("a:", a.join(",")); // expect: 1,2,3
  console.log("b:", b.join(",")); // expect: 1,2,3,4

  const c = [10, 20, 30];
  removeFirstInPlace(c);
  console.log("c after removeFirstInPlace:", c.join(",")); // expect: 20,30

  const d = [3, 1, 2];
  const s = sumPure(d);
  console.log("sum:", s); // expect: 6
  console.log("d unchanged:", d.join(",")); // expect: 3,1,2

  // Array slicing exercises
  const e = [10, 20, 30, 40, 50];
  const middle = getMiddleSlice(e, 1, 4);
  console.log("middle slice:", middle.join(",")); // expect: 20,30,40
  console.log("e unchanged:", e.join(",")); // expect: 10,20,30,40,50

  // Array combination
  const h1 = [1, 2];
  const h2 = [3, 4];
  const combined = combineArrays(h1, h2);
  console.log("combined:", combined.join(",")); // expect: 1,2,3,4
  console.log("h1 unchanged:", h1.join(",")); // expect: 1,2
  console.log("h2 unchanged:", h2.join(",")); // expect: 3,4

  // Remove elements
  const i = [10, 20, 30, 40, 50];
  const removed = removeElements(i, [1, 3]);
  console.log("removed indices 1,3:", removed.join(",")); // expect: 10,30,50
  console.log("i unchanged:", i.join(",")); // expect: 10,20,30,40,50

  // Remove a contiguous range (pure, slice-based)
  const r = [10, 20, 30, 40, 50];
  const r2 = removeRangePure(r, 1, 4);
  console.log("removeRangePure:", r2.join(",")); // expect: 10,50
  console.log("r unchanged:", r.join(",")); // expect: 10,20,30,40,50
}

main();
