import React, { useEffect } from 'react';
import { getAssetUrl } from './assetUtils';
import './ContactPage.scss';

const ContactPage = ({ data }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://sibforms.com/forms/end-form/build/main.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  return (
    <div className="contact-page" style={{ backgroundImage: `url(${getAssetUrl(data.backgroundImage)})` }}>
      <div className="contact-content">
        <div className="contact-box imprint" style={{
          left: `${data.annotations.find(a => a.type === 'imprint').x * 100}%`,
          top: `${data.annotations.find(a => a.type === 'imprint').y * 100}%`,
        }}>
          <div className="contact-label">IMPRINT</div>
          <div className="contact-info">
            <p>{data.imprint.name}</p>
            {data.imprint.address.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>

        <div className="contact-box inquiries" style={{
          left: `${data.annotations.find(a => a.type === 'inquiries').x * 100}%`,
          top: `${data.annotations.find(a => a.type === 'inquiries').y * 100}%`,
        }}>
          <div className="contact-label">{data.inquiries.label}</div>
          <div className="contact-info">
            <a href={`mailto:${data.inquiries.email}`}>{data.inquiries.email}</a>
          </div>
        </div>

        <div className="contact-box newsletter-form" style={{
          left: `${data.annotations.find(a => a.type === 'newsletter').x * 100}%`,
          top: `${data.annotations.find(a => a.type === 'newsletter').y * 100}%`,
        }}>
          <div className="contact-label">{data.newsletter.label}</div>
          <div className="contact-info">
            <div className="sib-form" style={{ textAlign: "center", backgroundColor: "transparent" }}>
              <div id="sib-form-container" className="sib-form-container">
                <div id="sib-container" className="sib-container--large sib-container--vertical" style={{ textAlign: "center", backgroundColor: "transparent", maxWidth: "540px" }}>
                  <form id="sib-form" method="POST" action="https://9c0c9eba.sibforms.com/serve/MUIFAGV8z5aEiJz2JbmFOXTMPovqB2ofgsyUEWpTrkclNo_JNcBVguHkrJAG-ZOqC1mskrL_YGGX-y8Nn3URrxm_u9ahSbl0YZs_cYdjSQH9_zeUo55gkRdVZ2yQI-NLVTdDAvNU4wW2ndemJNQHeoLrJxSQztkhNZ2XAYpJrVPzrEPj5DURK7C8NJCNJU5mk-vXAf8ZpeZiJGGv">
                    <div style={{ padding: "8px 0" }}>
                      <div className="sib-input sib-form-block">
                        <div className="form__entry entry_block">
                          <div className="form__label-row ">
                            <div className="entry__field">
                              <input className="input" type="text" id="EMAIL" name="EMAIL" autoComplete="off" placeholder={data.newsletter.placeholder} required />
                            </div>
                          </div>
                          <label className="entry__error entry__error--primary" style={{ fontSize: "16px", textAlign: "left", fontFamily: "Helvetica, sans-serif", color: "#661d1d", backgroundColor: "#ffeded", borderRadius: "3px", borderColor: "#ff4949" }}>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: "8px 0" }}>
                      <div className="sib-form-block" style={{ textAlign: "left" }}>
                        <button className="sib-form-block__button sib-form-block__button-with-loader" style={{ fontSize: "16px", textAlign: "left", fontWeight: "700", fontFamily: "Helvetica, sans-serif", color: "#FFFFFF", backgroundColor: "#3E4857", borderRadius: "3px", borderWidth: "0px" }} form="sib-form" type="submit">
                          <svg className="icon clickable__icon progress-indicator__icon sib-hide-loader-icon" viewBox="0 0 512 512">
                            <path d="M460.116 373.846l-20.823-12.022c-5.541-3.199-7.54-10.159-4.663-15.874 30.137-59.886 28.343-131.652-5.386-189.946-33.641-58.394-94.896-95.833-161.827-99.676C261.028 55.961 256 50.751 256 44.352V20.309c0-6.904 5.808-12.337 12.703-11.982 83.556 4.306 160.163 50.864 202.11 123.677 42.063 72.696 44.079 162.316 6.031 236.832-3.14 6.148-10.75 8.461-16.728 5.01z" />
                          </svg>
                          {data.newsletter.buttonText}
                        </button>
                      </div>
                    </div>
                    <input type="text" name="email_address_check" value="" className="input--hidden" />
                    <input type="hidden" name="locale" value="en" />
                    <input type="hidden" name="html_type" value="simple" />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
