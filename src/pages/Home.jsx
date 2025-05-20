// src/pages/Home.jsx
import React from 'react';
import { Box } from '@mui/material';
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
        width: '100%',
        minHeight: '100vh',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* All sections are full-width by design */}
      <Hero />
      <TrustedLeaders />
      <ClimateIntelligence />
      <PrecisionInAction />
      <RegulatoryReporting />
      <AdvisoryBoard />
      <SustainabilityStories />
    </Box>
  );
};

export default Home;