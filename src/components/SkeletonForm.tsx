import { Grid2, Skeleton } from '@mui/material';
import React from 'react';

const arraySkeleton = [1, 2, 3];

interface SkeletonFormProps {
  withList?: boolean;
}

function SkeletonForm({ withList }: SkeletonFormProps): React.ReactElement {
  return (
    <Grid2 container>
      {arraySkeleton.map(() =>
        arraySkeleton.map((el) => (
          <Grid2 size={12} key={el} sx={{ sm: 4 }}>
            <Skeleton key={el} variant="rectangular" sx={{ margin: '1.5em', height: 50 }} />
          </Grid2>
        ))
      )}
      {withList && (
        <>
          <Grid2 size={12} sx={{ sm: 4 }}>
            <Skeleton variant="rectangular" sx={{ margin: '1.5em', height: 20 }} />
          </Grid2>
          <Grid2 size={12}>
            <Skeleton variant="rectangular" sx={{ margin: '1.5em', height: 50 }} />
          </Grid2>
        </>
      )}
    </Grid2>
  );
}

SkeletonForm.defaultProps = {
  withList: false,
};

export default SkeletonForm;
