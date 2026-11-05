/**
 * Operators sign in with an Operator ID; Firebase Auth needs an email, so each ID maps to one.
 * Kept free of SDK imports so the Node seed script can share it.
 */
export function operatorEmail(operatorId: string) {
  return `${operatorId.trim().toLowerCase()}@kalasag.local`
}
