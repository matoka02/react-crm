import { Skeleton } from '@mui/material';
import React from 'react';

const arraySkeleton = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function SkeletonList(): React.ReactElement {
  return (
    <>
      {arraySkeleton.map((i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          sx={{ margin: '1.5em', width: '95%', height: 40 }}
        />
      ))}
    </>
  );
}

export default SkeletonList;
