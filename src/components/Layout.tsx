import Head from 'next/head';
import { usePathname, useRouter } from 'next/navigation';
import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setAuthState, signOut } from '@/stores/auth/authSlice';
import { AppDispatch, RootState } from '@/stores/store';
import SignInPage from 'pages/users/signIn';

import AppNavBar from './menu/AppNavBar';
import AppNavDrawer from './menu/AppNavDrawer';

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

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps): React.ReactElement | null {
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

  const handleChangePass = () => {
    router.push('/users/password');
  };

  // Excluded routes (where we don't show navigation)
  const excludedPaths = ['/users/signIn', '/404'];
  const shouldShowNav = !excludedPaths.includes(pathname);

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
          {shouldShowNav && (
            <>
              <AppNavBar styles={appStyles} handleDrawerToggle={handleDrawerToggle} />
              <AppNavDrawer
                drawerStyle={appStyles.drawer}
                navDrawerOpen={navDrawerOpen}
                username={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`}
                onSignoutClick={handleSignOut}
                onChangePassClick={handleChangePass}
                handleDrawerToggle={handleDrawerToggle}
                isSmallScreen={isSmallScreen}
              />
            </>
          )}
          <main style={appStyles.content}>{children}</main>
        </>
      ) : (
        <SignInPage />
      )}
    </>
  );
}
export default Layout;
