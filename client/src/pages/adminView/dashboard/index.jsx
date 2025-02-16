import ProductImageUploader from "@/components/adminView/imageUploader";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { addFeatureImage, getFeatureImages } from "@/store/common";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const { featureImageList } = useSelector(state => state.commonFeature);
    const dispatch = useDispatch();

    function handleUploadFeatureImage() {
        dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
            if (data?.payload?.success) {
                dispatch(getFeatureImages());
                setImageFile(null);
                setUploadedImageUrl("");
                toast({
                    title: "Image uploaded successfully",
                    type: "success"
                })
            }
        })
    }

    useEffect(() => {
        dispatch(getFeatureImages());
    }, [dispatch])

    console.log(featureImageList, "featureImageList");
    return (
        <div>
            {/* <h1>Upload Feature Images</h1> */}
            <ProductImageUploader
                file={imageFile}
                setFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                imageLoadingState={imageLoadingState}
                setImageLoadingState={setImageLoadingState}
                isCustomStyling={true}
            // isEditMode={currentEditedId !== null}
            />
            <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">Upload</Button>
            <div className="flex flex-col gap-4 mt-5">
                {
                    featureImageList && featureImageList?.length > 0 ?
                        featureImageList.map((item) => (
                            <div key={item?._id} className="relative">
                                <img
                                    src={item?.image}
                                    className="w-full h-[300px] object-cover rounded-t-lg"
                                />

                            </div>

                        ))
                        :
                        null
                }
            </div>
        </div>
    )
}

export default AdminDashboard;