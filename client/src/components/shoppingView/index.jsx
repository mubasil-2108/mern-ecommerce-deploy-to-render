import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
    return (
        <div style={{ flex: 1, flexFlow: 'column', backgroundColor: 'white', overflow: 'hidden' }}>
            {/* common header */}
            <ShoppingHeader />
            <main style={{ flex: 1, flexFlow: 'column', width: 'full' }}>
                <Outlet />
            </main>
        </div>
    );
}

export default ShoppingLayout;