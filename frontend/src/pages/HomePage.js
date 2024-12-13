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
        <p>Login to access all features of Cultural Programme Finder.</p>

        <div id="carouselExampleIndicators" className="carousel slide carousel-small" data-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <a href="https://www.lcsd.gov.hk/en/stth/facilities/auditorium.html">
                <img src="https://www.lcsd.gov.hk/en/stth/common/images/Template%203/Image/AUD/STTH%20Auditorium4.jpg" className="d-block w-100" alt="Sha Tin Town Hall Auditorium" />
              </a>
              <div className="carousel-caption-outside">
                <h5>Sha Tin Town Hall Auditorium</h5>
              </div>
            </div>
            <div className="carousel-item">
              <a href="https://www.lcsd.gov.hk/en/hkcc/facilities/concerthall.html">
                <img src="https://www.lcsd.gov.hk/en/hkcc/common/images/template3/Concert%20Hall/facilities_concert_hall_1.jpg" className="d-block w-100" alt="Hong Kong Cultural Centre Concert Hall" />
              </a>
              <div className="carousel-caption-outside">
                <h5>Hong Kong Cultural Centre Concert Hall</h5>
              </div>
            </div>
            <div className="carousel-item">
              <a href="https://www.lcsd.gov.hk/en/hkch/facilities/hiringfacilities/concerthall.html">
                <img src="https://www.lcsd.gov.hk/en/hkch/common/images/concert_hall/ConcertHall01.jpg" className="d-block w-100" alt="Hong Kong City Hall Concert Hall" />
              </a>
              <div className="carousel-caption-outside">
                <h5>Hong Kong City Hall Concert Hall</h5>
              </div>
            </div>
          </div>
          <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="sr-only">Previous</span>
          </a>
          <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="sr-only">Next</span>
          </a>
          <ol className="carousel-indicators">
            <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
          </ol>
        </div>
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
