// src/components/Emission/DataToggles.jsx
import React from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

function DataToggles({ toggles, onToggleChange }) {
  return (
    <FormControl component="fieldset" variant="standard">
      <FormLabel component="legend" sx={{ fontWeight: 500, marginBottom: 1 }}>
        Data Series
      </FormLabel>
      <FormGroup row sx={{ flexWrap: 'wrap', gap: 2 }}>
        {/* Each checkbox corresponds to a data series toggle */}
        {Object.keys(toggles).map((key) => (
          <FormControlLabel
            key={key}
            control={
              <Checkbox 
                checked={toggles[key]} 
                onChange={(e) => onToggleChange(key, e.target.checked)} 
              />
            }
            label={formatLabel(key)}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
}

// Helper to format toggle keys to user-friendly labels
function formatLabel(key) {
  switch (key) {
    case 'scope1': return 'Scope 1';
    case 'scope2': return 'Scope 2';
    case 'scope3': return 'Scope 3';
    case 'forecast': return 'Forecast';
    case 'target': return 'Target';
    case 'sbt': return 'SBT';
    case 'initiatives': return 'Initiatives';
    default: return key;
  }
}

export default DataToggles;
