import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { useAppSelector } from "@/app/hooks";

// Giriş yapılmadan girilmemesi gereken sayfalar
function PrivateOnly({ children }: { children: JSX.Element }) {
  const token = useAppSelector(s => s.auth.token);
  const loc = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: loc }} />;
  return children;
}

// Giriş yapılmışken tekrar gösterilmemesi gereken sayfalar
function PublicOnly({ children }: { children: JSX.Element }) {
  const token = useAppSelector(s => s.auth.token);
  const loc = useLocation();
  if (token) return <Navigate to={(loc.state as any)?.from?.pathname || "/"} replace />;
  return children;
}

export default function AppRoutes() {
  const token = useAppSelector(s => s.auth.token);

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? <HomePage /> : <Navigate to="/login" replace />
        }
      />

      {/* Login, Register, vs. sadece login olmayanlara */}
      <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} />
      <Route path="/verify" element={<PublicOnly><VerifyEmailPage /></PublicOnly>} />
      <Route path="/forgot" element={<PublicOnly><ForgotPasswordPage /></PublicOnly>} />
      <Route path="/reset" element={<PublicOnly><ResetPasswordPage /></PublicOnly>} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
