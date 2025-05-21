// src/components/Emission/DataToggles.jsx
import React from 'react';
import { 
  Box, 
  Typography, 
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { 
  Co2 as Scope1Icon,
  ElectricBolt as Scope2Icon,
  Public as Scope3Icon
} from '@mui/icons-material';

function DataToggles({ toggles, onToggleChange }) {
  const theme = useTheme();

  // Color schemes for scopes and their subcategories
  const colorSchemes = {
    scope1: {
      main: theme.palette.primary.main,
      light: theme.palette.primary.light,
      dark: theme.palette.primary.dark,
      icon: <Scope1Icon fontSize="small" />,
      label: "Scope 1",
      subcategories: {
        scope1_naturalGasHeating: { 
          color: alpha(theme.palette.primary.main, 0.8), 
          label: "Natural Gas Heating" 
        },
        scope1_dieselGenerator: { 
          color: alpha(theme.palette.primary.dark, 0.8), 
          label: "Diesel Generator" 
        },
        scope1_dieselFleet: { 
          color: alpha(theme.palette.primary.light, 0.9), 
          label: "Diesel Fleet" 
        }
      }
    },
    scope2: {
      main: theme.palette.secondary.main,
      light: theme.palette.secondary.light,
      dark: theme.palette.secondary.dark,
      icon: <Scope2Icon fontSize="small" />,
      label: "Scope 2",
      subcategories: {
        scope2_nyGridElectricity: { 
          color: alpha(theme.palette.secondary.main, 0.8), 
          label: "NY Grid Electricity" 
        },
        scope2_mfGridElectricity: { 
          color: alpha(theme.palette.secondary.dark, 0.8), 
          label: "MF Grid Electricity" 
        }
      }
    },
    scope3: {
      main: theme.palette.info.main,
      light: theme.palette.info.light,
      dark: theme.palette.info.dark,
      icon: <Scope3Icon fontSize="small" />,
      label: "Scope 3",
      subcategories: {
        scope3_businessTravel: { 
          color: alpha(theme.palette.info.main, 0.8), 
          label: "Business Travel" 
        },
        scope3_employeeCommuting: { 
          color: alpha(theme.palette.info.dark, 0.8), 
          label: "Employee Commuting" 
        },
        scope3_logistics: { 
          color: alpha(theme.palette.info.light, 0.9), 
          label: "Logistics" 
        },
        scope3_waste: { 
          color: alpha(theme.palette.info.main, 0.6), 
          label: "Waste" 
        }
      }
    }
  };

  // Handle main scope toggle change
  const handleMainToggleChange = (scope, checked) => {
    // Toggle the main scope
    onToggleChange(scope, checked);
    
    // Also toggle all subcategories
    Object.keys(toggles).forEach(key => {
      if (key.startsWith(`${scope}_`)) {
        onToggleChange(key, checked);
      }
    });
  };

  // Get color for a specific toggle key
  const getColor = (key) => {
    // If it's a main scope
    if (colorSchemes[key]) {
      return colorSchemes[key].main;
    }
    
    // If it's a subcategory
    for (const scope in colorSchemes) {
      if (colorSchemes[scope].subcategories[key]) {
        return colorSchemes[scope].subcategories[key].color;
      }
    }
    
    // Default color
    return theme.palette.grey[500];
  };

  // Generate the main scope chips
  const renderMainScopes = () => {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {Object.keys(colorSchemes).map(scope => (
          <Chip
            key={scope}
            icon={colorSchemes[scope].icon}
            label={colorSchemes[scope].label}
            color={scope === 'scope1' ? 'primary' : scope === 'scope2' ? 'secondary' : 'info'}
            variant={toggles[scope] ? 'filled' : 'outlined'}
            onClick={() => handleMainToggleChange(scope, !toggles[scope])}
            sx={{
              fontWeight: toggles[scope] ? 600 : 400,
              '& .MuiChip-icon': {
                color: toggles[scope] 
                  ? 'inherit' 
                  : scope === 'scope1' 
                    ? 'primary.main' 
                    : scope === 'scope2' 
                      ? 'secondary.main' 
                      : 'info.main'
              }
            }}
          />
        ))}
      </Box>
    );
  };

  // Main component render
  return (
    <Box sx={{ mt: 3, mb: 2 }}>
      <Typography variant="subtitle1" fontWeight="600" gutterBottom>
        Data Visualization Controls
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      {/* Main scope chips */}
      {renderMainScopes()}
      
      {/* Detailed subcategories accordion */}
      <Accordion 
        sx={{ 
          boxShadow: 'none', 
          '&:before': { display: 'none' },
          bgcolor: alpha(theme.palette.background.paper, 0.4)
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderRadius: 1
          }}
        >
          <Typography variant="body2" fontWeight="500">
            Detailed Subcategories
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Loop through each main scope to display its subcategories */}
            {Object.keys(colorSchemes).map(scope => (
              <Box key={scope} sx={{ mb: 1 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: colorSchemes[scope].main,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    mb: 0.5
                  }}
                >
                  <FiberManualRecordIcon fontSize="small" sx={{ mr: 0.5, fontSize: 14 }} />
                  {colorSchemes[scope].label} Breakdown
                </Typography>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1,
                    ml: 3,
                    mb: 1.5
                  }}
                >
                  {Object.keys(colorSchemes[scope].subcategories).map(subKey => (
                    <Chip
                      key={subKey}
                      size="small"
                      label={colorSchemes[scope].subcategories[subKey].label}
                      variant={toggles[subKey] ? 'filled' : 'outlined'}
                      onClick={() => onToggleChange(subKey, !toggles[subKey])}
                      sx={{
                        bgcolor: toggles[subKey] 
                          ? colorSchemes[scope].subcategories[subKey].color 
                          : 'transparent',
                        borderColor: colorSchemes[scope].subcategories[subKey].color,
                        color: toggles[subKey] ? 'white' : colorSchemes[scope].subcategories[subKey].color,
                        '&:hover': {
                          bgcolor: toggles[subKey] 
                            ? alpha(colorSchemes[scope].subcategories[subKey].color, 0.9)
                            : alpha(colorSchemes[scope].subcategories[subKey].color, 0.1)
                        }
                      }}
                    />
                  ))}
                </Box>
                
                {scope !== 'scope3' && <Divider sx={{ mt: 1, mb: 1 }} />}
              </Box>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
      
      {/* Legend */}
      <Box 
        sx={{ 
          mt: 2, 
          p: 1.5, 
          borderRadius: 1,
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Typography variant="caption" sx={{ width: '100%', mb: 0.5, color: 'text.secondary' }}>
          Color Legend:
        </Typography>
        
        {/* Generate legend chips for all enabled toggles */}
        {Object.keys(toggles)
          .filter(key => toggles[key])
          .map(key => {
            // Get the appropriate label
            let label = key;
            if (colorSchemes[key]) {
              label = colorSchemes[key].label;
            } else {
              // Find in subcategories
              for (const scope in colorSchemes) {
                if (colorSchemes[scope].subcategories[key]) {
                  label = colorSchemes[scope].subcategories[key].label;
                  break;
                }
              }
            }
            
            return (
              <Box 
                key={key} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  fontSize: '0.75rem',
                  color: 'text.secondary'
                }}
              >
                <Box 
                  sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    mr: 0.5,
                    bgcolor: getColor(key)
                  }} 
                />
                {label}
              </Box>
            );
          })}
      </Box>
    </Box>
  );
}

export default DataToggles;