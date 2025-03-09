import Head from 'next/head';
import React, { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import DashboardPage from './dashboard';

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

  return <DashboardPage/>
}
