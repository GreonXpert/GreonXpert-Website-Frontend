// src/components/Emission/EmissionsStats.jsx
import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  useTheme, 
  alpha, 
  Tooltip,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  TrendingDown as DecreaseIcon,
  TrendingUp as IncreaseIcon,
  Insights as InsightsIcon,
  Co2 as CO2Icon
} from '@mui/icons-material';

function EmissionsStats({ totalEmissions, reductionPercentage, trackedScopes }) {
  const theme = useTheme();
  
  // Format numbers with commas for thousands separators
  const formatNumber = (num) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 1 });
  };
  
  // Determine color based on value for trending indicators
  const getTrendColor = (value) => {
    if (value > 0) return theme.palette.success.main;
    if (value < 0) return theme.palette.error.main;
    return theme.palette.text.secondary;
  };
  
  // Get icon for trend
  const getTrendIcon = (value) => {
    if (value > 0) return <DecreaseIcon sx={{ fontSize: 16 }} />;
    if (value < 0) return <IncreaseIcon sx={{ fontSize: 16 }} />;
    return null;
  };

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {/* Total Emissions Card */}
      <Grid item xs={12} md={4}>
        <Card sx={{ 
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.15)}`
          }
        }}>
          <CardContent sx={{ pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" variant="subtitle2" fontWeight="medium">
                  Total Emissions
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1 }}>
                  <Typography variant="h4" fontWeight="bold">
                    {formatNumber(totalEmissions)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    tCO₂e
                  </Typography>
                </Box>
              </Box>
              <Box 
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1), 
                  borderRadius: '50%',
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CO2Icon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
              </Box>
            </Box>
            
            <Divider sx={{ my: 1.5 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: getTrendColor(reductionPercentage)
                }}
              >
                {getTrendIcon(reductionPercentage)}
                <Typography 
                  variant="body2" 
                  sx={{ ml: 0.5, fontWeight: 'medium' }}
                >
                  {Math.abs(reductionPercentage).toFixed(1)}% vs baseline
                </Typography>
              </Box>
            </Box>
          </CardContent>
          
          {/* Add a subtle bar at the bottom for visual effect */}
          <Box sx={{ height: 4, bgcolor: theme.palette.primary.main, position: 'absolute', bottom: 0, left: 0, right: 0 }} />
        </Card>
      </Grid>
      
      {/* Reduction Percentage Card */}
      <Grid item xs={12} md={4}>
        <Card sx={{ 
          boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.1)}`,
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: `0 6px 16px ${alpha(theme.palette.success.main, 0.15)}`
          }
        }}>
          <CardContent sx={{ pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" variant="subtitle2" fontWeight="medium">
                  Reduction vs Baseline
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1 }}>
                  <Typography 
                    variant="h4" 
                    fontWeight="bold" 
                    color={reductionPercentage > 0 ? "success.main" : "error.main"}
                  >
                    {reductionPercentage > 0 ? "+" : ""}{reductionPercentage.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
              <Box 
                sx={{ 
                  bgcolor: alpha(reductionPercentage > 0 ? theme.palette.success.main : theme.palette.error.main, 0.1), 
                  borderRadius: '50%',
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {reductionPercentage > 0 ? 
                  <DecreaseIcon sx={{ color: theme.palette.success.main, fontSize: 24 }} /> : 
                  <IncreaseIcon sx={{ color: theme.palette.error.main, fontSize: 24 }} />
                }
              </Box>
            </Box>
            
            <Divider sx={{ my: 1.5 }} />
            
            <Box sx={{ mt: 0.5 }}>
              <Tooltip 
                title={`${Math.abs(reductionPercentage).toFixed(1)}% ${reductionPercentage > 0 ? 'decrease' : 'increase'} in emissions compared to baseline year`}
                arrow
              >
                <Box sx={{ width: '100%', position: 'relative' }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(Math.abs(reductionPercentage), 100)} 
                    color={reductionPercentage > 0 ? "success" : "error"} 
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                </Box>
              </Tooltip>
            </Box>
          </CardContent>
          
          {/* Add a subtle bar at the bottom for visual effect */}
          <Box sx={{ 
            height: 4, 
            bgcolor: reductionPercentage > 0 ? theme.palette.success.main : theme.palette.error.main, 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0 
          }} />
        </Card>
      </Grid>
      
      {/* Tracked Scopes Card */}
      <Grid item xs={12} md={4}>
        <Card sx={{ 
          boxShadow: `0 4px 12px ${alpha(theme.palette.info.main, 0.1)}`,
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: `0 6px 16px ${alpha(theme.palette.info.main, 0.15)}`
          }
        }}>
          <CardContent sx={{ pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" variant="subtitle2" fontWeight="medium">
                  Tracked Scopes
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1 }}>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {trackedScopes}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    emission {trackedScopes === 1 ? 'scope' : 'scopes'}
                  </Typography>
                </Box>
              </Box>
              <Box 
                sx={{ 
                  bgcolor: alpha(theme.palette.info.main, 0.1), 
                  borderRadius: '50%',
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <InsightsIcon sx={{ color: theme.palette.info.main, fontSize: 24 }} />
              </Box>
            </Box>
            
            <Divider sx={{ my: 1.5 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Tooltip title="Scope 1 tracked" arrow>
                <Box 
                  sx={{ 
                    width: 60, 
                    height: 10, 
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.primary.main, trackedScopes >= 1 ? 1 : 0.2)
                  }} 
                />
              </Tooltip>
              <Tooltip title="Scope 2 tracked" arrow>
                <Box 
                  sx={{ 
                    width: 60, 
                    height: 10, 
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.secondary.main, trackedScopes >= 2 ? 1 : 0.2)
                  }} 
                />
              </Tooltip>
              <Tooltip title="Scope 3 tracked" arrow>
                <Box 
                  sx={{ 
                    width: 60, 
                    height: 10, 
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.info.main, trackedScopes >= 3 ? 1 : 0.2)
                  }} 
                />
              </Tooltip>
            </Box>
          </CardContent>
          
          {/* Add a subtle bar at the bottom for visual effect */}
          <Box sx={{ height: 4, bgcolor: theme.palette.info.main, position: 'absolute', bottom: 0, left: 0, right: 0 }} />
        </Card>
      </Grid>
    </Grid>
  );
}

export default EmissionsStats;