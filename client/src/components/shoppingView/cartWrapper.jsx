import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartContent from "./cartItemsContent";

function UserCartWrapper({ cartItems,handleCheckoutPage }) {
    
    const totalCartAmount = cartItems && cartItems.length > 0
        ? cartItems.reduce(
            (sum, currentItem) =>
                sum +
                (currentItem?.salePrice > 0
                    ? currentItem?.salePrice
                    : currentItem?.price)
                * currentItem?.quantity,
            0
        )
        : 0;

    return (
        <SheetContent className="sm:max-w-[350px] overflow-y-scroll">
            <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
            </SheetHeader>
            <div className="mt-8 space-y-4">
                {
                    cartItems && cartItems.length > 0 ?
                        cartItems.map((item) => (
                            <UserCartContent cartItem={item} />
                        ))
                        :
                        null
                }
            </div>
            <div className="mt-8 space-y-4">
                <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">${totalCartAmount}</span>
                </div>
            </div>
            <Button onClick={() => handleCheckoutPage()} className="w-full mt-6">Checkout</Button>
        </SheetContent>
    )
}

export default UserCartWrapper;