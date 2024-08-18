import React, { useState } from 'react';
import CanvasComponent from './CanvasComponent';
import SettingsMenu from './SettingsMenu';
import GameController from './GameController';

const App = () => {
  const [selectedHero, setSelectedHero] = useState(null);
  const gameController = new GameController();

  const handleUpdateSettings = (settings) => {
    gameController.updateSettings(settings);
  };

  const handleHeroSelect = (hero) => {
    setSelectedHero(hero);
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