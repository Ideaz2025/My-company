import * as React from 'react';

import Gif1 from './img/web-developer.gif';
import Gif2 from './img/digital-art.gif';
import Gif3 from './img/advertising.gif';
import Gif4 from './img/dashboard.gif';
import './style.css';
import 'aos/dist/aos.css';

export default function LinearWithValueLabel() {
  return (
    <>
   

      <section id="services" className="services section-bg">
        <div className="container" data-aos="fade-up">
          <div className="section-title">
            <h2>Services</h2>
            <p>Our services are designed to help you achieve your business goals with ease and confidence. Explore our range of services below:</p>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-6 d-flex align-items-stretch">
              <div className="icon-box" data-aos="zoom-in" data-aos-delay="100">
                <div className="icon">
                  <img src={Gif1} alt="Web Development" className="img-fluid" />
                </div>
                <h4>Web Development</h4>
                <p>Build modern, responsive websites with our experienced freelance developers.</p>
          
              </div>
            </div>
            <div className="col-lg-3 col-md-6 d-flex align-items-stretch mt-4 mt-md-0">
              <div className="icon-box" data-aos="zoom-in" data-aos-delay="200">
                <div className="icon">
                  <img src={Gif2} alt="Graphic Design" className="img-fluid" />
                </div>
                <h4>Graphic Design</h4>
                <p>Design stunning visuals and branding materials to elevate your business identity.</p>
               
              </div>
            </div>
            <div className="col-lg-3 col-md-6 d-flex align-items-stretch mt-4 mt-lg-0">
              <div className="icon-box" data-aos="zoom-in" data-aos-delay="300">
                <div className="icon">
                  <img src={Gif3} alt="Digital Marketing" className="img-fluid" />
                </div>
                <h4>Digital Marketing</h4>
                <p>Drive traffic and grow your audience with our expert freelance marketers.</p>
           
              </div>
            </div>
            <div className="col-lg-3 col-md-6 d-flex align-items-stretch mt-4 mt-lg-0">
              <div className="icon-box" data-aos="zoom-in" data-aos-delay="400">
                <div className="icon">
                  <img src={Gif4} alt="UI/UX Design" className="img-fluid" />
                </div>
                <h4>UI/UX Design</h4>
                <p>Get high-quality, UI/UX that resonates with your audience.</p>
             
              </div>
            </div>
          </div>
        </div>
      </section>
       <section id="about" className="about">
  <figure className="snip1157" data-aos="fade-up" data-aos-delay="100">
    <blockquote>
     Working with this team was a fantastic experience. They built a responsive and visually impressive website that boosted our online presence
      <div className="arrow"></div>
    </blockquote>
    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/sq-sample3.jpg" alt="testimonial-1" />
    <div className="author">
      <h5>Professor</h5>
    </div>
  </figure>



  <figure className="snip1157" data-aos="fade-up" data-aos-delay="300">
    <blockquote>
     Excellent digital marketing service! We’ve seen a 40% increase in traffic and better engagement across platforms. Totally worth it
      <div className="arrow"></div>
    </blockquote>
    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/sq-sample17.jpg" alt="testimonial-3" />
    <div className="author">
      <h5>E-commerce<span></span></h5>
    </div>
  </figure>
</section>

    </>
  );
}