import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser, resetTokenAndCredentials } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";

function AdminHeader({ setOpen }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    function handleLogout() {
        // for sub domains cookies
        // dispatch(logoutUser())

        dispatch(resetTokenAndCredentials());
        sessionStorage.clear();
        navigate('/auth/login')
    }
    return (
        <header className="flex justify-between items-center px-4 py-3 bg-background border-b">
            <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
                <AlignJustify />
                <span className="sr-only">Toggle Menu</span>
            </Button>
            <div className="flex flex-1 justify-end">
                <Button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow">
                    <LogOut />
                    Logout
                </Button>
            </div>
        </header>
    )
}

export default AdminHeader;