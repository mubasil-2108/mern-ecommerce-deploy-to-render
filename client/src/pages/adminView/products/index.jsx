import ProductImageUploader from "@/components/adminView/imageUploader";
import { CommonForm } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from "@/store/admin/productSlice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "@/hooks/use-toast";
import AdminProductTile from "@/components/adminView/productTile";

const initialFormData = {
    image: null,
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    salePrice: "",
    totalStock: "",
}
function AdminProducts() {
    const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const [currentEditedId, setCurrentEditedId] = useState(null);
    const dispatch = useDispatch();
    const { productList } = useSelector(state => state.adminProducts)

    function handleDeleteProduct(id) {
        console.log(id ,"id")
        dispatch(deleteProduct(id)).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllProducts());
                toast({
                    title: "Product deleted successfully",
                    type: "success"
                })
            }
        })
    }
    function onSubmit(e) {
        e.preventDefault();

        currentEditedId !== null ?
            dispatch(editProduct({
                id: currentEditedId,
                formData
            })).then((data) => {
                console.log(data)
                if (data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    setFormData(initialFormData);
                    setOpenCreateProductDialog(false);
                    setCurrentEditedId(null);
                }
            })
            :
            dispatch(addNewProduct({
                ...formData,
                image: uploadedImageUrl
            })).then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    setOpenCreateProductDialog(false);
                    setImageFile(null);
                    setFormData(initialFormData);
                    toast({
                        type: "success",
                        title: 'Product added successfully',
                        variant: "success",
                    })
                }
            })
    }

    function isFormValid() {
        return Object.keys(formData)
            .map(key => formData[key] !== '')
            .every(item => item);
    }

    useEffect(() => {
        dispatch(fetchAllProducts())
    }, [dispatch])

    return (
        <Fragment>
            <div className="mb-5 flex justify-end w-full">
                <Button onClick={() => setOpenCreateProductDialog(true)}>
                    Add New Product
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {
                    productList && productList.length > 0 ?
                        productList.map((item) => (
                            <AdminProductTile
                                setCurrentEditedId={setCurrentEditedId}
                                setOpenCreateProductDialog={setOpenCreateProductDialog}
                                setFormData={setFormData}
                                handleDeleteProduct={handleDeleteProduct}
                                product={item} />
                        )) : null
                }
            </div>
            <Sheet open={openCreateProductDialog} onOpenChange={() => {
                setOpenCreateProductDialog(false);
                setCurrentEditedId(null);
                setFormData(initialFormData);
            }}>
                <SheetContent side="right" className="overflow-auto">
                    <SheetHeader>
                        <SheetTitle>
                            {
                                currentEditedId !== null ? 'Edit Product' : 'Add New Product'
                            }
                        </SheetTitle>
                    </SheetHeader>
                    <ProductImageUploader
                        file={imageFile}
                        setFile={setImageFile}
                        uploadedImageUrl={uploadedImageUrl}
                        setUploadedImageUrl={setUploadedImageUrl}
                        imageLoadingState={imageLoadingState}
                        setImageLoadingState={setImageLoadingState}
                        isEditMode={currentEditedId !== null}
                    />
                    <div className="py-6">
                        <CommonForm formData={formData}
                            onSubmit={onSubmit}
                            setFormData={setFormData}
                            buttonText={currentEditedId !== null ? 'Update Product' : 'Add Product'}
                            formControls={addProductFormElements}
                            isBtnDisabled={!isFormValid()}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </Fragment>
    )
}

export default AdminProducts;