////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// isAllowed() Example 2 - Improved Logic with Exhaustiveness Checking        //
//                                                                            //
// This version improves the design by using guards to reduce nesting and     //
// laying out the remaining logic in a reasonable way. We can also use an     //
// exhaustiveness check via an assertNever(), so that we get compile-time     //
// feedback if the union type for Resource.vis changes. Using either an       //
// if/else structure or a switch is fine.                                     //
//                                                                            //
// This code is the right choice if you don't expect access policies to       //
// change over time or vary for different parts of a system. Or, if you have  //
// a few, fixed policies, you could have a small number of isAllowedX(),      //
// isAllowedY(), etc. functions with descriptive names.                       //
//                                                                            //
// If (and only if) you have a compelling need for more flexibility in        //
// defining access policies, examples 3 and 4 show approaches that express    //
// policies as data or functions instead of hardcoded control flow.           //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

import { assert, assertNever } from "../src/util";

interface User {
  name: string;
  tier: "basic" | "premium";
  is_admin: boolean;
};

interface Resource {
  vis: "public" | "premium" | "private";
  owner: string;
}

const BANNED_USERS : string[] = [];

// If the user is an admin, they can access anything
// If the resource is premium, then only premium users
// If the resource is private, only owner can access
// If the user is banned, then they can't access

function isAllowed(user: User, res: Resource) : boolean {

  // guard
  if (user.is_admin) {
    return true;
  }

  // guard
  if (BANNED_USERS.includes(user.name)) {
    return false;
  }

  // if we get here, not an admin and not banned

  if(res.vis === "public") {
    return true;
  }
  else if (res.vis === "premium") {
    return user.tier === "premium";
  }
  else if (res.vis === "private") {
    return user.name === res.owner;
  }
  else {
    // Good! The compiler will verify exhaustiveness because assertNever only
    // accepts res.vis if it has been narrowed down to a 'never' type. It also
    // throws an exception at runtime if we did somehow get here.
    assertNever(res.vis);
  }

  // NOTE: We could also encode the above with a switch statement:
  // switch (res.vis) {
  //   case "public": return true;
  //   case "premium": return user.tier === "premium";
  //   case "private": return user.name === res.owner;
  //   default: assertNever(res.vis);
  // }


}