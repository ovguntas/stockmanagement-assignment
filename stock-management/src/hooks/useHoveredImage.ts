import { useState } from 'react';

const useHoveredImage = () => {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLElement>,
    imageUrl: string
  ) => {
    const xPosition = event.clientX;
    const yPosition = event.clientY;

    // Ekran boyutlarını alın
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const offsetX = 15; // Resmin yanına biraz boşluk bırakmak için
    const offsetY = 15; // Resmin üstüne biraz boşluk bırakmak için

    const adjustedX = xPosition + 150 + offsetX > screenWidth ? xPosition - 150 - offsetX : xPosition + offsetX;
    const adjustedY = yPosition + 150 + offsetY > screenHeight ? yPosition - 150 - offsetY : yPosition + offsetY;

    const finalX = xPosition + 150 + offsetX > screenWidth ? screenWidth - 150 - offsetX : adjustedX;
    const finalY = yPosition + 150 + offsetY > screenHeight ? screenHeight - 150 - offsetY : adjustedY;

    setHoveredImage(imageUrl);
    setMousePosition({ x: finalX, y: finalY });
  };
  const handleMouseMove = (event: React.MouseEvent<HTMLImageElement>) => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const xPosition = event.clientX;
    const yPosition = event.clientY;
    const offsetX = 15; 
    const offsetY = 15; 
    const adjustedX = xPosition + 150 + offsetX > screenWidth ? xPosition - 150 - offsetX : xPosition + offsetX;
    const adjustedY = yPosition + 150 + offsetY > screenHeight ? yPosition - 150 - offsetY : yPosition + offsetY;
    setMousePosition({ x: adjustedX, y: adjustedY });
  };
  const handleMouseLeave = () => {
    setHoveredImage(null);
  };

  return {
    hoveredImage,
    mousePosition,
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
  };
};

export default useHoveredImage;
