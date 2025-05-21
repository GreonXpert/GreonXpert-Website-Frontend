// src/components/Emission/ChartControls.jsx
import React from 'react';
import { 
  Box, 
  Grid, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography, 
  Divider,
  Paper,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import PieChartIcon from '@mui/icons-material/PieChart';
import AreaChartIcon from '@mui/icons-material/StackedLineChart';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function ChartControls({ 
  title, 
  startYear, 
  endYear, 
  chartType, 
  onTitleChange, 
  onStartYearChange, 
  onEndYearChange, 
  onChartTypeChange 
}) {
  const theme = useTheme();

  const chartTypeIcons = {
    line: <TimelineIcon />,
    area: <AreaChartIcon />,
    bar: <BarChartIcon />,
    pie: <PieChartIcon />
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        padding: 3, 
        mb: 3,
        backgroundImage: `linear-gradient(to right, ${theme.palette.background.paper}, ${theme.palette.grey[100]})`,
        borderLeft: `4px solid ${theme.palette.primary.main}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: `0 8px 24px rgba(26, 201, 159, 0.15)`,
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography 
          variant="h5" 
          fontWeight={600} 
          color="primary.dark"
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            '&::after': {
              content: '""',
              display: 'block',
              width: '60px',
              height: '3px',
              backgroundColor: theme.palette.primary.light,
              marginLeft: 2,
              borderRadius: '2px'
            }
          }}
        >
          Chart Configuration
        </Typography>
        <Tooltip title="Configure your emissions chart visualization">
          <IconButton size="small" sx={{ color: theme.palette.info.main }}>
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Divider sx={{ mb: 3, opacity: 0.7 }} />
      
      <Grid container spacing={3} alignItems="center">
        {/* Start Year Selector */}
        <Grid item xs={6} md={3}>
          <TextField 
            label="Start Year" 
            type="number" 
            value={startYear} 
            onChange={(e) => onStartYearChange(Number(e.target.value))}
            variant="outlined" 
            size="small" 
            fullWidth 
            inputProps={{ min: 1900, max: 2100 }}
            sx={{
              '& .MuiInputLabel-root': {
                color: theme.palette.secondary.main,
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.secondary.main,
              }
            }}
          />
        </Grid>
        
        {/* End Year Selector */}
        <Grid item xs={6} md={3}>
          <TextField 
            label="End Year" 
            type="number" 
            value={endYear} 
            onChange={(e) => onEndYearChange(Number(e.target.value))}
            variant="outlined" 
            size="small" 
            fullWidth 
            inputProps={{ min: 1900, max: 2100 }}
            sx={{
              '& .MuiInputLabel-root': {
                color: theme.palette.secondary.main,
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.secondary.main,
              }
            }}
          />
        </Grid>
        
        {/* Chart Type Dropdown */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: theme.palette.secondary.main }}>Chart Type</InputLabel>
            <Select
              label="Chart Type"
              value={chartType}
              onChange={(e) => onChartTypeChange(e.target.value)}
              sx={{
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.secondary.main,
                }
              }}
              startAdornment={chartType && (
                <Box sx={{ mr: 1, color: theme.palette.primary.main }}>
                  {chartTypeIcons[chartType]}
                </Box>
              )}
            >
              <MenuItem value="line">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>Line Chart</Typography>
                </Box>
              </MenuItem>
              <MenuItem value="area">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>Area Chart</Typography>
                </Box>
              </MenuItem>
              <MenuItem value="bar">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>Bar Chart</Typography>
                </Box>
              </MenuItem>
              <MenuItem value="pie">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>Pie Chart</Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      <Box 
        sx={{ 
          mt: 2.5,
          p: 1.5,
          backgroundColor: theme.palette.grey[100],
          borderRadius: 2,
          border: `1px dashed ${theme.palette.grey[300]}`,
        }}
      >
        <Typography 
          variant="body2" 
          fontWeight={500}
          sx={{ 
            color: theme.palette.text.secondary,
            display: 'flex',
            alignItems: 'center',
            '& svg': {
              mr: 0.5,
              color: theme.palette.info.main,
              fontSize: '1rem'
            }
          }}
        >
          <InfoOutlinedIcon />
          Use the toggles below to select which emission sources to display on the chart.
        </Typography>
      </Box>
    </Paper>
  );
}

export default ChartControls;