import { Assessment, Face, ShoppingCart, ThumbUp } from '@mui/icons-material';
import { Box, Grid2 } from '@mui/material';
import { cyan, orange, pink, purple } from '@mui/material/colors';
import React from 'react';

import BrowserUsage from '@/components/dashboard/BrowserUsage';
import InfoBox from '@/components/dashboard/InfoBox';
import LineBarChart from '@/components/dashboard/LineBarChart';
import MonthlySales from '@/components/dashboard/MonthlySales';
import NewOrders from '@/components/dashboard/NewOrders';
import data from '@/lib/demo-dashboard';


const styles = {
  pageWrapper: { paddingTop: 60, padding: 20 },
  container: { marginTop: '3em' },
  cell: {
    padding: '1em',
  },
};

export default function DashboardPage(): React.ReactElement {
  return (
    <Box sx={styles.pageWrapper}>
      <Grid2 container spacing={3} sx={styles.container}>
        <Grid2 size={{ xs: 12, md: 3 }} sx={styles.cell}>
          <InfoBox Icon={ShoppingCart} spanBgColor={pink[600]} title="Total Profit" value="1500k" />
        </Grid2>
        {/* <Grid2 size={{ xs: 12, md: 3 }} sx={styles.cell}>
          <InfoBox Icon={ThumbUp} spanBgColor={cyan[600]} title="Likes" value="4231" />
        </Grid2> */}
        {/* <Grid2 size={{ xs: 12, md: 3 }} sx={styles.cell}>
          <InfoBox Icon={Assessment} spanBgColor={purple[600]} title="Sales" value="460" />
        </Grid2> */}
        {/* <Grid2 size={{ xs: 12, md: 3 }} sx={styles.cell}>
          <InfoBox Icon={Face} spanBgColor={orange[600]} title="New Members" value="248" />
        </Grid2> */}
        {/* <Grid2 size={{ xs: 12, md: 6 }} sx={styles.cell}>
          <NewOrders data={data.dashBoardPage.newOrders} />
        </Grid2> */}
        {/* <Grid2 size={{ xs: 12, md: 6 }} sx={styles.cell}>
          <MonthlySales data={data.dashBoardPage.monthlySales} />
        </Grid2> */}
        {/* <Grid2 size={{ xs: 12, md: 6 }} sx={styles.cell}>
          <LineBarChart data={data.dashBoardPage.lineBarChart} />
        </Grid2> */}
        {/* <Grid2 size={{ xs: 12, md: 6 }} sx={styles.cell}>
          <BrowserUsage data={data.dashBoardPage.browserUsage} />
        </Grid2> */}
      </Grid2>
    </Box>
  );
}
