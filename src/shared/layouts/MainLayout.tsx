
import { NavLink, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";

export default function MainLayout() {
    const { token, me } = useAppSelector(s => s.auth);
    const dispatch = useAppDispatch();

    return (
        <div className="container">
            <div className="card">
                <nav>
                    <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
                    {!token && <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>Login</NavLink>}
                    {!token && <NavLink to="/register" className={({ isActive }) => isActive ? "active" : ""}>Register</NavLink>}
                    {!token && <NavLink to="/verify" className={({ isActive }) => isActive ? "active" : ""}>Verify</NavLink>}
                    {!token && <NavLink to="/forgot" className={({ isActive }) => isActive ? "active" : ""}>Forgot</NavLink>}
                    {!token && <NavLink to="/reset" className={({ isActive }) => isActive ? "active" : ""}>Reset</NavLink>}
                    {token && (
                        <button className="secondary" onClick={() => dispatch(logout())}>Çıkış</button>
                    )}
                </nav>
                {token && (
                    <p className="muted" style={{ marginTop: -8 }}>Giriş: <strong>{me?.email || me?.userName}</strong></p>
                )}
                <Outlet />
                <footer>örnek proje</footer>
            </div>
        </div>
    );
}
