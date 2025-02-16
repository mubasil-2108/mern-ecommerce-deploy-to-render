import Address from '@/components/shoppingView/address';
import img from '../../../assets/account.jpg';
import { useDispatch, useSelector } from 'react-redux';
import UserCartItemsContent from '@/components/shoppingView/cartItemsContent';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { createNewOrder } from '@/store/shop/orderSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

function ShoppingCheckOut() {
    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.shopCart);
    const { user } = useSelector(state => state.auth);
    const{ approvalURL} = useSelector(state => state.shopOrder);
    const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
    const [isPaymentStart, setIsPaymentStart] = useState(false);
    const navigate = useNavigate();

    console.log(currentSelectedAddress, 'currentSelectedAddress');
    const totalCartAmount = cartItems && cartItems.items && cartItems.items.length > 0
        ? cartItems.items.reduce(
            (sum, currentItem) =>
                sum +
                (currentItem?.salePrice > 0
                    ? currentItem?.salePrice
                    : currentItem?.price)
                * currentItem?.quantity,
            0
        )
        : 0;

    function handleInitiatePaypalPayment() {
        
        if (cartItems.length === 0) {
            toast({
                title: 'Your cart is empty. Please add some items to proceed.',
                variant: 'destructive'
            })
            return;
        }

        if (currentSelectedAddress === null) {
            toast({
                title: 'Please select an address to proceed.',
                variant: 'destructive'
            })
            return;
        }

        // ()=> navigate('/shop/paypal-return')
        navigate('/shop/paypal-success')

        // For Paypal Payment

        // const orderData = {
        //     userId: user?.id,
        //     cartId: cartItems?._id,
        //     cartItems: cartItems.items.map(item => ({
        //         productId: item?.productId,
        //         title: item?.title,
        //         image: item?.image,
        //         price: item?.salePrice > 0 ? item?.salePrice : item?.price,
        //         quantity: item?.quantity
        //     })),
        //     addressInfo :{
        //         addressId: currentSelectedAddress?._id,
        //         address: currentSelectedAddress?.address,
        //         city: currentSelectedAddress?.city,
        //         pincode: currentSelectedAddress?.pincode,
        //         phone: currentSelectedAddress?.phone,
        //         notes: currentSelectedAddress?.notes
        //     },
        //     orderStatus : 'pending',
        //     paymentMethode : 'paypal',
        //     paymentStatus : 'pending',
        //     totalAmount : totalCartAmount,
        //     orderDate : new Date(),
        //     orderUpdateDate : new Date(),
        //     paymentId :'',
        //     payerId: ''
        // }
        // console.log(orderData, 'orderData');
        // dispatch(createNewOrder(orderData)).then(data => {
        //     if(data?.payload?.success) {
        //         setIsPaymentStart(true);
        //     }else{
        //         setIsPaymentStart(false);
        //     }
        // })
    }

    if(approvalURL){
        window.location.href = approvalURL;
    }

    return (
        <div className='flex flex-col'>
            <div className="relative h-[150px] sm:h-[200px] md:h-[300px] lg:h-[350px] w-full overflow-hidden">
                <img

                    src={img}
                    className="h-full w-full object-cover object-center"
                />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5'>
                <Address setCurrentSelectedAddress={setCurrentSelectedAddress}/>
                <div className='flex flex-col gap-4'>
                    {
                        cartItems && cartItems.items && cartItems.items.length > 0 ?
                            cartItems.items.map((item) => (
                                <UserCartItemsContent cartItem={item} />
                            ))
                            :
                            null
                    }
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between">
                            <span className="font-bold">Total</span>
                            <span className="font-bold">${totalCartAmount}</span>
                        </div>
                    </div>
                    <div className='mt-4 w-full'>
                        <Button onClick={
                            handleInitiatePaypalPayment
                            } className="w-full">Checkout with Paypal</Button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ShoppingCheckOut;