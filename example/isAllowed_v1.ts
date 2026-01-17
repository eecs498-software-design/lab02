////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// isAllowed() Example 1 - Messy, Fragile Logic                               //
//                                                                            //
// This version works (I think?), but the design is messy and fragile.        //
// The resource access logic is implemented through conditionals, but         //
// the structure is difficult to understand and reason about, and we          //
// don't have quick, compile-time feedback for exhaustiveness issues.         //
//                                                                            //
// This code is of poor quality. Example 2 presents an improvement.           //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

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

  if (user.is_admin) {
    return true;
  }
  // BAD - the else here adds unnecessary nesting
  else {
    if (user.name === res.owner) {
      // owner can access anything, unless banned
      return !BANNED_USERS.includes(user.name); // BAD - this check is duplicated a bunch
    }
    else {
      // not owner, not admin
      if (user.tier === "premium") {
        // premium user - can access everything except private or if they're banned
        return res.vis !== "private" && !BANNED_USERS.includes(user.name);
        // ^^^ BAD - the "anything but private" check is fragile, e.g. if we add "super_premium".
      }
      else if (res.vis === "public") {
        // if it's public, they can access it even if not premium, unless banned
        return !BANNED_USERS.includes(user.name);
      }
      // ^^^ BAD - mixing the "switched" variable res.vis with user.tier in if/elseif is confusing

      // Assumption - at this point, the user must be "basic" and
      // the resource must be either "premium" or "private".
      return false;
      // ^^^ BAD - this is fragile if we add more levels. We'd rather
      // narrow down to a never case and check exhaustiveness here.
    }
  }

}