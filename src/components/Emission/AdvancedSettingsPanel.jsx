// src/components/Emission/AdvancedSettingsPanel.jsx
import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Grid, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function AdvancedSettingsPanel({ colors, onColorChange }) {
  // Define series list for which to provide color pickers
  const seriesList = [
    { key: 'scope1', label: 'Scope 1' },
    { key: 'scope2', label: 'Scope 2' },
    { key: 'scope3', label: 'Scope 3' },
   
  ];

  return (
    <Accordion sx={{ my: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1" fontWeight={600}>
          Advanced Settings
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {seriesList.map(series => (
            <Grid item xs={12} sm={6} md={4} key={series.key}>
              <Box display="flex" alignItems="center">
                <Typography variant="body2" sx={{ minWidth: 100 }}>
                  {series.label} Color:
                </Typography>
                <input 
                  type="color" 
                  value={colors[series.key] || '#000000'} 
                  onChange={(e) => onColorChange(series.key, e.target.value)}
                  aria-label={`${series.label} color picker`}
                  style={{ marginLeft: 8, cursor: 'pointer', padding: 0, border: 'none', backgroundColor: 'transparent' }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

export default AdvancedSettingsPanel;
