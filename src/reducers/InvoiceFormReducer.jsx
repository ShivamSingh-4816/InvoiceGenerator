import {
  ADD_ITEM_CONTAINER_DATA,
  DELETE_INVOICE,
  ERROR,
  FETCH_INVOICE_DATA, // Changed from FETCH_FIREBASE_INVOICE_DATA
  RESET_INVOICE_FORM,
  SUBMIT_INVOICE_FORM_DATA,
  UPDATE_INVOICE_FORM_DATA,
} from "@/reducers/constants";

// Initial state remains the same
export const INVOICE_INITIAL_STATE = {
  dateCreated: "",
  dateDue: "",
  billFromEmail: "",
  billFromName: "",
  billFromPhoneNumber: "",
  billToEmail: "",
  billToName: "",
  billToPhoneNumber: "",
  bankName: "",
  accountName: "",
  bankAccount: "",
  itemContainer: [
    {
      itemContent: "",
      itemQty: "",
      itemPrice: "",
    },
  ],
};

export const invoiceFormReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_INVOICE_FORM_DATA:
      const { name, value } = action.payload;
      let index, field;
      if (name.includes("itemContainer")) {
        [index, field] = name.split(".").slice(-2);
        index = parseInt(index);

        if (index >= 0 && index < state.invoiceFormData.itemContainer.length) {
          const newItemContainer = [...state.invoiceFormData.itemContainer];
          newItemContainer[index][field] = value;
          return {
            ...state,
            invoiceFormData: {
              ...state.invoiceFormData,
              itemContainer: newItemContainer,
            },
          };
        }
      } else {
        return {
          ...state,
          invoiceFormData: {
            ...state.invoiceFormData,
            [name]: value,
          },
        };
      }
    case ADD_ITEM_CONTAINER_DATA:
      return {
        ...state,
        invoiceFormData: {
          ...state.invoiceFormData,
          itemContainer: [
            ...state.invoiceFormData.itemContainer,
            {
              itemContent: "",
              itemQty: "",
              itemPrice: "",
            },
          ],
        },
      };
    case SUBMIT_INVOICE_FORM_DATA:
      return {
        ...state,
        allInvoiceData: action.payload,
      };
    case FETCH_INVOICE_DATA: // Changed from FETCH_FIREBASE_INVOICE_DATA
      return {
        ...state,
        allInvoiceData: action.payload,
      };
    case DELETE_INVOICE:
      const { deleteindex } = action.payload1;
      const updateDeletedArray = state.allInvoiceData.filter(
        (item, i) => i !== deleteindex
      );
      return {
        ...state,
        allInvoiceData: updateDeletedArray,
      };
    case "SET_INVOICE_FORM_DATA":
      return {
        ...state,
        invoiceFormData: action.payload,
      };
    case "EDIT_INVOICE":
      const { editedInvoice, id } = action.payload;
      const updatedInvoiceData = [...state.allInvoiceData];
      updatedInvoiceData[id] = editedInvoice;
      return {
        ...state,
        allInvoiceData: updatedInvoiceData,
      };
    case RESET_INVOICE_FORM:
      return {
        ...state,
        invoiceFormData: INVOICE_INITIAL_STATE,
      };
    case ERROR:
      throw new Error(`Unhandled action type: ${action.type}`);
    default:
      return state;
  }
};
