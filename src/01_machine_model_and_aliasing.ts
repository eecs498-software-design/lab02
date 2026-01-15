/**
 * EECS 498 Lab 02
 * Machine Model + Aliasing
 *
 * BIG IDEA:
 *   TypeScript types are erased at runtime — what matters at runtime is JavaScript’s machine model.
 *
 * KEY CONCEPTS YOU’LL PRACTICE:
 *   1) Value vs reference
 *      - Primitives (number, string, boolean) behave like "copied values"
 *      - Objects/arrays behave like "references" (variables store a pointer-like value)
 *
 *   2) Mutation vs reassignment
 *      - Mutation: change the contents of an object (visible through all aliases)
 *      - Reassignment: point a variable at a different object (only affects that variable)
 *
 *   3) Aliasing bugs
 *      - "I thought I copied it" but actually multiple variables refer to the same underlying object/array.
 *
 * HOW TO USE THIS FILE:
 *   - Run it first to see the WRONG output.
 *   - For each TODO, read the comment above it, then implement the function.
 *   - Re-run until output matches the expected output in solution/*.txt.
 *
 * IMPORTANT: do NOT use `as any` or unsafe casting to "make the compiler happy".
 * The point is to learn what the runtime does and how to design around it.
 */

//////////////////////////////
// Part 1: Machine Model
//////////////////////////////

/**
 * A "Box" is an object. Objects live on the heap (conceptually),
 * and variables store a reference to them.
 */
type Box = { value: number };

function makeBox(v: number): Box {
  return { value: v };
}

/**
 * EXERCISE 1: mutateBox
 *
 * Implement mutateBox so it MUTATES the box object that is passed in:
 *   box.value should increase by delta.
 *
 * Why this matters:
 *   If two variables alias the same object, mutating through one changes what the other "sees".
 */
function mutateBox(box: Box, delta: number): void {
  // TODO: mutate the object (do not reassign the parameter)
}

/**
 * EXERCISE 2: reassignBoxLocal
 *
 * Implement reassignBoxLocal so the CALLER is NOT affected.
 *
 * The requirement:
 *   - Inside the function, you should "reassign" the local parameter variable `box`
 *     to point to a brand new object and then mutate that new object.
 *   - But when the function returns, the original box from the caller must be unchanged.
 *
 * Why this matters:
 *   Reassigning a parameter changes only the local variable. The caller's variable is separate.
 *
 * Hint:
 *   box = makeBox(...)
 *   mutateBox(box, delta)
 */
function reassignBoxLocal(box: Box, delta: number): void {
  // TODO: reassign local param; do NOT mutate the original caller object
}

/**
 * EXERCISE 3: swapValuesInPlace
 *
 * Swap the *values* inside two Box objects without swapping the object references.
 *
 * Common mistake:
 *   Doing `const tmp = a; a = b; b = tmp;` does not work because a and b are parameters
 *   (and that would only reassign locals anyway).
 *
 * Correct approach:
 *   Swap `a.value` and `b.value` using a temporary number.
 */
function swapValuesInPlace(a: Box, b: Box): void {
  // TODO: swap a.value and b.value
}

function runMachineModel() {
  // Before reading the expected output, predict what you think will print.

  // Primitives: copied by value
  let x = 10;
  let y = x; // y gets a copy of the number 10
  y += 5; // modifies y only
  console.log("primitive:", x, y); // expect: primitive: 10 15

  // Objects: references
  const b1 = makeBox(10);
  const b2 = b1; // b2 is an alias — b1 and b2 point to SAME object
  b2.value += 5; // mutates the object
  console.log("alias:", b1.value, b2.value); // expect: alias: 15 15

  // mutation via a function
  const b3 = makeBox(100);
  mutateBox(b3, 7);
  console.log("mutateBox:", b3.value); // expect: mutateBox: 107

  // reassignment inside a function should not affect caller
  const b4 = makeBox(100);
  reassignBoxLocal(b4, 7);
  console.log("reassignBoxLocal:", b4.value); // expect: reassignBoxLocal: 100

  // swapping values inside objects
  const a = makeBox(1);
  const b = makeBox(2);
  swapValuesInPlace(a, b);
  console.log("swapValuesInPlace:", a.value, b.value); // expect: swapValuesInPlace: 2 1
}

//////////////////////////////
// Part 2: Aliasing
//////////////////////////////

/**
 * Items and carts demonstrate a classic aliasing bug:
 *   - If you copy a Cart by assignment, you copy a reference (alias), not the contents.
 *   - If you copy the items array shallowly, you still share Item objects.
 */
type Item = { name: string; priceCents: number };
type Cart = { owner: string; items: Item[] };

function makeCart(owner: string, items: Item[]): Cart {
  return { owner, items };
}

/**
 * EXERCISE 4: shallowCopyCart
 *
 * Implement a SHALLOW copy of a Cart:
 *   - new Cart object
 *   - new array for items
 *   - but the Item objects themselves are shared references
 *
 * After this, mutating `copy.items.push(...)` should NOT affect the original array length,
 * but mutating `copy.items[0].priceCents += 1` SHOULD affect the original (shared Item object).
 */
function shallowCopyCart(cart: Cart): Cart {
  // TODO: return a new cart with a new array of items
  return cart; // WRONG on purpose: alias bug
}

/**
 * EXERCISE 5: deepCopyCart
 *
 * Implement a DEEP copy of a Cart:
 *   - new Cart object
 *   - new items array
 *   - each Item is cloned into a NEW object (no shared item references)
 *
 * After this, mutating items inside the copy should not affect the original at all.
 */
function deepCopyCart(cart: Cart): Cart {
  // TODO: create a new cart with cloned items
  return shallowCopyCart(cart); // WRONG on purpose
}

/**
 * EXERCISE 6: applyDiscountSafe
 *
 * applyDiscountSafe must NOT mutate the input cart.
 * It should return a NEW cart where prices are discounted by `percent` (0..1).
 *
 * This is a design discipline exercise:
 *   - if a helper function is "safe", it should not surprise callers by mutating their data.
 *
 * Hint: Create a deep copy first, then modify the copy.
 */
function applyDiscountSafe(cart: Cart, percent: number): Cart {
  // WRONG on purpose: mutates the input cart
  for (const item of cart.items) {
    item.priceCents = Math.round(item.priceCents * 0.9);
  }
  return cart;
}

function runAliasing() {
  const original = makeCart("Ada", [
    { name: "Tea", priceCents: 500 },
    { name: "Cake", priceCents: 700 },
  ]);

  // We expect shallowCopyCart to protect the array structure but not the item objects.
  const c1 = shallowCopyCart(original);
  c1.owner = "Grace";
  c1.items.push({ name: "Cookie", priceCents: 250 });

  console.log("original owner:", original.owner); // expect: Ada
  console.log("original items length:", original.items.length); // expect: 2

  // Because shallow copy shares Item objects, this mutation should show up in original:
  c1.items[0].priceCents += 1;
  console.log("original first item price:", original.items[0].priceCents); // expect: 501

  // applyDiscountSafe should create a new cart and leave original unchanged:
  const discounted = applyDiscountSafe(original, 0.1);
  console.log("discounted !== original:", discounted !== original); // expect: true
  console.log(
    "original unchanged:",
    original.items.map((i) => i.priceCents).join(",")
  ); // expect: 501,700
  console.log(
    "discounted prices:",
    discounted.items.map((i) => i.priceCents).join(",")
  ); // expect: 451,630
}

function main() {
  runMachineModel();
  runAliasing();
}

main();
