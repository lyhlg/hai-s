import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
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
    <nav style={{ display: "flex", borderBottom: "1px solid #eee" }}>
      {tabs.map((t) => (
        <Link key={t.path} to={t.path} style={{ flex: 1, textAlign: "center", padding: 12, textDecoration: "none", color: location.pathname === t.path ? "#1976d2" : "#666", fontWeight: location.pathname === t.path ? "bold" : "normal", borderBottom: location.pathname === t.path ? "2px solid #1976d2" : "none" }}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

function App() {
  const { isLoggedIn, storeId } = useAuth();
  const sessionId = localStorage.getItem("sessionId");

  if (!isLoggedIn) {
    return <BrowserRouter><LoginPage /></BrowserRouter>;
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
