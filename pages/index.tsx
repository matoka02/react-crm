import Head from 'next/head';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import AppNavBar from '@/components/menu/AppNavBar';
import AppNavDrawer from '@/components/menu/AppNavDrawer';
import { setAuthState, signOut } from '@/stores/auth/authSlice';
import { AppDispatch, RootState } from '@/stores/store';

import NotFoundPage from './404';
import AboutPage from './about';
import CustomerListPage from './customers';
import CustomerFormPage from './customers/form';
import DashboardPage from './dashboard';
import OrderListPage from './orders';
import OrderFormPage from './orders/form';
import ProductListPage from './products';
import ProductFormPage from './products/form';
import ChangePasswordPage from './users/password';
import SignInPage from './users/signIn';

const drawerWidth = 250;

const getStyles = (navDrawerOpen: boolean, isSmallScreen: boolean) => ({
  appBar: {
    position: 'fixed' as React.CSSProperties['position'],
    top: 0,
    width: navDrawerOpen && !isSmallScreen ? `calc(100% - ${drawerWidth}px)` : '100%',
  },
  drawer: {
    width: isSmallScreen ? drawerWidth : 0,
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    paddingLeft: navDrawerOpen && !isSmallScreen ? drawerWidth : 0,
  },
});

export default function Home() {
  // const { t } = useTranslation();

  // const onClick = () => {
  //   setTimeout(() => {
  //     console.log('clicked');
  //   }, 2000);
  // };

  // return (
  //   <div>
  //     <Head>
  //       <title>Frontend SSR template</title>
  //       <meta
  //         name="description"
  //         content="Frontend SSR template is used for bootstrapping a project."
  //       />
  //     </Head>
  //     <button type="button" onClick={onClick}>
  //       {t('click')}
  //     </button>
  //     <h1>Frontend SSR template</h1>
  //   </div>
  // )

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [isLoaded, setIsLoaded] = useState(false);

  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth <= 600;
  const appStyles = getStyles(navDrawerOpen, isSmallScreen);

  useEffect(() => {
    if (typeof window! !== 'undefined') {
      const token = localStorage.getItem('react-crm-token');
      const storedUser = localStorage.getItem('react-crm-user');

      if (token && storedUser) {
        dispatch(setAuthState({ token, user: JSON.parse(storedUser) }));
      }
      setIsLoaded(true);
    }
  }, [dispatch]);

  if (!isLoaded) return null;

  const handleDrawerToggle = () => setNavDrawerOpen((prev) => !prev);

  const handleSignOut = () => {
    dispatch(signOut());
    router.push('/users/signIn');
  };

  return (
    <>
      <Head>
        <title>Frontend SSR template</title>
        <meta
          name="description"
          content="Frontend SSR template is used for bootstrapping a project."
        />
      </Head>
      {isAuthenticated ? (
        <>
          <AppNavBar styles={appStyles} handleDrawerToggle={handleDrawerToggle} />
          <AppNavDrawer
            drawerStyle={appStyles.drawer}
            navDrawerOpen={navDrawerOpen}
            username={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`}
            onSignoutClick={handleSignOut}
            onChangePassClick={() => router.push('/password')}
            handleDrawerToggle={handleDrawerToggle}
            isSmallScreen={isSmallScreen}
          />
          <main style={appStyles.content}>
            {pathname === '/' && <DashboardPage />}
            {pathname === '/customers' && <CustomerListPage />}
            {pathname === '/customers/form' && <CustomerFormPage />}
            {pathname === '/orders' && <OrderListPage />}
            {pathname === '/orders/form' && <OrderFormPage />}
            {pathname === '/products' && <ProductListPage />}
            {pathname === '/products/form' && <ProductFormPage />}
            {pathname === '/about' && <AboutPage />}
            {pathname === '/users/password' && <ChangePasswordPage />}
            {pathname === '/404' && <NotFoundPage />}
          </main>
        </>
      ) : (
        <SignInPage />
      )}
    </>
  );
}
