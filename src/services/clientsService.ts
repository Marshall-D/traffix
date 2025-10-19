// src/services/clientsService.ts
import { supabase } from "@/src/utils/supabaseClient";
import { Client } from "../types";

/**
 * Returns { user, error } using supabase.auth.getUser()
 */
export async function getCurrentUser() {
  try {
    const result = await supabase.auth.getUser();
    return result; // { data: { user }, error }
  } catch (error: any) {
    return { data: { user: null }, error };
  }
}

/**
 * Fetch clients for a given admin user id.
 */
export async function fetchClientsForUser(
  adminId: string
): Promise<{ data: Client[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", adminId);
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Insert a new client for the given admin id.
 */
export async function addClientForUser(
  adminId: string,
  payload: Omit<Client, "id" | "clientid" | "created_at">
) {
  try {
    const { data, error } = await supabase
      .from("clients")
      .insert({
        id: adminId,
        email: payload.email,
        password: payload.password,
        firstname: payload.firstname,
        lastname: payload.lastname,
      })
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    return { error };
  }
}
