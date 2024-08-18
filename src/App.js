import React, { useState } from 'react';
import CanvasComponent from './CanvasComponent';
import SettingsMenu from './SettingsMenu';
import GameController from './GameController';

const gameController = new GameController();
const App = () => {
  const [selectedHero, setSelectedHero] = useState(null);

  const handleUpdateSettings = (settings) => {
    console.log('handleUpdateSettings', handleUpdateSettings)
    gameController.updateSettings(settings);
  };

  const handleHeroSelect = (hero) => {
    setSelectedHero(hero);
    gameController.selectedHero = hero; // Сохранение выбранного героя непосредственно в GameController
  };
  
  return (
    <div>
      <CanvasComponent
        gameController={gameController}
        onHeroSelect={handleHeroSelect}
      />
      {selectedHero && <SettingsMenu hero={selectedHero} onUpdateSettings={handleUpdateSettings} />}
    </div>
  );
};

export default App;