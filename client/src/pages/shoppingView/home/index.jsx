import { Button } from "@/components/ui/button";
import HM from "../../../assets/hm.svg";
import Zara from "../../../assets/zara.svg";
import Levis from "../../../assets/levis.svg";
import Puma from "../../../assets/puma.svg";
import Adidas from "../../../assets/adidas.svg";
import Nike from "../../../assets/nike.svg";


import { BabyIcon, ChevronLeftIcon, ChevronRightIcon, CloudLightning, ShirtIcon, UmbrellaIcon, WatchIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/productSlice";
import ShoppingProductTile from "@/components/shoppingView/productTile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cartSlice";
import { toast } from "@/hooks/use-toast";
import ProductDetailsDialog from "@/components/shoppingView/productDetails";
import { getFeatureImages } from "@/store/common";

const categoriesWithIcons = [
    { id: "men", label: "Men", icon: ShirtIcon },
    { id: "women", label: "Women", icon: CloudLightning },
    { id: "kids", label: "Kids", icon: BabyIcon },
    { id: "accessories", label: "Accessories", icon: WatchIcon },
    { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithLogos = [
    { id: "nike", label: "Nike", logo: Nike },
    { id: "adidas", label: "Adidas", logo: Adidas },
    { id: "puma", label: "Puma", logo: Puma },
    { id: "levi", label: "Levi's", logo: Levis },
    { id: "zara", label: "Zara", logo: Zara },
    { id: "h&m", label: "H&M", logo: HM },
];

function ShoppingHome() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const { productList, productDetails } = useSelector(state => state.shopProducts);
    const { featureImageList } = useSelector(state => state.commonFeature);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prevSlide => (prevSlide + 1) % featureImageList.length);
        }, 5000)

        return () => clearInterval(timer);
    }, [featureImageList])

    useEffect(() => {
        dispatch(fetchAllFilteredProducts({ filtersParams: {}, sortParams: 'price-lowtohigh' }));
    }, [dispatch])

    useEffect(() => {
        if (productDetails !== null) {
            setOpenDetailsDialog(true);
        }
    }, [productDetails])

    function handleNavigateToListingPage(getCurrentItem, section) {
        sessionStorage.removeItem('filters');
        const currentFilters = {
            [section]: [getCurrentItem.id]
        }
        sessionStorage.setItem('filters', JSON.stringify(currentFilters));
        navigate(`/shop/listing`);
    }

    function handleGetProductDetails(getCurrentProductId) {
        dispatch(fetchProductDetails(getCurrentProductId));
    }

    function handleAddToCart(getCurrentProductId) {
        console.log(getCurrentProductId, "productId");
        dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 }))
            .then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchCartItems(user?.id));
                    toast({
                        title: "Product added to cart successfully",
                    })
                }
            });
    }
    useEffect(() => {
        dispatch(getFeatureImages());
    }, [dispatch])
    return (
        <div className="flex flex-col min-h-screen">
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
                <div className="md:hidden flex">
                    {featureImageList && featureImageList.length > 0
                        ? featureImageList.map((item, index) => (
                            <div
                                key={index}
                                className={` h-[300px] transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
                                    }`}
                            >
                                <img
                                    src={item?.image}
                                    className={`${index === currentSlide ? "opacity-100" : "opacity-0"} absolute top-0 left-0 h-[190px] w-full transition-opacity duration-1000`}
                                    alt={`Banner ${index + 1}`}
                                    style={{ resize: 'cover' }}
                                />
                            </div>
                        ))
                        :
                        null
                    }
                </div>
                <div className="hidden md:block">
                    {
                        featureImageList.map((slide, index) => (
                            <img
                                src={slide?.image}
                                key={index}
                                className={`${index === currentSlide ? "opacity-100" : "opacity-0"} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
                            />
                        ))
                    }
                </div>
                <Button onClick={() => setCurrentSlide(prevSlide => (prevSlide - 1 + featureImageList.length) % featureImageList.length)} variant="outline" size="icon" className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80">
                    <ChevronLeftIcon className="w-4 h-4" />
                </Button>
                <Button onClick={() => setCurrentSlide(prevSlide => (prevSlide + 1 + featureImageList.length) % featureImageList.length)} variant="outline" size="icon" className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80">
                    <ChevronRightIcon className="w-4 h-4" />
                </Button>
            </div>
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">Shop by category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {
                            categoriesWithIcons.map((item) => (
                                <Card onClick={() => handleNavigateToListingPage(item, 'category')} className="cursor-pointer hover:shadow-lg transition-shadow">
                                    <CardContent className="flex flex-col items-center justify-center p-6">
                                        <item.icon className="w-20 h-20 mb-4 text-primary" />
                                        <span className="font-bold">{item.label}</span>
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>
                </div>
            </section>
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">Shop by brand</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {
                            brandsWithLogos.map((item) => (
                                <Card onClick={() => handleNavigateToListingPage(item, 'brand')} className="cursor-pointer hover:shadow-lg transition-shadow">
                                    <CardContent className="flex flex-col items-center justify-center p-6">
                                        <img src={item.logo} alt={item.label} className="w-20 h-20 mb-4 text-primary" />
                                        <span className="font-bold">{item.label}</span>
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>
                </div>
            </section>
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {
                            productList && productList.length > 0 ?
                                productList.map((item) => (
                                    <ShoppingProductTile
                                        handleGetProductDetails={handleGetProductDetails}
                                        product={item}
                                        handleAddToCart={handleAddToCart}
                                    />
                                ))
                                :
                                null
                        }
                    </div>
                </div>
            </section>
            <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
        </div>
    )
}

export default ShoppingHome;