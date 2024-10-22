import React, { useState } from 'react';
import { getAssetUrl } from './assetUtils';
import './ContactPage.scss';

const ContactPage = ({ data }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    // Handle newsletter signup logic here
  };

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

        <form className="contact-box newsletter-form" onSubmit={handleSubmit} style={{
          left: `${data.annotations.find(a => a.type === 'newsletter').x * 100}%`,
          top: `${data.annotations.find(a => a.type === 'newsletter').y * 100}%`,
        }}>
          <div className="contact-label">{data.newsletter.label}</div>
          <div className="contact-info">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={data.newsletter.placeholder}
              required
            />
            <button type="submit">{data.newsletter.buttonText}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
