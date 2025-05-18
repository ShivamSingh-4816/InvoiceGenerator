import { supabase } from "../supabase-client";

export const logOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error.message);
    return { success: false, error: error.message };
  }
};

export const getEmailDetails = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    return {
      success: true,
      email: user?.email || null,
      isVerified: Boolean(user?.email_confirmed_at),
      lastSignIn: user?.last_sign_in_at
    };
  } catch (error) {
    console.error('Error getting email details:', error.message);
    return {
      success: false, 
      error: error.message
    };
  }
};
