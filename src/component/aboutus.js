import React from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import './style.css';
import img from './img/portfolio-1.jpg';
import ava1 from './img/portfolio-2.jpg';
import ava2 from './img/portfolio-3.jpg';
import ava3 from './img/portfolio-4.jpg';
import ava4 from './img/portfolio-5.jpg';
import munees from './img/munees1.jpeg';
import selva from './img/selva.jpeg';
import Kanagu from './img/kanagaraj.jpg';
import rao from './img/rao.jpeg';
import { Link } from 'react-router-dom';
import { Facebook, GitHub, Instagram, LinkedIn, Twitter } from '@mui/icons-material';
import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';

const TeamMember = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AboutUs() {
  return (
    <>
      <section id="cta" className="cta">
        <div className="container" data-aos="zoom-in">
          <div className="row">
            <div className="col-lg-9 text-center text-lg-start">
              <h3>WHY OPEN TAG</h3>
              <p>Creating the level of product with level of scale the business requires, provides a exceptional challenge, and so we have an exceptional team that have comman dream to relize. The experience in open tag</p>
            </div>
            <div className="col-lg-3 cta-btn-container text-center">
              <Link to="/form" className="cta-btn align-middle">JOIN A TEAM</Link>
            </div>
          </div>
        </div>
      </section>
      <div className="container text-center mt-5">
        <h1>ABOUT US</h1>
        <center>
          <Card style={{ width: '58rem' }} className='mt-5'>
            <Card.Body>
              <Card.Title> </Card.Title>
              <Card.Text>
                Welcome to Ideaz! We are a team of passionate individuals dedicated to providing top-notch services in web development, graphic design, digital marketing, and UI/UX design. Our mission is to help businesses achieve their goals through innovative solutions and exceptional support.
              </Card.Text>
            </Card.Body>
          </Card>
        </center>
      </div>

      <section id="portfolio" className="portfolio">
        <div className="container" data-aos="fade-up">
          <div className="section-title">
            <h2 className='text-center mt-5'>Portfolio</h2>
            <p className='text-center'>
              Explore our portfolio to see a collection of our best work, showcasing our expertise and creativity across a range of projects and industries
            </p>
          </div>
          <ul id="portfolio-flters" className="d-flex justify-content-center mt-3" data-aos="fade-up" data-aos-delay="100">
            <li data-filter="*" className="filter-active">All</li>
            <li data-filter=".filter-app">App</li>
            <li data-filter=".filter-card">Card</li>
            <li data-filter=".filter-web">Web</li>
          </ul>
          <div className="row portfolio-container" data-aos="fade-up" data-aos-delay="200">
            <div className="col-lg-4 col-md-6 portfolio-item filter-app">
              <div className="portfolio-img"><img src={img} className="img-fluid" alt="App 1" /></div>
              <div className="portfolio-info">
                <h4>App 1</h4>
                <p>App</p>
                <a href="assets/img/portfolio/portfolio-1.jpg" data-gallery="portfolioGallery" className="portfolio-lightbox preview-link" title="App 1"><i className="bx bx-plus"></i></a>
                <a href="portfolio-details.html" className="details-link" title="More Details"><i className="bx bx-link"></i></a>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 portfolio-item filter-web">
              <div className="portfolio-img"><img src={ava1} className="img-fluid" alt="Web 3" /></div>
              <div className="portfolio-info">
                <h4>Web 3</h4>
                <p>Web</p>
                <a href="assets/img/portfolio/portfolio-2.jpg" data-gallery="portfolioGallery" className="portfolio-lightbox preview-link" title="Web 3"><i className="bx bx-plus"></i></a>
                <a href="portfolio-details.html" className="details-link" title="More Details"><i className="bx bx-link"></i></a>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 portfolio-item filter-app">
              <div className="portfolio-img"><img src={ava2} className="img-fluid" alt="App 2" /></div>
              <div className="portfolio-info">
                <h4>App 2</h4>
                <p>App</p>
                <a href="assets/img/portfolio/portfolio-3.jpg" data-gallery="portfolioGallery" className="portfolio-lightbox preview-link" title="App 2"><i className="bx bx-plus"></i></a>
                <a href="portfolio-details.html" className="details-link" title="More Details"><i className="bx bx-link"></i></a>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 portfolio-item filter-card">
              <div className="portfolio-img"><img src={ava3} className="img-fluid" alt="Card 2" /></div>
              <div className="portfolio-info">
                <h4>Card 2</h4>
                <p>Card</p>
                <a href="assets/img/portfolio/portfolio-4.jpg" data-gallery="portfolioGallery" className="portfolio-lightbox preview-link" title="Card 2"><i className="bx bx-plus"></i></a>
                <a href="portfolio-details.html" className="details-link" title="More Details"><i className="bx bx-link"></i></a>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 portfolio-item filter-web">
              <div className="portfolio-img"><img src={ava4} className="img-fluid" alt="Web 2" /></div>
              <div className="portfolio-info">
                <h4>Web 2</h4>
                <p>Web</p>
                <a href="assets/img/portfolio/portfolio-5.jpg" data-gallery="portfolioGallery" className="portfolio-lightbox preview-link" title="Web 2"><i className="bx bx-plus"></i></a>
                <a href="portfolio-details.html" className="details-link" title="More Details"><i className="bx bx-link"></i></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="team" className="team section-bg">
        <div className="container" data-aos="fade-up">
          <div className="section-title">
            <h2 className='text-center'>Team</h2>
            <p className='text-center'>
              We are challenging ourselves to create the next market standard in terms of scalability, agility, and technology. And we need you to get there!
            </p>
          </div>
          <div className="row">
            <Carousel>
              <Carousel.Item>
                <center>
                  <div className="col-lg-6" data-aos="zoom-in" data-aos-delay="100">
                    <div className="member d-flex align-items-start">
                      <div className="pic"><img src={munees} className="img-fluid" width="200px" alt="Muneeswaran P" /></div>
                      <div className="member-info">
                        <h4>Muneeswaran P</h4>
                        <span>Chief Executive Officer || Full stack developers</span>
                        <div className="social">
                          <a href="https://munees2004.netlify.app" target='blank'><GitHub /></a>
                          <a href="https://www.facebook.com/profile.php?id=100070998938957" target='blank'><Facebook /></a>
                          <a href="https://www.instagram.com/man__of__heart39/" target='blank'><Instagram /></a>
                          <a href="https://www.linkedin.com/in/muneeswaran-p-bab627287/" target='blank'><LinkedIn /></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </center>
              </Carousel.Item>
      
              <Carousel.Item>
                <center>
                  <div className="col-lg-6" data-aos="zoom-in" data-aos-delay="100">
                    <div className="member d-flex align-items-start">
                      <div className="pic"><img src={Kanagu} className="img-fluid" width="200px" alt="Suryanarayanan Rao N P" /></div>
                      <div className="member-info">
                        <h4>Kanagaraj M</h4>
                        <span>Flutter developer||Web and app development || Founder of Nocorps</span>
                        <div className="social">
                          <a href="" target='blank'><Twitter /></a>
                          <a href=""><Facebook/></a>
                          <a href=""><Instagram/></a>
                          <a href=""><LinkedIn/></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </center>
              </Carousel.Item>
            </Carousel>
          </div>
        </div>
      </section>
    </>
  );
}