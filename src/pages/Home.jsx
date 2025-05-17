// src/pages/Home.jsx
import React from 'react';
import { Box, Container } from '@mui/material';
import Hero from '../components/Home/Hero';
import TrustedLeaders from '../components/Home/TrustedLeaders';
import ClimateIntelligence from '../components/Home/ClimateIntelligence';
import PrecisionInAction from '../components/Home/PrecisionInAction';
import RegulatoryReporting from '../components/Home/RegulatoryReporting';
import AdvisoryBoard from '../components/Home/AdvisoryBoard';
import SustainabilityStories from '../components/Home/SustainabilityStories';

const Home = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100vh',
        mx: 'auto',
        bgcolor: 'background.default'
      }}
    >
      {/* Full-width sections with centered content */}
      <Box sx={{ width: '100%' }}>
        {/* Hero Section */}
        <Hero />
      </Box>

      <Box sx={{ width: '100%' }}>
        {/* Trusted Leaders Section */}
        <TrustedLeaders />
      </Box>

      <Box sx={{ width: '100%' }}>
        {/* ClimateIntelligence Section */}    
        <ClimateIntelligence />
        </Box>

       <Box sx={{ width: '100%' }}>
        {/* PrecisionInAction Section */}    
        <PrecisionInAction />
        </Box>

        <Box sx={{ width: '100%' }}>
        {/* Regulatory Reporting Simplified */}
        <RegulatoryReporting />
        </Box>
        
        <Box sx={{ width: '100%' }}>
        {/* Advisory Board */}
        <AdvisoryBoard />
        </Box>
        
        <Box sx={{ width: '100%' }}>
        {/* Sustainablity Stories */}
        <SustainabilityStories />
        </Box>
      
      {/* Add more home page sections here as needed */}
    </Box>
  );
};

export default Home;


