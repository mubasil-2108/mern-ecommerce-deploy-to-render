
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { useEffect, useState } from "react";
import AdminOrderDetailsView from "./orderDetails";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin, getOrdersDetailsForAdmin, resetOrderDetails } from "@/store/admin/orderSlice";
import { Badge } from "../ui/badge";

function AdminOrdersView() {
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const { orderList, orderDetails } = useSelector(state => state.adminOrders);
    const dispatch = useDispatch();


    function handleFetchOrderDetails(getId) {
        dispatch(getOrdersDetailsForAdmin(getId))
    }

    useEffect(() => {
        dispatch(getAllOrdersForAdmin());
    }, [dispatch]);

    useEffect(() => {
        if (orderDetails === null) {
            setOpenDetailsDialog(true);
        }
    }, [orderDetails])

    console.log(orderList, 'orderListAdmin');

    return (
        <Card className="w-full overflow-hidden">
            <CardHeader>
                <CardTitle className="text-lg sm:text-xl md:text-2xl">Order History</CardTitle>
            </CardHeader>
            <CardContent className="overflow-scroll">
                <Table className="min-w-full">
                    <TableHeader >
                        <TableRow>
                            <TableHead className="text-sm sm:text-base">Order ID</TableHead>
                            <TableHead className="text-sm sm:text-base">Order Date</TableHead>
                            <TableHead className="text-sm sm:text-base">Order Status</TableHead>
                            <TableHead className="text-sm sm:text-base">Order Price</TableHead>
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
                                            <Dialog open={openDetailsDialog}
                                                onOpenChange={() => {
                                                    setOpenDetailsDialog(false)
                                                    dispatch(resetOrderDetails())
                                                }}
                                            >
                                                <Button
                                                    onClick={() => handleFetchOrderDetails(order?._id)}
                                                >View Details</Button>
                                                <AdminOrderDetailsView orderDetails={orderDetails} />
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

export default AdminOrdersView;