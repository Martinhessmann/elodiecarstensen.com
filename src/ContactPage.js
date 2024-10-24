import React, { useState } from 'react';
import { getAssetUrl } from './assetUtils';
import DynamicImageHighlight from './DynamicImageHighlight';
import './ContactPage.scss';

const ContactPage = ({ data }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://9c0c9eba.sibforms.com/serve/MUIFAGV8z5aEiJz2JbmFOXTMPovqB2ofgsyUEWpTrkclNo_JNcBVguHkrJAG-ZOqC1mskrL_YGGX-y8Nn3URrxm_u9ahSbl0YZs_cYdjSQH9_zeUo55gkRdVZ2yQI-NLVTdDAvNU4wW2ndemJNQHeoLrJxSQztkhNZ2XAYpJrVPzrEPj5DURK7C8NJCNJU5mk-vXAf8ZpeZiJGGv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `EMAIL=${encodeURIComponent(email)}&locale=en&html_type=simple`,
      });
      if (response.ok) {
        setMessage('Subscription successful!');
        setIsSuccess(true);
        setEmail('');
      } else {
        setMessage('Subscription failed. Please try again.');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
      setIsSuccess(false);
    }
  };

  const frameHighlightData = {
    x: 0.33,
    y: 0.2,
    width: 0.34,
    height: 0.6,
    text: ''
  };

  return (
    <div className="contact-page" style={{ backgroundImage: `url(${getAssetUrl(data.backgroundImage)})` }}>
      <DynamicImageHighlight
        nodeData={data.annotations}
        showNodes={true}
        isScrolling={false}
        shouldAnimate={true}
        highlightData={frameHighlightData}
      />
      <div className="contact-content">
        <div className="contact-box imprint" style={{ left: `calc(${data.annotations[0].x * 100}% + 15px)`, top: `calc(${data.annotations[0].y * 100}% + 20px)` }}>
          <div className="contact-info">
            <p>{data.imprint.name}</p>
            {data.imprint.address.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>

        <div className="contact-box inquiries" style={{ left: `calc(${data.annotations[1].x * 100}% + 15px)`, top: `calc(${data.annotations[1].y * 100}% + 15px)` }}>
          <div className="contact-info">
            <a href={`mailto:${data.inquiries.email}`}>{data.inquiries.email}</a>
          </div>
        </div>

        <div className="contact-box newsletter-form" style={{ left: `calc(${data.annotations[2].x * 100}% + 5px)`, top: `calc(${data.annotations[2].y * 100}% - 10px)` }}>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={data.newsletter.placeholder}
                required
              />
              <button type="submit" className="send-button">
                {data.newsletter.buttonText}
              </button>
            </div>
            {message && <div className={`form-message ${isSuccess ? 'success' : 'error'}`}>{message}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
