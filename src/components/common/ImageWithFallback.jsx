// src/components/common/ImageWithFallback.jsx
import React, { useState } from 'react';
import { Box, CardMedia, Avatar } from '@mui/material';
import { getFullImageUrl } from '../../services/imageHelper';

/**
 * Image component with fallback to Avatar when image fails to load
 * 
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for the image
 * @param {number} props.height - Height of the image container
 * @param {string} props.name - Name to use for avatar initials if image fails to load
 * @param {Object} props.sx - Style overrides
 */
const ImageWithFallback = ({ src, alt, height = 140, name = '', sx = {} }) => {
  const [imageError, setImageError] = useState(false);

  // Use the full URL for the image
  const fullImageUrl = getFullImageUrl(src);
  
  // Generate initials from name for the avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Handle image loading errors
  const handleError = () => {
    console.warn(`Image failed to load: ${fullImageUrl}`);
    setImageError(true);
  };

  return (
    <Box sx={{ position: 'relative', height, ...sx }}>
      {!imageError && src ? (
        <CardMedia
          component="img"
          height={height}
          image={fullImageUrl}
          alt={alt}
          sx={{ objectFit: 'cover' }}
          onError={handleError}
        />
      ) : (
        <Box 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: 'primary.light',
            opacity: 0.7
          }}
        >
          <Avatar 
            sx={{ 
              width: height * 0.6, 
              height: height * 0.6,
              bgcolor: 'primary.main', 
              fontSize: height * 0.25
            }}
          >
            {getInitials(name)}
          </Avatar>
        </Box>
      )}
    </Box>
  );
};

export default ImageWithFallback;