
import React, { useEffect } from 'react';
const From = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "///js.hsforms.net/forms/embed/v2.js";
        script.async = true;
        script.onload = () => {
          if (window.hbspt) {
            window.hbspt.forms.create({
              portalId: "45402210",
              formId: "c107ecf1-8588-4dd2-8b21-c047052ab669",
              target: ".hubform"
            });
          }
        };
        document.body.appendChild(script);
      }, []);
     
  return (
    <div>
         <section id="portfolio-details" class="portfolio-details">
      <div class="container">

        <div class="row gy-4">

          <div class="col-md-12">
            <div class="portfolio-info">
              
              <h2 class="text-center">We are hiring a job For Web Development ,UI/UX Design , Digital marketing</h2>
                <h4 class="text-center"> Join Our team as Follow our Social Media And registration this Form and Join</h4>
            </div>
            <div class="portfolio-description">
              <h2 class="text-center">Registration Form</h2>
              <div className="hubform"></div>
            </div>
          </div>

        </div>

      </div>
    </section>
    </div>
  )
}

export default From