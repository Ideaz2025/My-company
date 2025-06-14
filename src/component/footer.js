import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './style.css'
import { Link } from "react-router-dom";
function Footer() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//js.hsforms.net/forms/embed/v2.js";
    script.async = true;
    script.onload = () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          portalId: "45402210",
          formId: "a9adb2cd-575c-4a7f-9b46-6a99d784dd22",
          target: "#hubspot-form",
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    <footer id="footer" data-aos="fade-up">
      {/* <div className="align-items-stretch">
        <div className="footer-newsletter">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <h4>Join Our Newsletter</h4>
                <p>
                  Stay updated with the latest happenings and exclusive insights by reading this
                  month's newsletter, packed with exciting news, upcoming events, and helpful tips
                  to keep you informed and engaged.
                </p>
                <form action="" method="post">
                  <center>
                    <div id="hubspot-form"></div>
                  </center>
                </form>
              </div> 
            </div>
          </div>
        </div>
      </div> */}

      <div className="footer-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 footer-contact">
              <h3>IDEAZ</h3>
              <p>
                COIMBATORE
                <br />
                <br />
                <strong>Phone:</strong> 8300864083
                <br />
                <strong>Email:</strong> ideazdevelop27@gmail.com
                <br />
              </p>
            </div>

            <div className="col-lg-3 col-md-6 footer-links">
              <h4>Useful Links</h4>
              <ul>
                <li>
                  <i className="bx bx-chevron-right"></i> <Link to="/home">Home</Link>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i> <Link to="/services">Services</Link>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i> <Link to="/term and service">Terms of service</Link>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i> <Link to="/privacy">Privacy policy</Link>
                </li>
              </ul>
            </div>

            <div className="col-lg-3 col-md-6 footer-links">
              <h4>Our Services</h4>
              <ul>
                <li>
                  <i className="bx bx-chevron-right"></i> <Link to="/services">Web Design</Link>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i> <Link to="/services">Web Development</Link>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i> <Link to="/services">Marketing</Link>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i> <Link to="/services">Graphic Design</Link>
                </li>
              </ul>
            </div>

            <div className="col-lg-3 col-md-6 footer-links">
              <h4>Our Social Networks</h4>
              <div className="social-links mt-3">
                <a href="https://twitter.com/Ideaz272904" className="twitter">
                  <i className="bx bxl-twitter"></i>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61556826363017&mibextid=ZbWKwL" className="facebook">
                  <i className="bx bxl-facebook"></i>
                </a>
                <a href="https://www.instagram.com/ideaz2024/" className="instagram">
                  <i className="bx bxl-instagram"></i>
                </a>
                <a href="https://www.linkedin.com/company/105900292/admin/dashboard/ " className="linkedin">
                  <i className="bx bxl-linkedin"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container footer-bottom clearfix">
        <div className="copyright">
          &copy;Copyright{" "}
          <strong>
            <span>
              IDEAZ
            </span>
          </strong>
          . All Rights Reserved
        </div>
        <div className="credits">
          Designed by Developer team
        </div>
      </div>
    </footer>
  );
}

export default Footer;
