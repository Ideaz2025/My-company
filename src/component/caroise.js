import React, { useEffect } from 'react';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "boxicons/css/boxicons.min.css";
import 'aos/dist/aos.css'; // Import AOS CSS
import AOS from 'aos'; // Import AOS
import Ava from './img/hero-img.png';
import ava1 from './img/why-us.png';

import Accordion from 'react-bootstrap/Accordion';
function HeroCarousel() {
  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS with a duration of 1000ms
  }, []);

  return (
    <>
      <div id="hero" className="d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-1" data-aos="fade-up" data-aos-delay="200">
              <h1>Better Solutions For Your Business</h1>
              <h2>Conveys a sense of creativity, imagination, and forward-thinking</h2>
              <div className="d-flex justify-content-center justify-content-lg-start">
                <p className="btn-get-started scrollto">Get Started</p>
                <span className="glightbox btn-watch-video"><i className="bi bi-play-circle"></i><span>Watch Video</span></span>
              </div>
            </div>
            <div className="col-lg-6 order-1 order-lg-2 hero-img" data-aos="zoom-in" data-aos-delay="200">
              <img src={Ava} alt="Hero" className="img-fluid" />
            </div>
          </div>
        </div>
      </div>

      <section id="why-us" className="why-us section-bg" >
        <div className="container-fluid" data-aos="fade-up">
          <div className="row">
            <div className="col-md-7 d-flex flex-column justify-content-center align-items-stretch order-2 order-lg-1">
              <div className="content">
                <h3>BUILDING TEAMS FROM SCRATCH</h3>
                <p>
                  We are challenging ourselves to create the next market standard in terms of scalability, agility, and technology. And we need you to get there!
                </p>
              </div>
              <div className="accordion-list">
                <Accordion defaultActiveKey="0">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header style={{ backgroundColor: '#041f3a' }}>Design Team</Accordion.Header>
                    <Accordion.Body>
                      The Design team is responsible for creating the visual and interactive elements of a website, ensuring it is both aesthetically pleasing and user-friendly. Here are some key aspects of what the Design team typically handles.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Digital Team</Accordion.Header>
                    <Accordion.Body>
                      The Digital Team focuses on leveraging digital channels to promote and grow the business. This includes managing social media platforms, creating digital marketing campaigns, optimizing content for search engines (SEO), and analyzing digital performance metrics. The team ensures that the company's online presence is strong and engaging, driving traffic and conversions through various digital strategies.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>Development Team</Accordion.Header>
                    <Accordion.Body>
                      The Development team is responsible for building and maintaining the functional aspects of a website, including its backend logic, frontend functionality, and integrations with external systems. Here are some key aspects of what the Development team typically handles.
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </div>
            <div className="col-md-5 align-items-stretch order-1 order-lg-2 img" data-aos="zoom-in" data-aos-delay="150">
              <img src={ava1} alt="Why Us" className='img-fluid'/>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroCarousel;