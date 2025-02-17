import { Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthLogin, AuthRegister } from './pages/auth';
import { AdminLayout, AuthLayout, ShoppingLayout } from './components';
import { AdminDashboard, AdminFeatures, AdminOrders, AdminProducts } from './pages/adminView';
import NotFound from './pages/notFound';
import { PaymentSuccessPage, PaypalReturnPage, SearchProducts, ShoppingAccount, ShoppingCheckOut, ShoppingHome, ShoppingListing } from './pages/shoppingView';
import { CheckAuth } from './components/common';
import UnAuthPage from './pages/unAuthPage';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { checkAuth } from './store/authSlice';
import { Skeleton } from './components/ui/skeleton';



function App() {

  // const isAuthenticated = false;
  // const user = null;
  const { isAuthenticated, user, isLoading } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem('token'));
    dispatch(checkAuth(token));
  }, [dispatch]);

  if (isLoading) {
    return <Skeleton className="w-[800px] bg-black h-[600px]" />
    // Add a spinner or loading state
  }
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      {/* common component */}
      <Routes>
        <Route path='/' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          </CheckAuth>
        } />
        <Route path='/auth' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout />
          </CheckAuth>
        }>
          <Route path='login' element={<AuthLogin />} />
          <Route path='register' element={<AuthRegister />} />
        </Route>
        <Route path='/admin' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout />
          </CheckAuth>
        }>
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='products' element={<AdminProducts />} />
          <Route path='orders' element={<AdminOrders />} />
          <Route path='features' element={<AdminFeatures />} />
        </Route>
        <Route path='/shop' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <ShoppingLayout />
          </CheckAuth>
        }>
          <Route path='home' element={<ShoppingHome />} />
          <Route path='listing' element={<ShoppingListing />} />
          <Route path='checkout' element={<ShoppingCheckOut />} />
          <Route path='account' element={<ShoppingAccount />} />
          <Route path='paypal-return' element={<PaypalReturnPage />} />
          <Route path='paypal-success' element={<PaymentSuccessPage />} />
          <Route path='search' element={<SearchProducts />} />

        </Route>
        <Route path='unauth-page' element={<UnAuthPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
