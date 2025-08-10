import React, { useEffect, useState } from 'react';
import './Preloader.css';
import logo from '../component/img/1.png'; // Adjust the path to your logo image

const Preloader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let direction = 1;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) direction = -1;
        if (prev <= 0) direction = 1;
        return prev + direction * 2;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="preloader">
      <div className="loader">
        <img src={logo} alt="Logo" className="logo" />
        <div className="loader_bar">
          <div
            className="loader_bar_fill"
            style={{ width: `${progress}%` }}
            id="loaderBar"
          ></div>
        </div>
        <span className="loader_text" id="loaderText">{progress}%</span>
      </div>
    </div>
  );
};

export default Preloader;