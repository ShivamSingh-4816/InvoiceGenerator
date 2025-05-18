import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import InvoiceGenerator from "@/components/InvoiceGenerator";
import InventoryForm from "@/components/InventoryForm";
import ClientPage from "@/pages/clients/ClientPage";
import DashboardPage from "@/pages/DashboardPage";
import InvoicePage from "@/pages/invoice/InvoicePage";
import FormPreviewPage from "@/pages/FormPreviewPage";
import InvoiceHistoryPage from "@/pages/invoice/InvoiceHistoryPage";
import ShareInvoicePage from "@/pages/invoice/ShareInvoicePage";
import SettingsPage from "@/pages/settings/SettingsPage";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import HomePage from "./pages/HomePage";
import InventoryChart from "@/Components/InventoryChart";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/create-account" element={<SignUpPage />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/create-invoice" element={
        <ProtectedRoute>
          <InvoicePage />
        </ProtectedRoute>
      } />
      <Route path="/form-preview" element={
        <ProtectedRoute>
          <FormPreviewPage />
        </ProtectedRoute>
      } />
      {
        <Route path="/InventoryChart" element={
          <ProtectedRoute>
            <InventoryChart />
          </ProtectedRoute>
        } />
      }
      {
        <Route path="/my-clients" element={
          <ProtectedRoute>
            <ClientPage />
          </ProtectedRoute>
        } />
      }
      {
        <Route path="/InventoryChart" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
      }
      <Route path="/invoice-history" element={
        <ProtectedRoute>
          <InvoiceHistoryPage />
        </ProtectedRoute>
      } />
      <Route path="/client" element={
        <ProtectedRoute>
          <ClientPage />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      } />
      <Route path="/InvoiceGenerator" element={
        <ProtectedRoute>
          <InvoiceGenerator />
        </ProtectedRoute>
      } />
      <Route path="/InventoryForm" element={
        <ProtectedRoute>
          <InventoryForm />
        </ProtectedRoute>
      } />
      
      {/* 404 Route */}
      <Route path="*" element={
        <h2 style={{ textAlign: "center", marginTop: "50px" }}>
          404 - Page Not Found
        </h2>
      } />
    </Routes>
  );
};

export default App;