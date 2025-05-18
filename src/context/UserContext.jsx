import React, { useContext } from "react";
import { supabase } from "../supabase-client";
import { useGlobalContext } from "./AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { toast ,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const { handleNavigateUser } = useGlobalContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCreateUserWithEmailAndPassword = async (email, password, name = "username") => {
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      });

      if (error) throw error;

      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          name,
          email,
          auth_provider: 'email',
          created_at: new Date(),
          invoice_data: []
        });

      if (profileError) throw profileError;

      alert("Account created successfully");
      handleNavigateUser("dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUserLogInWithEmailAndPassword = async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        handleNavigateUser("dashboard");
      }

      setTimeout(() => {
        toast.success("Login successful");
      }, 500);
    } catch (error) {
      toast.error("Invalid email or password");
    }
  };

  const handleUserSignInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUserPasswordReset = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      alert("Password reset email sent. Check your email");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <UserContext.Provider
      value={{
        handleCreateUserWithEmailAndPassword,
        handleUserLogInWithEmailAndPassword,
        handleUserSignInWithGoogle,
        handleUserPasswordReset,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuthUserContext = () => {
  return useContext(UserContext);
  <ToastContainer position="top-right" autoClose={3000} />
};

export { UserContext, UserProvider };
