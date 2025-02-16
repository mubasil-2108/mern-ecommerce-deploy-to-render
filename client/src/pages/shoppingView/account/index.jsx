import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accountImg from "../../../assets/account.jpg";
import Address from "@/components/shoppingView/address";
import ShoppingOrders from "@/components/shoppingView/orders";

function ShoppingAccount() {
    return (
        <div className="flex flex-col">
            <div className="relative h-[150px] sm:h-[200px] md:h-[300px] lg:h-[350px] w-full overflow-hidden">
                <img

                    src={accountImg}
                    className="h-full w-full object-cover object-center"
                />
            </div>
            <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
                <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
                    <Tabs defaultValue="orders">
                        <TabsList>
                            <TabsTrigger value="orders">Orders</TabsTrigger>
                            <TabsTrigger value="address">Address</TabsTrigger>
                        </TabsList>
                        <TabsContent value="orders">
                            <ShoppingOrders />
                        </TabsContent>
                        <TabsContent value="address">
                            <Address />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
export default ShoppingAccount;