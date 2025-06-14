
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import Preloader from './component/preloader';

const root = ReactDOM.createRoot(document.getElementById('root'));

const Main = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the timeout duration as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <React.StrictMode>
        {loading ? <Preloader /> : <App />}
      </React.StrictMode>
    </BrowserRouter>
  );
};

root.render(<Main />);