import * as React from 'react';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Ava from './img/hero-img.png';
import { styled } from '@mui/material/styles';
import Gif1 from './img/web-developer.gif';
import Gif2 from './img/digital-art.gif';
import Gif3 from './img/advertising.gif';
import Gif4 from './img/dashboard.gif';
import './style.css';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#041F3A',
  },
}));

const CircularProgressWithLabel = (props) => {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} size={100} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary" style={{fontSize: '1.5rem'}}>
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

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
        <div className="text-center">
            <h2>Testimonials</h2>
            <p>Our services are designed to help you achieve your business goals with ease and confidence. Explore our range of services below:</p>
          </div>
          <br />
      <section id="about" className="about">
        
          <figure class="snip1157">
    <blockquote>Calvin: You know sometimes when I'm talking, my words can't keep up with my thoughts... I wonder why we think faster than we speak. Hobbes: Probably so we can think twice.
      <div class="arrow"></div>
    </blockquote>
    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/sq-sample3.jpg" alt="sq-sample3" />
    <div class="author">
      <h5>Pelican Steve <span> LIttleSnippets.net</span></h5>
    </div>
  </figure>
      <figure class="snip1157 hover">
        <blockquote>Thank you. before I begin, I'd like everyone to notice that my report is in a professional, clear plastic binder...When a report looks this good, you know it'll get an A. That's a tip kids. Write it down.
          <div class="arrow"></div>
        </blockquote>
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/sq-sample27.jpg" alt="sq-sample27" />
        <div class="author">
          <h5>Max Conversion<span> LIttleSnippets.net</span></h5>
        </div>
      </figure>
      <figure class="snip1157">
        <blockquote>My behaviour is addictive functioning in a disease process of toxic co-dependency. I need holistic healing and wellness before I'll accept any responsibility for my actions.
          <div class="arrow"></div>
        </blockquote>
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/sq-sample17.jpg" alt="sq-sample17" />
        <div class="author">
          <h5>Eleanor Faint<span> LIttleSnippets.net</span></h5>
        </div>
      </figure>
      </section>
    </>
  );
}