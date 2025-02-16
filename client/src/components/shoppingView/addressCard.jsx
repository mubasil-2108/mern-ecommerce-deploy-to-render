import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

function AddressCard({ addressInfo,selectedAddressId,handleSelectAddress, handleDeleteAddress, handleEditAddress, setCurrentSelectedAddress }) {
    
    const isSelected = selectedAddressId === addressInfo._id;
    return (
        <Card onClick={()=> handleSelectAddress(addressInfo._id)} className="cursor-pointer">
            <CardContent className="grid p-4 gap-4 overflow-y-scroll">
                <div className="flex justify-between">
                    <div className="flex flex-col gap-2">
                        <Label className="font-bold  ">Address: <Label className="font-semibold  ">{addressInfo?.address?.slice(0, 40) + (addressInfo?.address?.length > 40 ? "..." : "")}</Label></Label>
                        <Label className="font-bold  ">City: <Label className="font-semibold  "> {addressInfo?.city}</Label></Label>
                        <Label className="font-bold  ">Pincode: <Label className="font-semibold  "> {addressInfo?.pincode}</Label></Label>
                        <Label className="font-bold  ">Phone: <Label className="font-semibold  "> {addressInfo?.phone}</Label></Label>
                        <Label className="font-bold  ">Notes: <Label className="font-semibold  "> {addressInfo?.notes?.slice(0, 40) + (addressInfo?.notes?.length > 40 ? "..." : "")}</Label></Label>
                    </div>
                    <div>
                        <Checkbox checked={isSelected}/>
                    </div>
                </div>

            </CardContent>
            <CardFooter className="p-4 flex justify-between">
                <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
                <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
            </CardFooter>
        </Card>
    )
}

export default AddressCard;