import React, { useState } from 'react';
import { getAssetUrl } from './assetUtils';
import DynamicImageHighlight from './DynamicImageHighlight';
import './ContactPage.scss';

const ContactPage = ({ data }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    creator: true,
    exhibitions: false,
    awards: false,
    press: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('SENT');
    setIsSuccess(true);

    try {
      const response = await fetch('https://9c0c9eba.sibforms.com/serve/MUIFAGV8z5aEiJz2JbmFOXTMPovqB2ofgsyUEWpTrkclNo_JNcBVguHkrJAG-ZOqC1mskrL_YGGX-y8Nn3URrxm_u9ahSbl0YZs_cYdjSQH9_zeUo55gkRdVZ2yQI-NLVTdDAvNU4wW2ndemJNQHeoLrJxSQztkhNZ2XAYpJrVPzrEPj5DURK7C8NJCNJU5mk-vXAf8ZpeZiJGGv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `EMAIL=${encodeURIComponent(email)}&locale=en&html_type=simple`,
      });
      if (response.ok) {
        setEmail('');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const renderSection = (title, content) => (
    <div className="contact-section">
      <div className="section-header">
        <span className="section-title">{title}</span>
        <button className="section-toggle" onClick={() => toggleSection(title.toLowerCase())}>
          [{expandedSections[title.toLowerCase()] ? '−' : '+'}]
        </button>
      </div>
      {expandedSections[title.toLowerCase()] && (
        <div className="section-content">
          {content}
        </div>
      )}
    </div>
  );

  return (
    <div
      className="contact-page"
      style={{
        backgroundImage: `url(${getAssetUrl(data.backgroundImage)})`,
        '--project-theme-color': data.themeColor
      }}
    >
      <div className="contact-content">
        <div className="contact-frame">
          <div className="scrollable-content">
            {renderSection("Creator", (
              <div className="json-content">
                <div>name: {data.imprint.name}</div>
                <div>location: Berlin</div>
                <div>expertise: Garment Design, Costume Creation, Art Installations</div>
                <div>focus: Ethical, Sustainable Fashion</div>
                <div>email: {data.inquiries.email}</div>
                <div>address: {data.imprint.address.join(', ')}</div>
              </div>
            ))}
            {renderSection("Exhibitions", (
              <div className="json-content">
                {data.exhibitions.map((exhibition, index) => (
                  <div key={index}>
                    {exhibition.title}, {exhibition.type} at {exhibition.location}, {exhibition.year}
                  </div>
                ))}
              </div>
            ))}
            {renderSection("Awards", (
              <div className="json-content">
                {data.awards.map((award, index) => (
                  <div key={index}>
                    {award.title}, {award.type}, {award.year}
                    <div>{award.description}</div>
                  </div>
                ))}
              </div>
            ))}
            {renderSection("Press", (
              <div className="json-content">
                {data.press.map((item, index) => (
                  <div key={index}>
                    {item.title} - {item.feature}
                    {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer"> [Link]</a>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="newsletter-form">
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
