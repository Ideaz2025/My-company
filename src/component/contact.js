import React, { useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons CSS

const ContactUs = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "///js.hsforms.net/forms/embed/v2.js";
    script.async = true;
    script.onload = () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          portalId: "45402210",
          formId: "5f4bd1d6-643f-46e7-8fb0-bc921dab53fe",
          target: "#hubspot-form1",
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <div>
        <section id="contact" className="contact">
          <div className="container" data-aos="fade-up">
            <div className="section-title">
              <h2>Contact</h2>
              <p>Have questions or want to get in touch? Feel free to reach out through our contact page, and we’ll respond promptly to assist you with your need</p>
            </div>

            <div className="row">
              <div className="col-lg-5 d-flex align-items-stretch">
                <div className="info">
                  <div className="address">
                    <i className="bi bi-geo-alt"></i>
                    <h4>Location:</h4>
                    <p>COIMBATORE</p>
                  </div>
                  <div className="email">
                    <i className="bi bi-envelope"></i>
                    <h4>Email:</h4>
                    <p>ideazdevelop27@gmail.com</p>
                  </div>
                  <div className="phone">
                    <i className="bi bi-phone"></i>
                    <h4>Call:</h4>
                    <p>+91 8300864083</p>
                  </div>
                  </div>
              </div>

              <div className="col-lg-7 mt-5 mt-lg-0 d-flex align-items-stretch">
                <form action="" method="post" className="php-email-form">
                  <center>
                    <div id="hubspot-form1"></div>
                  </center>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default ContactUs;