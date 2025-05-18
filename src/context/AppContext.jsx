import React, { useContext, useState, useEffect, useRef, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { supabase } from "../supabase-client"; // Create this file for Supabase config
import {
  USER_INITIAL_STATE,
  authUserReducer,
} from "../reducers/AuthUserReducer";
import {
  INVOICE_INITIAL_STATE,
  invoiceFormReducer,
} from "../reducers/InvoiceFormReducer";
import Loading from '../components/ui/Loading';

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const navigateUser = useNavigate();
  const handleNavigateUser = (link) => {
    navigateUser(`/${link}`);
  };

  const [userInitState, authDispatch] = useReducer(
    authUserReducer,
    USER_INITIAL_STATE
  );

  const [invoiceFormState, formDispatch] = useReducer(invoiceFormReducer, {
    invoiceFormData: INVOICE_INITIAL_STATE,
    allInvoiceData: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  // Auth state with Supabase
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        // Check initial session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          authDispatch({ type: "USER_LOGGED_IN", payload: session.user });
          console.log(`Initial session: ${session.user.email}`);
        }

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          switch (event) {
            case 'SIGNED_IN':
              if (session) {
                authDispatch({ type: "USER_LOGGED_IN", payload: session.user });
                console.log(`User signed in: ${session.user.email}`);
              }
              break;
            case 'SIGNED_OUT':
              authDispatch({ type: "USER_LOGGED_OUT", payload: null });
              console.log("User explicitly signed out");
              break;
          }
        });

        return () => {
          subscription?.unsubscribe();
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Handles the create Invoice input values with reducer
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    formDispatch({
      type: "UPDATE_INVOICE_FORM_DATA",
      payload: { name, value },
    });
    setShowPreviewComponent(true);
  };

  // Handle that extra invoice Data items by creating new objects dynamically
  const addNewInvoiceItems = () => {
    formDispatch({ type: "ADD_ITEM_CONTAINER_DATA" });
  };

  // FormPreview function - If it evealuated to true, it renders the FormPreview Page on the App.js
  const handlePreviewData = () => {
    const checkEmptyInput = Object.values(invoiceFormState.invoiceFormData);
    if (checkEmptyInput.some((input) => !input)) {
      alert("please fill out all fields");
      return;
    }

    formDispatch({
      type: "SET_INVOICE_FORM_DATA",
      payload: JSON.parse(invoiceFormState.invoiceFormData),
    });
  };

  // Handle form reset from InvoiceFormReducer
  const handleInvoiceFormReset = () => {
    formDispatch({
      type: "RESET_FORM",
      payload: INVOICE_INITIAL_STATE,
    });
  };

  // Handles each invoice submit and pushes it to be stored in firestore
  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();
    const checkEmptyInput = Object.values(invoiceFormState.invoiceFormData);
    if (checkEmptyInput.some((input) => !input)) {
      alert("please fill out all fields");
      return;
    }

    // Add new invoice to the array in the state
    formDispatch({
      type: "SUBMIT_INVOICE_FORM_DATA",
      payload: invoiceFormState.allInvoiceData.push(
        invoiceFormState.invoiceFormData
      ),
    });

    await handleUpdateDataInSupabase(invoiceFormState.allInvoiceData);
    await fetchInvoiceData();
    setShowAllInvoice(true);
    handleInvoiceFormReset();
  };

  // General update the invoiceData fieldset in firebase. Accepts parameter of the updated invoices to update
  const handleUpdateDataInSupabase = async (updatedInvoice) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .upsert({ 
          user_id: userInitState.currentUser.id,
          invoice_data: updatedInvoice 
        });

      if (error) throw error;
    } catch (e) {
      console.log(e);
    }
  };

  // Handle edit invoice
  const handleEditInvoice = (editedInvoice, id) => {
    return {
      type: "EDIT_INVOICE",
      payload: {
        editedInvoice,
        id,
      },
    };
  };

  // Sent this to DeleteInvoice component and InvoiceHistory page.
  const handleDeleteInvoice = async (deleteindex) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', deleteindex);

      if (error) throw error;

      formDispatch({
        type: "DELETE_INVOICE",
        payload1: { deleteindex },
      });
    } catch (e) {
      console.log(e);
    }
  };

    // handle each individual download with jspdf. This youtube video was helpful - https://www.youtube.com/watch?v=ygPIjzhKB2s
    const EachDownloadRef = useRef([]);
  
    return (
      <AppContext.Provider
        value={{
          userInitState,
          authDispatch,
          invoiceFormState,
          formDispatch,
          handleInputChange,
          addNewInvoiceItems,
          handlePreviewData,
          handleInvoiceFormReset,
          handleInvoiceSubmit,
          handleEditInvoice,
          handleDeleteInvoice,
          handleNavigateUser,
          EachDownloadRef,
        }}
      >
        {isLoading ? <Loading /> : children}
      </AppContext.Provider>
    );
  };
  
  export const useGlobalContext = () => {
    return useContext(AppContext);
  };
  
  export { AppContext, AppProvider };
