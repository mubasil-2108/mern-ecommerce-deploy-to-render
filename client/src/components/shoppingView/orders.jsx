import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import ShoppingOrderDetailView from "./orderDetails";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByUserId, getOrdersDetails, resetOrderDetails } from "@/store/shop/orderSlice";
import { Badge } from "../ui/badge";

function ShoppingOrders() {
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { orderList, orderDetails } = useSelector(state => state.shopOrder);

    useEffect(() => {
        dispatch(getAllOrdersByUserId(user?.id));
    }, [dispatch]);

    useEffect(() => {
        if (orderDetails !== null) {
            setOpenDetailsDialog(true);
        }
    }, [orderDetails])

    function handleFetchOrderDetails(getId) {
        dispatch(getOrdersDetails(getId));
    }

    console.log(orderList, 'orderList');
    return (
        <Card>
            <CardHeader>
                <CardTitle>All Orders</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead>Order Price</TableHead>
                            <TableHead>
                                <span className="sr-only">Details</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            orderList && orderList.length > 0 ?
                                orderList.map((order) => (
                                    <TableRow>
                                        <TableCell>{order?._id}</TableCell>
                                        <TableCell>{order?.orderDate.split('T')[0]}</TableCell>
                                        <TableCell>
                                            <Badge className={`px-3 py-1 ${order?.orderStatus === 'confirmed'
                                                ? 'bg-green-500'
                                                : order?.orderStatus === 'rejected'
                                                    ? 'bg-red-600'
                                                    : 'bg-black'
                                                }`}>{order?.orderStatus}</Badge>
                                        </TableCell>
                                        <TableCell>${order?.totalAmount}</TableCell>
                                        <TableCell>
                                            <Dialog open={openDetailsDialog} onOpenChange={() => {
                                                setOpenDetailsDialog(false)
                                                dispatch(resetOrderDetails())
                                            }}>
                                                <Button onClick={() => handleFetchOrderDetails(order?._id)}>View Details</Button>
                                                <ShoppingOrderDetailView orderDetails={orderDetails} />
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                                :
                                null
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default ShoppingOrders;