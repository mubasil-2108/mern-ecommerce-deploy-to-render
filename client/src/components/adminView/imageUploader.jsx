import { useEffect, useRef } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUploader({ file, setFile, isCustomStyling= false, uploadedImageUrl, isEditMode, imageLoadingState, setUploadedImageUrl, setImageLoadingState }) {
    const inputRef = useRef(null);
    function handleImageFileChange(e) {
        console.log(e.target.files);
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    }

    function handleDrageOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            setFile(droppedFile);
        }
    }
    function handleRemoveImage() {
        setFile(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    async function uploadImageToCloudinary() {
        setImageLoadingState(true);
        const data = new FormData();
        data.append('my_file', file);
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/products/upload-image`, data);
        if (response?.data.success) {
            setUploadedImageUrl(response.data.result.url);
            setImageLoadingState(false);
        }
    }

    useEffect(() => {
        if (file !== null) {
            uploadImageToCloudinary();
        }
    }, [file])
    return (
        <div className={`w-full mt-4 ${isCustomStyling ? '':'max-w-md mx-auto'}`}>
            <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
            <div onDragOver={handleDrageOver} onDrop={handleDrop} className={`${isEditMode ? "opacity-60" : ""} border-2 border-dashed rounded-lg p-4`}>
                <Input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    ref={inputRef}
                    onChange={handleImageFileChange}
                    disabled={isEditMode}
                />
                {
                    !file ? (
                        <Label htmlFor="image-upload" className={`${isEditMode ? "cursor-not-allowed" : ''} flex flex-col items-center justify-center h-32 cursor-pointer`}>
                            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
                            <span>Drag & drop or click to upload image</span>
                        </Label>

                    ) :
                        (
                            imageLoadingState ? (
                                <Skeleton className='h-10 bg-gray-100' />
                            )
                                :
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <FileIcon className="w-8 h-8 text-primary mr-2" />
                                        <p className="text-sm text-left font-medium">
                                            {file.name}
                                        </p>
                                    </div>

                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={handleRemoveImage}>
                                        <XIcon className="w-4 h-4" />
                                        <span className="sr-only">Remove File</span>
                                    </Button>
                                </div>
                        )
                }
            </div>
        </div>
    )
}

export default ProductImageUploader;