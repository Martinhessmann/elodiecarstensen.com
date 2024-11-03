import React, { useState } from 'react';
import { getAssetUrl } from './assetUtils';
import './AboutPage.scss';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { getProjectReference, getProjectLink } from './utils/projectUtils';

const AboutPage = ({ data }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    about: true,
    exhibitions: true,
    awards: true,
    press: true,
    muses: true,
    collaborators: true,
    contact: true
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date(dateString);
    if (isNaN(date)) {
      // Handle custom date formats like "September 12—15, 2024"
      return dateString.replace(/(January|February|March|April|May|June|July|August|September|October|November|December)/g,
        (match) => match.substring(0, 3));
    }
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const renderLink = (url, content, infoValue) => {
    if (url && url !== "Unavailable") {
      return (
        <>
          <span className="info-key">{content}</span>
          <span className="info-value">
            {infoValue}
            <a href={url} target="_blank" rel="noopener noreferrer" className="external-link-icon">
              [↗]
            </a>
          </span>
        </>
      );
    }
    return (
      <>
        <span className="info-key">{content}</span>
        <span className="info-value">{infoValue}</span>
      </>
    );
  };

  const sortByName = (a, b) => a.name.localeCompare(b.name);

  const renderSection = (title, content, level = 2) => {
    const HeadingTag = `h${level}`;
    return (
      <section className="about-section">
        <HeadingTag className="section-header" onClick={() => toggleSection(title.toLowerCase())}>
          <span className={`chevron ${expandedSections[title.toLowerCase()] ? 'expanded' : ''}`}>›</span>
          <span className="section-title">{title}</span>
        </HeadingTag>
        <div className={`section-content ${expandedSections[title.toLowerCase()] ? 'expanded' : ''}`}>
          {content}
        </div>
      </section>
    );
  };

  const renderProjectLinks = (projects) => {
    return projects.map((project, index) => {
      const projectLink = getProjectLink(project);
      if (projectLink) {
        return (
          <React.Fragment key={projectLink.id}>
            <Link to={`/gallery/${projectLink.id}`} className="project-link">
              [{project}]
            </Link>
            {index < projects.length - 1 ? ', ' : ''}
          </React.Fragment>
        );
      }
      return (
        <React.Fragment key={project}>
          {project}
          {index < projects.length - 1 ? ', ' : ''}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      <Helmet>
        <link rel="canonical" href="https://www.elodiecarstensen.com/about" />
        <link rel="alternate" href="https://elodiecarstensen.com/about" />
      </Helmet>
      <div
        className="about-page"
        style={{
          backgroundImage: `url(${getAssetUrl(data.backgroundImage)})`,
          '--project-theme-color': data.themeColor
        }}
      >
        <div className="about-content">
          <div className="about-frame">
            <div className="status-indicator">
              SURVEILLANCE ACTIVE // SIGNAL STRENGTH: 98%
            </div>
            <div className="scrollable-content">
              <div className="newsletter-form top-form">
                <h2>// SYSTEM BROADCAST SUBSCRIPTION</h2>
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

              <h1>// SUBJECT PROFILE: ELODIE CARSTENSEN</h1>
              {renderSection("LOCATION DATA", (
                <div className="about-info">
                  <div className="info-line">
                    <span className="info-key">SUBJECT ID</span>
                    <span className="info-value">{data.imprint.name}</span>
                  </div>
                  <div className="info-line">
                    <span className="info-key">BASE COORDINATES</span>
                    <span className="info-value">{data.imprint.address.join(', ')}</span>
                  </div>
                  <div className="info-line">
                    <span className="info-key">COMM CHANNEL</span>
                    <span className="info-value">
                      <a href={`mailto:${data.inquiries.email}`} className="email-link">
                        {data.inquiries.email}
                        <svg className="mail-icon" width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.6 0H1.4C0.63 0 0.00699999 0.63 0.00699999 1.4L0 9.8C0 10.57 0.63 11.2 1.4 11.2H12.6C13.37 11.2 14 10.57 14 9.8V1.4C14 0.63 13.37 0 12.6 0ZM12.6 2.8L7 6.3L1.4 2.8V1.4L7 4.9L12.6 1.4V2.8Z" fill="currentColor" />
                        </svg>
                      </a>
                    </span>
                  </div>
                </div>
              ))}
              {renderSection("RECORDED ACTIVITIES", (
                <div className="exhibitions-list">
                  {data.exhibitions.map((yearGroup, index) => (
                    <div key={index} className="year-group">
                      <h3 className="year">{yearGroup.year}</h3>
                      <ul className="year-content">
                        {yearGroup.events.map((exhibition, eventIndex) => (
                          <li key={eventIndex} className="info-line">
                            {renderLink(
                              exhibition.link,
                              exhibition.title,
                              `${exhibition.type} at ${exhibition.location}${exhibition.date ? `, ${exhibition.date}` : ''}`
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
              {renderSection("ACHIEVEMENTS", (
                <ul className="awards-list">
                  {data.awards.map((award, index) => (
                    <li key={index} className="info-line">
                      {renderLink(award.link, award.title)}
                      <div className="info-value">
                        {award.type}, {award.year}
                        <div>{award.description}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              ))}
              {renderSection("MEDIA COVERAGE", (
                <div className="press-list">
                  {data.press_mentions.map((yearGroup, index) => (
                    <div key={index} className="year-group">
                      <h3 className="year">{yearGroup.year}</h3>
                      <ul className="year-content">
                        {yearGroup.mentions.map((item, mentionIndex) => (
                          <li key={mentionIndex} className="info-line">
                            {renderLink(
                              item.link,
                              item.title,
                              formatDate(item.date)
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
              {renderSection("KNOWN ASSOCIATES", (
                <ul className="person-list">
                  {data.muses.sort(sortByName).map((person, index) => (
                    <li key={index} className="info-line">
                      {renderLink(
                        person.instagram,
                        person.name,
                        person.role
                      )}
                    </li>
                  ))}
                </ul>
              ))}
              {renderSection("COLLABORATORS", (
                <ul className="person-list">
                  {data.collaborators.sort(sortByName).map((person, index) => (
                    <li key={index} className="info-line">
                      {renderLink(
                        person.instagram,
                        person.name,
                        <>
                          {person.role}
                          {person.project && person.project.length > 0 && (
                            <span className="project-links">
                              {' '}{renderProjectLinks(person.project)}
                            </span>
                          )}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
