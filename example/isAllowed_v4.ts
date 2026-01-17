////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// isAllowed() Example 4 - Policies as a Chain of Evaluators                  //
//                                                                            //
// This version defines an access policy as a chain of evaluators:            //
//  1. See if we can decide access according to ________                      //
//  2. If not, see if we can decide access according to ________              //
//  3. If not, see if we can decide access according to ________              //
//  4. ... and so on                                                          //
//                                                                            //
// This is a variation of the "chain of responsibility" design pattern.       //
// In our code, a policy is represented as an array of functions that are     //
// called in sequence. Each returns true or false if they can make a          //
// definitive decision about access. If they can't, they return undefined     //
// and the next one will be called.                                           //
//                                                                            //
// This approach is even more flexible. Now we're representing both the logic //
// for invidiual pieces and the overall control flow as data (the sequence of //
// functions to call and what each one does). The only fixed part is that we  //
// are making a true/false determination and that we take the first result.   //
// If we wanted, we could even make that part configurable by having several  //
// "combiner" functions that decide how to combine the results of multiple    //
// evaluators (e.g. require all to agree, or a majority, etc).                //
//                                                                            //
// However, this flexibility is not free. Understanding a policy is more      //
// complex, and there are new kinds of subtle bugs. In particular, whether    //
// an evaluator should return false or undefined is quite nuanced. We also    //
// have more expressiveness in defining policies, but this also means we      //
// can define things that don't even make sense... for example, a policy      //
// array that accidentally omits ALLOW_ADMINS is probably a bug. The fact     //
// that we literally couldn't express this in Example 3 is actually nice.     //
//                                                                            //
// Use this approach if you have a compelling need for flexibility, and only  //
// if the added complexity is justified by that need.                         //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

import { assert, assertNever } from "../src/util";

interface User {
  name: string;
  tier: "basic" | "premium";
  is_admin: boolean;
};

interface Resource {
  vis: "public" | "premium" | "private"; // Note: private should probably be a separate boolean
  owner: string;
}

const BANNED_USERS : string[] = [];

// An AccessEvaluator is a function that determines if a user
// can access a resource. It returns true or false if it can
// make a definitive decision. Otherwise, it returns undefined.
type AccessEvaluator = (user: User, res: Resource) => boolean | undefined;

// Individual evaluators represent pieces of the access logic that
// was previously "hardcoded" in the structure/flow of the isAllowed function. 
const EVALUATORS = {
  ALLOW_ADMINS: (user: User, _: Resource) => user.is_admin ? true : undefined,
  DENY_BANNED: (user: User, _: Resource) => BANNED_USERS.includes(user.name) ? false : undefined,
  OWNER_CAN_ACCESS: (user: User, res: Resource) => user.name === res.owner ? true : undefined,
  ALLOW_BY_TIER: (user: User, res: Resource) => {
    switch (res.vis) {
      case "public": return true;
      case "premium": return user.tier === "premium" ? true : false; // BUG - should probably return undefined, not false
      case "private": return undefined; // tiered access doesn't apply to private resources
      default: assertNever(res.vis);
    }
  },
  FREE_PREMIUM_ACCESS: (user: User, res: Resource) => {
    if (res.vis === "premium") { return true; }
  },
};

// A policy is encoded as a sequence of AccessEvaluators to be applied in order.
type AccessPolicy = readonly AccessEvaluator[];

// Calls evaluators from a policy in sequence, returning the first non-undefined result.
// If all the functions return undefined, then returns undefined representing no decision.
// (Note: see the bottom of the file for a more generic version of this function.)
function evaluatePolicy(policy: AccessPolicy, user: User, res: Resource) : boolean | undefined {
  for (const fn of policy) {
    const result = fn(user, res);
    if (result !== undefined) {
      return result;
    }
  }
  return undefined;
}

// Now we can define multiple policies by piecing together different
// combinations of evaluators in an array, and we can even change which
// parts are included and in what order, effectively representing control
// flow as data!
const normal_policy : AccessPolicy = [
  EVALUATORS.ALLOW_ADMINS,
  EVALUATORS.DENY_BANNED,
  EVALUATORS.OWNER_CAN_ACCESS,
  EVALUATORS.ALLOW_BY_TIER,
];

const anniversary_policy : AccessPolicy = [
  EVALUATORS.ALLOW_ADMINS,
  EVALUATORS.DENY_BANNED,
  EVALUATORS.OWNER_CAN_ACCESS,
  EVALUATORS.FREE_PREMIUM_ACCESS, // Everyone gets premium access!
  EVALUATORS.ALLOW_BY_TIER,
];

const strict_policy : AccessPolicy = [
  EVALUATORS.ALLOW_ADMINS,
  EVALUATORS.DENY_BANNED,
  EVALUATORS.OWNER_CAN_ACCESS,
  // No tiered access - everyone must be owner or admin!
];

const debug_policy : AccessPolicy = [
  () => true // For debugging, make everything always accessible (idk if this is a good idea)
];

function isAllowed(policy: AccessPolicy, user: User, res: Resource) : boolean {
  // Evaluate the policy chain. If it made no decision and returned undefined, default to false.
  return evaluatePolicy(policy, user, res) ?? false;
}




// A more generic version of evaluatePolicy that can be reused elsewhere.
// The generic TArgs and TResult allow use with any function signature.
function evaluateChain<TArgs extends any[], TResult>(
  chain: readonly ((...args: TArgs) => TResult | undefined)[],
  ...args: TArgs
): TResult | undefined {
  for (const fn of chain) {
    const result = fn(...args);
    if (result !== undefined) {
      return result;
    }
  }
  return undefined;
}