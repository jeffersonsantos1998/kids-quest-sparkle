import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/integrations/supabase/AuthProvider";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AccountSetup from "@/pages/AccountSetup";
import PaymentSetup from "@/pages/PaymentSetup";
import { Dashboard } from "@/pages/Dashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Register />} />
          <Route path="/setup" element={<AccountSetup />} />
          <Route path="/payment-setup" element={<PaymentSetup />} />
          <Route path="/app" element={<Dashboard />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
