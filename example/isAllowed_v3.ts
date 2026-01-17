////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// isAllowed() Example 3 - Policies as Strategies                             //
//                                                                            //
// This version defines a fixed structure for an access policy:               //
//  - Admins can access anything                                              //
//  - Do ________ to check if a user is banned. If so, no access.             //
//  - Determine whether the user can access the resource based on visibility: //
//    - For public resources, do ________ to check.                           //
//    - For premium resources, do ________ to check.                          //
//    - For private resources, do ________ to check.                          //
//                                                                            //
// This is a realization of the "strategy" design pattern, where the idea     //
// of an access policy still follows a fixed structure, but individual        //
// pieces are highly customizable. Each ________ in the decription above is   //
// implemented by a function, and an overall strategy is represented as       //
// an object with properties for each of these functions.                     //
//                                                                            //
// The benefit of this approach is flexibility. Individual pieces of the      //
// logic for access control are now represented as program state (i.e what    //
// functions the policy objects contain, and which is selected for use at     //
// runtime) instead of hardcoded logic in the isAllowed() function. The       //
// overall structure of a policy is still fixed according to the control      //
// flow in isAllowed().                                                       //
//                                                                            //
// Use this approach if it matches the kind of flexibility you need.          //
// It's more complex than Example 2, but provides customizability.            //
// It's simpler than Example 4 and preferred if you don't need the overall    //
// policy structure to be flexible in addition to individual pieces.          //
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

// An AccessPolicy defines rules for accessing each resource level.
interface AccessPolicy {
  is_banned: (user: User, res: Resource) => boolean,
  allow_by_visibility: {
    public: (user: User, res: Resource) => boolean,
    premium: (user: User, res: Resource) => boolean,
    private: (user: User, res: Resource) => boolean,
  },
};

// We can define multiple policies, encoding the rules for resource
// access as data rather than the stcucture of the code itself.
const normal_policies : AccessPolicy = {
  is_banned: (user: User, res: Resource) => BANNED_USERS.includes(user.name),
  allow_by_visibility: {
    public: (user: User, res: Resource) => true,
    premium: (user: User, res: Resource) => user.tier === "premium",
    private: (user: User, res: Resource) => user.name === res.owner,
  },
};

const anniversary_policies : AccessPolicy = {
  is_banned: (user: User, res: Resource) => false, // to celebrate, allow banned users (lol, this is a bad idea)
  allow_by_visibility: {
    public: (user: User, res: Resource) => true,
    premium: (user: User, res: Resource) => true, // For our 1 year anniversary, everyone gets premium!
    private: (user: User, res: Resource) => user.name === res.owner,
  },
};

// If the user is an admin, they can access anything
// If the resource is premium, then only premium users
// If the resource is private, only owner can access
// If the user is banned, then they can't access

// NEW: pass in the policy here.
// OR - perhaps this is all in a class, which is constructed with a policy when
// our system starts up and then tracks it in a member variable. Lots of possibilities.
function isAllowed(policy: AccessPolicy, user: User, res: Resource) : boolean {

  // guard
  if (user.is_admin) {
    return true;
  }

  // guard
  if (policy.is_banned(user, res)) { // policy defines how bans are checked
    return false;
  }

  // not an admin and not banned
  // look up the appropriate access policy function and apply it
  return policy.allow_by_visibility[res.vis](user, res);

}