/**
 * Role enum and labels. Used for admin sign-up, client creation, and profile display.
 * No UI selection: role is set automatically (admin on register, client when admin creates a client).
 */

export enum Role {
  Admin = "admin",
  Client = "client",
}

/** Display label for each role (e.g. in ProfileCard). */
export const ROLE_LABELS: Record<Role, string> = {
  [Role.Admin]: "Admin",
  [Role.Client]: "Security guard",
};
