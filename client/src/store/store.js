import { configureStore } from '@reduxjs/toolkit';

import authReducer from "./authSlice";
import adminProductsSlice from "./admin/productSlice";
import adminOrdersSlice from "./admin/orderSlice";

import shopProductsSlice from "./shop/productSlice";
import shopCartSlice from "./shop/cartSlice";
import shopAddressSlice from "./shop/addressSlice";
import shopOrderSlice from "./shop/orderSlice";
import shopSearchSlice from "./shop/searchSlice";
import shopReviewSlice from "./shop/reviewSlice";

import commonFeatureSlice from "./common";

const store = configureStore({
    reducer:{
        auth: authReducer,
        adminProducts : adminProductsSlice,
        adminOrders : adminOrdersSlice,

        shopProducts: shopProductsSlice,
        shopCart: shopCartSlice,
        shopAddress: shopAddressSlice,
        shopOrder: shopOrderSlice,
        shopSearch: shopSearchSlice,
        shopReview: shopReviewSlice,

        commonFeature: commonFeatureSlice
    }
})

export default store;