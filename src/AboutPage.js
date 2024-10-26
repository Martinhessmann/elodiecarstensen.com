import React, { useState } from 'react';
import { getAssetUrl } from './assetUtils';
import './AboutPage.scss';

const AboutPage = ({ data }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    about: true,
    exhibitions: false,
    awards: false,
    press: false,
    muses: false,
    collaborators: false,
    contact: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('SENT');

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

  const renderLink = (url) => {
    if (url && url !== "Unavailable") {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="external-link-icon">
          <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.38574 1.03198V0.100342L7.33691 0.100342L7.33691 5.07495H6.45801L6.47559 3.24683L6.5166 1.5769L6.50488 1.55933L5.24512 2.85425L1.60645 6.46948L0.985352 5.81323L4.60645 2.22144L5.94238 0.973389L5.93066 0.955811L4.21973 1.0144L2.38574 1.03198Z" fill="white" />
          </svg>
        </a>
      );
    }
    return null;
  };

  const renderSection = (title, content) => (
    <div className="about-section">
      <div className="section-header" onClick={() => toggleSection(title.toLowerCase())}>
        <span className={`chevron ${expandedSections[title.toLowerCase()] ? 'expanded' : ''}`}>›</span>
        <span className="section-title">{title}</span>
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
      className="about-page"
      style={{
        backgroundImage: `url(${getAssetUrl(data.backgroundImage)})`,
        '--project-theme-color': data.themeColor
      }}
    >
      <div className="about-content">
        <div className="about-frame">
          <div className="scrollable-content">
            {renderSection("ABOUT", (
              <>
                <div className="about-info">
                  <div className="info-line"><span className="info-key">creator</span> <span className="info-value">{data.imprint.name}</span></div>
                  <div className="info-line"><span className="info-key">location</span> <span className="info-value">{data.imprint.address.join(', ')}</span></div>
                  <div className="info-line"><span className="info-key">email</span> <span className="info-value">{data.inquiries.email}</span></div>
                </div>
              </>
            ))}
            {renderSection("Exhibitions", (
              <div className="exhibitions-list">
                {data.exhibitions.map((yearGroup, index) => (
                  <div key={index} className="year-group">
                    <div className="year">{yearGroup.year}</div>
                    <div className="year-content">
                      {yearGroup.events.map((exhibition, eventIndex) => (
                        <div key={eventIndex} className="info-line">
                          <span className="info-key">{exhibition.title}</span>
                          <div className="info-value">
                            {exhibition.type} at {exhibition.location}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {renderSection("Awards", (
              <div className="awards-list">
                {data.awards.map((award, index) => (
                  <div key={index} className="info-line">
                    <span className="info-key">{award.title}{renderLink(award.link)}</span>
                    <div className="info-value">
                      {award.type}, {award.year}
                      <div>{award.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {renderSection("Press", (
              <div className="press-list">
                {data.press_mentions.map((yearGroup, index) => (
                  <div key={index} className="year-group">
                    <div className="year">{yearGroup.year}</div>
                    <div className="year-content">
                      {yearGroup.mentions.map((item, mentionIndex) => (
                        <div key={mentionIndex} className="info-line">
                          <span className="info-key">{item.title}{renderLink(item.link)}</span>
                          <div className="info-value">
                            {item.date}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {renderSection("Muses", (
              <div className="person-list">
                {data.muses.map((person, index) => (
                  <div key={index} className="info-line">
                    <span className="info-key">{person.name}{renderLink(person.instagram)}</span>
                    <div className="info-value">
                      {person.role}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {renderSection("Collaborators", (
              <div className="person-list">
                {data.collaborators.map((person, index) => (
                  <div key={index} className="info-line">
                    <span className="info-key">{person.name}{renderLink(person.instagram)}</span>
                    <div className="info-value">
                      {person.role}, {person.project.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {renderSection("Subscribe for more updates", (
              <>
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
                        <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.09999 4.49961V0.599609H7.19999V4.49961C7.19999 4.69824 7.12089 4.88926 6.98027 5.02989C6.83965 5.17051 6.64863 5.24961 6.44999 5.24961H2.43569L4.08569 3.59961L3.44994 2.96386L1.03179 5.38142C0.856591 5.5572 0.856591 5.84196 1.03179 6.01775L3.44994 8.4353L4.08569 7.79955L2.43569 6.14955H6.44999C7.36112 6.14955 8.09999 5.41074 8.09999 4.49961Z" fill="white" />
                        </svg>
                      </button>
                    </div>
                    {message && <div className="form-message">{message}</div>}
                  </form>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
