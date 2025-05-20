// src/components/Emission/EmissionsStats.jsx
import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

function EmissionsStats({ totalEmissions, reductionPercentage, trackedScopes }) {
  return (
    <Grid container spacing={2}>
      {/* Total Emissions Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" variant="subtitle2">
              Total Emissions
            </Typography>
            <Typography variant="h5">
              {Math.round(totalEmissions)} 
              <Typography component="span" variant="h6" color="textSecondary">{" "}ton CO₂e</Typography>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      {/* Reduction Percentage Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" variant="subtitle2">
              Reduction %
            </Typography>
            <Typography variant="h5">
              {reductionPercentage.toFixed(1)}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      {/* Tracked Scopes Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" variant="subtitle2">
              Tracked Scopes
            </Typography>
            <Typography variant="h5">
              {trackedScopes}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default EmissionsStats;
