import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { Spinner } from "@hai-s/dd";
import LoginPage from "./pages/LoginPage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import OrderConfirmPage from "./pages/OrderConfirmPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";

function Nav() {
  const location = useLocation();
  const tabs = [
    { path: "/", label: "메뉴" },
    { path: "/cart", label: "장바구니" },
    { path: "/orders", label: "주문내역" },
  ];
  return (
    <nav className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
      {tabs.map((t) => (
        <Link
          key={t.path}
          to={t.path}
          className={`flex-1 text-center py-3 text-sm font-medium transition-colors ${
            location.pathname === t.path
              ? "text-primary-600 border-b-2 border-primary-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

function App() {
  const { status, storeId, sessionId } = useAuth();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<MenuPage storeId={storeId!} />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order-confirm" element={<OrderConfirmPage />} />
        <Route path="/orders" element={<OrderHistoryPage sessionId={sessionId} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
