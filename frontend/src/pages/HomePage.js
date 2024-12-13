import React, { useContext, useEffect, useState } from 'react';
import './HomePage.css';

const HomePage = () => {
  const [message, setMessage] = useState("Welcome to the Cultural Programme Finder!");

  useEffect(() => {
    document.title = "Home Page";
  }, []);

  return (
    <div className="container">
      <div className="content">
        <h1>{message}</h1>
        <p>Please login to access all feature.</p>
      </div>
      <footer className="footer">
        <div className="footer-content">
          <p>Source from</p>
          <a href="https://data.gov.hk/en-data/dataset/hk-lcsd-event-event-cultural">
            <img src="https://data.gov.hk/assets/shared/img/facebook_og-image.jpg" alt="Cultural Events" className="footer-image" />
          </a>
          <a href="https://www.lcsd.gov.hk/tc/">
            <img src="https://www.lcsd.gov.hk/common/coresite/images/banner_tc_resp.png" alt="LCSD Banner" className="footer-image" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
