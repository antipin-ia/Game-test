import React, { useRef, useEffect } from 'react';

const CanvasComponent = ({ gameController, onHeroSelect }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    if (gameController) {
      gameController.init(context, canvas);
    }

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      gameController.handleMouseMove(x, y);
    };

    const handleMouseClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const hero = gameController.handleMouseClick(x, y);
      if (hero) {
        onHeroSelect(hero);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleMouseClick);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleMouseClick);
    };
  }, [gameController, onHeroSelect]);

  return <canvas ref={canvasRef} style={{ border: '2px solid black' }} />;
};

export default CanvasComponent;