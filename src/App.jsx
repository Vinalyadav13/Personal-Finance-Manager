import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Pots from "./pages/Pots";
import RecurringBills from "./pages/RecurringBills";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/transactions"
  element={
    <ProtectedRoute>
      <Transactions />
    </ProtectedRoute>
  }
/>
<Route
  path="/budgets"
  element={
    <ProtectedRoute>
      <Budgets />
    </ProtectedRoute>
  }
/>
<Route
  path="/pots"
  element={
    <ProtectedRoute>
      <Pots />
    </ProtectedRoute>
  }
/>
<Route
  path="/recurring-bills"
  element={<RecurringBills />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;