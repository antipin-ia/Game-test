import React, { useState, useEffect } from 'react';

const SettingsMenu = ({ hero, onUpdateSettings }) => {
  const [bulletColor, setBulletColor] = useState(hero.bulletColor);
  const [fireRate, setFireRate] = useState(hero.fireRate);
  const [speed, setSpeed] = useState(hero.speed);

  useEffect(() => {
    setBulletColor(hero.bulletColor);
    setFireRate(hero.fireRate);
    setSpeed(hero.speed);
  }, [hero]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onUpdateSettings({ bulletColor, fireRate, speed });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Bullet Color:
        <input type="color" value={bulletColor} onChange={(e) => setBulletColor(e.target.value)} />
      </label>
      <label>
        Fire Rate:
        <input type="range" min="100" max="2000" value={fireRate} onChange={(e) => setFireRate(e.target.value)} />
      </label>
      <label>
        Speed:
        <input type="range" min="1" max="10" value={speed} onChange={(e) => setSpeed(e.target.value)} />
      </label>
      <button type="submit">Apply</button>
    </form>
  );
};

export default SettingsMenu;