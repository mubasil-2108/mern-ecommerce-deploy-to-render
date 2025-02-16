import { useEffect, useState } from "react";
import { CommonForm } from "../common";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, deleteAddress, editaAddress, fetchAllAddresses } from "@/store/shop/addressSlice";
import AddressCard from "./addressCard";
import { toast } from "@/hooks/use-toast";

const initialFormData = {
    address: "",
    city: "",
    phone: "",
    pincode: "",
    notes: "",
}
function Address({setCurrentSelectedAddress}) {
    const [formData, setFormData] = useState(initialFormData);
    const [currentEditedId, setCurrentEditedId] = useState(null);
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { addressList } = useSelector(state => state.shopAddress);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    useEffect(() => {
        dispatch(fetchAllAddresses(user?.id));
    }, [dispatch])

    function handleManageAddress(event) {
        event.preventDefault();


        if(addressList.length >= 3 && currentEditedId === null) {
            setFormData(initialFormData);
            toast({
                title:'You can add max 3 addresses',
                variant: 'destructive',
            })
            return;
        }

        currentEditedId !== null
      ? dispatch(
          editaAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setCurrentEditedId(null);
            setFormData(initialFormData);
            toast({
              title: "Address updated successfully",
            });
          }
        })
        :
            dispatch(addNewAddress({
                ...formData,
                userId: user?.id
            })).then(data => {
                console.log(data);
                if (data?.payload?.success) {
                    dispatch(fetchAllAddresses(user?.id));
                    setFormData(initialFormData);
                    
                }
            })
    }

    function handleDeleteAddress(getCurrentAddress) {
        console.log(getCurrentAddress);
        dispatch(deleteAddress({ userId: user?.id, addressId: getCurrentAddress?._id })).then(data => {
            if (data?.payload?.success) {
                dispatch(fetchAllAddresses(user?.id));
                toast({
                    title: "Address deleted successfully",
                  });
            }
        })
    }
    function handleEditAddress(getCurrentAddress) {
        setCurrentEditedId(getCurrentAddress?._id);
        setFormData({
            ...formData,
            address: getCurrentAddress?.address,
            city: getCurrentAddress?.city,
            phone: getCurrentAddress?.phone,
            pincode: getCurrentAddress?.pincode,
            notes: getCurrentAddress?.notes,
        })
    }

    function isFormValid() {
        return Object.keys(formData).map(key => formData[key].trim() !== '').every(item => item);
    }

    function handleSelectAddress(addressId) {
        setSelectedAddressId(addressId);
        setCurrentSelectedAddress(addressList.find(address => address._id === addressId));
    }
    console.log(addressList, "addressList");
    return (
        <Card>
            <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
                {
                    addressList && addressList.length > 0 ?
                        addressList.map((item) => (
                            <AddressCard
                                handleDeleteAddress={handleDeleteAddress}
                                handleEditAddress={handleEditAddress}
                                selectedAddressId={selectedAddressId}
                                handleSelectAddress={handleSelectAddress}
                                setCurrentSelectedAddress={setCurrentSelectedAddress}
                                addressInfo={item} />
                        ))
                        : null
                }
            </div>
            <CardHeader>
                <CardTitle>{currentEditedId !== null ? "Edit Address" : "Add New Address"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <CommonForm formControls={addressFormControls}
                    formData={formData}
                    setFormData={setFormData}
                    buttonText={currentEditedId !== null ? 'UPDATE ADDRESS' : 'ADD ADDRESS'}
                    onSubmit={handleManageAddress}
                    isBtnDisabled={!isFormValid()}
                />
            </CardContent>
        </Card>
    )
}

export default Address;