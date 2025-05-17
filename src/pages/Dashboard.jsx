// src/pages/Dashboard.jsx
import React from 'react';
import { Box, Typography, Paper, Grid, Container } from '@mui/material';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  // Define the stats data to match your screenshot
  const statsData = [
    { label: 'Pages', value: '0', color: 'primary.main' },
    { label: 'Components', value: '19', color: 'primary.main' },
    { label: 'Users', value: '55', color: 'primary.main' },
    { label: 'Media', value: '3', color: 'primary.main' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, Admin! Here's what's happening with your website.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
              elevation={1}
            >
              <Typography variant="h3" component="div" fontWeight="bold" color={stat.color}>
                {stat.value}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Total {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }} elevation={1}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No recent activities to display.
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }} elevation={1}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Actions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You can manage your website content from the sidebar menu.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;