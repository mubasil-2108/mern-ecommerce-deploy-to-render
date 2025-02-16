import { Outlet } from "react-router-dom";
import AdminSidebar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";

function AdminLayout() {
    const [openSidebar, setOpenSidebar] = useState(false);
    return (
        <div className="flex min-h-screen w-full"> 
            {/* Admin sidebar */}
            <AdminSidebar open={openSidebar} setOpen={setOpenSidebar}/>
            <div style={{flex:1, flexGrow:1, flexFlow:'column'}}>
                {/* Admin header */}
                <AdminHeader setOpen={setOpenSidebar}/>
                <main className="bg-muted/40 p-4 md:p-6" style={{flex:1, flexFlow:'column', flexGrow:1,}}>
                    <Outlet/>
                </main>
            </div>
        </div>
    )
}

export default AdminLayout;