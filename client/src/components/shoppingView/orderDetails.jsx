import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function ShoppingOrderDetailView({ orderDetails }) {
    const { user } = useSelector(state => state.auth);
    return (
        <DialogContent className="sm:max-w-[600px] max-h-[600px] overflow-y-auto p-4 sm:p-6">
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <div className="flex items-center justify-between mt-6">
                        <p className="font-medium">Order ID</p>
                        <Label>{orderDetails?._id}</Label>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                        <p className="font-medium">Order Date</p>
                        <Label>{orderDetails?.orderDate.split('T')[0]}</Label>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                        <p className="font-medium">Order Price</p>
                        <Label>${orderDetails?.totalAmount}</Label>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                        <p className="font-medium">Payment Method</p>
                        <Label>{orderDetails?.paymentMethod}</Label>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                        <p className="font-medium">Payment Status</p>
                        <Label>{orderDetails?.paymentStatus}</Label>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                        <p className="font-medium">Order Status</p>
                        <Label>
                            <Badge className={`px-3 py-1 ${orderDetails?.orderStatus === 'confirmed'
                                ? 'bg-green-500'
                                : orderDetails?.orderStatus === 'rejected'
                                    ? 'bg-red-600'
                                    : 'bg-black'
                                }`}>{orderDetails?.orderStatus}</Badge>
                        </Label>
                    </div>
                </div>
                <Separator />
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="font-medium">Order Details</div>
                        <ul className="grid gap-3">
                            {
                                orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ?
                                    orderDetails?.cartItems.map((item) => (
                                        <li className="flex items-center justify-between">
                                            <span>Title: {item.title}</span>
                                            <span>Quantity: {item.quantity}</span>
                                            <span>Price: ${item.price}</span>
                                        </li>
                                    ))
                                    :
                                    null
                            }

                        </ul>
                    </div>
                </div>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="font-medium">Shipping Info</div>
                        <div className="grid gap-0.5 text-muted-foreground">
                            <span>Username: {user?.userName}</span>
                            <span>Address: {orderDetails?.addressInfo?.address}</span>
                            <span>City: {orderDetails?.addressInfo?.city}</span>
                            <span>Pincode: {orderDetails?.addressInfo?.pincode}</span>
                            <span>Phone: {orderDetails?.addressInfo?.phone}</span>
                            <span>Notes: {orderDetails?.addressInfo?.notes}</span>
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    )
}

export default ShoppingOrderDetailView;