import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, fetchCartItems, updateCartQuantity } from "@/store/shop/cartSlice";
import { toast } from "@/hooks/use-toast";

function UserCartItemsContent({ cartItem }) {

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { cartItems } = useSelector(state => state.shopCart);
    const { productList } = useSelector(state => state.shopProducts);


    function handleCartItemDelete(getCurrentProduct) {
        dispatch(deleteCartItem({ userId: user?.id, productId: getCurrentProduct?.productId })).then((data) => {
            if (data?.payload?.success) {
                toast({
                    type: 'success',
                    title: 'Cart item is deleted successfully'
                })
            }
        })
    }

    function handleUpdateQuantity(getCurrentProduct, typeOfAction) {
        if (typeOfAction === 'plus') {
            let getCartItems = cartItems.items || [];
            if (getCartItems.length) {
                const indexOfCurrentCartItem = getCartItems.findIndex(item => item.productId === getCurrentProduct?.productId);

                const getCurrentProductIndex = productList.findIndex(product => product._id === getCurrentProduct?.productId)
                const getTotalStock = productList[getCurrentProductIndex].totalStock
                if (indexOfCurrentCartItem > -1) {
                    const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
                    if (getQuantity + 1 > getTotalStock) {
                        toast({
                            title: `Only ${getQuantity} quantity can be added for this item`,
                            variant: 'destructive'
                        })
                        return;
                    }
                }

            }
        }

        dispatch(updateCartQuantity({
            userId: user?.id,
            productId: getCurrentProduct?.productId,
            quantity: typeOfAction === 'plus' ? getCurrentProduct?.quantity + 1 : getCurrentProduct?.quantity - 1,
        })).then((data) => {
            if (data?.payload?.success) {
                toast({
                    type: 'success',
                    title: 'Cart item is updated successfully'
                })
            }
        })
    }

    return (
        <div key={cartItem?.id} className="flex items-center space-x-4">
            <img
                src={cartItem?.image}
                alt={cartItem?.title}
                className="h-20 w-20 rounded object-cover"
            />
            <div className="flex-1">
                <h3 className="font-extrabold">{cartItem?.title}</h3>
                <div className="flex items-center mt-1 gap-2">
                    <Button disabled={cartItem?.quantity === 1} onClick={() => handleUpdateQuantity(cartItem, 'minus')} variant="outline" size="icon" className="h-8 w-8 rounded-md">
                        <Minus className="w-4 h-4" />
                        <span className="sr-only">Decrease</span>
                    </Button>
                    <span className="font-semibold">{cartItem?.quantity}</span>
                    <Button onClick={() => handleUpdateQuantity(cartItem, 'plus')} variant="outline" size="icon" className="h-8 w-8 rounded-md">
                        <Plus className="w-4 h-4" />
                        <span className="sr-only">Increase</span>
                    </Button>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <p className="font-semibold">${((cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) * cartItem?.quantity).toFixed(2)}</p>
                <Trash onClick={() => handleCartItemDelete(cartItem)} className="cursor-pointer mt-1 " size={20} />
            </div>
        </div>
    )
}

export default UserCartItemsContent;