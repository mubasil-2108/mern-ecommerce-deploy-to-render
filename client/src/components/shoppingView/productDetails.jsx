import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { addToCart, fetchCartItems } from "@/store/shop/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "@/hooks/use-toast";
import { setProductDetails } from "@/store/shop/productSlice";
import { Label } from "../ui/label";
import { StarRatingComponent } from "../common";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/reviewSlice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { cartItems } = useSelector(state => state.shopCart);
    const { reviews } = useSelector(state => state.shopReview);
    const [reviewMsg, setReviewMsg] = useState('');
    const [rating, setRating] = useState(0);

    function handleRatingChange(getRating) {
        setRating(getRating)
    }

    function handleAddReview() {
        dispatch(addReview({
            productId: productDetails?._id,
            userId: user?.id,
            userName: user?.userName,
            reviewMessage: reviewMsg,
            reviewValue: rating
        })).then(data => {
            if (data?.payload?.success) {
                dispatch(getReviews(productDetails?._id));
                toast({
                    title: 'Review added successfully!'
                })
            }
            toast({
                title: 'You need to buy this product to add review',
                variant: 'destructive'
            })
        })
    }

    function handleAddToCart(getCurrentProductId, getTotalStock) {
        let getCartItems = cartItems.items || [];
        if (getCartItems.length) {
            const indexOfCurrentItem = getCartItems.findIndex(item => item.productId === getCurrentProductId);
            if (indexOfCurrentItem > -1) {
                const getQuantity = getCartItems[indexOfCurrentItem].quantity;
                if (getQuantity + 1 > getTotalStock) {
                    toast({
                        title: `Only ${getQuantity} quantity can be added for this item`,
                        variant: 'destructive'
                    })
                    return;
                }
            }

        }

        dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 }))
            .then((data) => {
                if (data?.payload?.success) {
                    setReviewMsg('');
                    setRating(0);
                    dispatch(fetchCartItems(user?.id));
                    setOpen(false);
                    toast({
                        title: "Product added to cart successfully",
                    })
                }
            });
    }

    function handleDialogClose() {
        setOpen(false);
        dispatch(setProductDetails());
        setRating(0);
        setReviewMsg('')
    }

    useEffect(() => {
        if (productDetails !== null) {
            dispatch(getReviews(productDetails?._id));
        }
    }, [productDetails])

    const averageReview = reviews && reviews.length > 0
        ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / reviews.length
        : 0;


    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:p-6 md:p-8 max-h-[90vh] max-w-[95vw] sm:max-w-[85vw] lg:max-w-[70vw] overflow-y-scroll">
                <div className="relative overflow-hidden rounded-lg">
                    <img
                        src={productDetails?.image}
                        alt={productDetails?.title}
                        width={600}
                        height={600}
                        className="w-full h-auto max-h-[550px] object-cover rounded-lg"
                    />
                </div>
                <div className="">
                    <div>
                        <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
                        <p className="text-muted-foreground text-2xl mb-5 mt-4">{productDetails?.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className={`${productDetails?.salePrice > 0 ? "line-through" : ""} text-3xl font-bold text-primary`}>${productDetails?.price}</p>
                        {
                            productDetails?.salePrice > 0 ?
                                (
                                    <p className="text-2xl font-bold text-muted-foreground">${productDetails?.salePrice}</p>
                                )
                                :
                                null
                        }
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-0.5">
                            <StarRatingComponent rating={averageReview}/>
                        </div>
                        <span className="text-muted-foreground">({averageReview.toFixed(1)})</span>
                    </div>
                    <div className="mt-5 mb-5">
                        {
                            productDetails?.totalStock === 0 ?
                                (
                                    <Button className="w-full opacity-60 cursor-not-allowed">Out Of Stock</Button>
                                )
                                :
                                (
                                    <Button onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)} className="w-full">Add to Cart</Button>
                                )
                        }
                    </div>
                    <Separator />
                    <div className="max-h-[300px] overflow-auto">
                        <h2 className="text-xl font-bold mb-4">Reviews</h2>
                        <div className="grid gap-6">
                            {
                                reviews && reviews.length > 0 ?
                                    reviews.map((item) => (
                                        <div className="flex gap-4">
                                            <Avatar className="w-10 h-10 border">
                                                <AvatarFallback>{item?.userName[0].toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="grid gap-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold">{item?.userName}</h3>
                                                </div>
                                                <div className="flex items-center gap-0.5">
                                                    <StarRatingComponent rating={item?.reviewValue} />
                                                </div>
                                                <p className="text-muted-foreground">{item?.reviewMessage}</p>
                                            </div>
                                        </div>
                                    ))
                                    :
                                    <h1>No Reviews</h1>
                            }
                        </div>

                    </div>
                    <div className="mt-10 flex flex-col gap-2">
                        <Label>Write a review</Label>
                        <div className="flex gap-1">
                            <StarRatingComponent
                                rating={rating}
                                handleRatingChange={handleRatingChange}
                            />
                        </div>
                        <Input name="reviewMsg" value={reviewMsg} onChange={(e) => setReviewMsg(e.target.value)} placeholder="Write a review..." />
                        <Button onClick={handleAddReview} disabled={reviewMsg.trim() === ''}>Submit</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProductDetailsDialog;