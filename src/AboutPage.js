import React, { useState } from 'react';
import { getAssetUrl } from './assetUtils';
import './AboutPage.scss';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { getProjectReference, getProjectLink } from './utils/projectUtils';
import BrevoForm from './components/BrevoForm';

const AboutPage = ({ data }) => {
  const [email, setEmail] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    about: true,
    exhibitions: true,
    awards: true,
    press: true,
    muses: true,
    collaborators: true,
    contact: true
  });

  const handleFormSubmit = (success) => {
    setChatHistory(prev => [...prev, { type: 'command', content: email }]);

    if (success) {
      setChatHistory(prev => [...prev,
      { type: 'response', content: '>> ACCESS GRANTED :: WELCOME TO THE NETWORK <<' }
      ]);
    } else {
      setChatHistory(prev => [...prev,
      { type: 'error', content: '>> ERROR :: CONNECTION FAILED <<' }
      ]);
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
            <div className="scrollable-content">
              <h1>// About Elodie Carstensen</h1>
              {renderSection("ABOUT", (
                <div className="about-info">
                  <div className="info-line"><span className="info-key">creator</span> <span className="info-value">{data.imprint.name}</span></div>
                  <div className="info-line"><span className="info-key">location</span> <span className="info-value">{data.imprint.address.join(', ')}</span></div>
                  <div className="info-line">
                    <span className="info-key">email</span>
                    <span className="info-value">
                      <a href={`mailto:${data.inquiries.email}`} className="email-link">
                        {data.inquiries.email}
                        <svg className="mail-icon" width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.6 0H1.4C0.63 0 0.00699999 0.63 0.00699999 1.4L0 9.8C0 10.57 0.63 11.2 1.4 11.2H12.6C13.37 11.2 14 10.57 14 9.8V1.4C14 0.63 13.37 0 12.6 0ZM12.6 2.8L7 6.3L1.4 2.8V1.4L7 4.9L12.6 1.4V2.8Z" fill="white" />
                        </svg>
                      </a>
                    </span>
                  </div>
                </div>
              ))}
              {renderSection("Exhibitions", (
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
                              <div className="info-value-content">
                                <span className="exhibition-type">{exhibition.type}</span>
                                <span className="exhibition-location">at {exhibition.location}</span>
                                {exhibition.date && <span className="exhibition-date">{exhibition.date}</span>}
                                {exhibition.time && <span className="exhibition-time">{exhibition.time}</span>}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
              {renderSection("Awards", (
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
              {renderSection("Press", (
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
              {renderSection("Muses", (
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
              {renderSection("Collaborators", (
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
      <div className="newsletter-form top-form visible">
        <h2>[SYSTEM::ACCESS] End of preview reached</h2>
        <div className="chat-history">
          {chatHistory.map((entry, index) => (
            <div key={index} className={`chat-entry ${entry.type}`}>
              {entry.type === 'command' ? `> ${entry.content}` : entry.content}
            </div>
          ))}
        </div>
        <BrevoForm
          onSubmit={handleFormSubmit}
          email={email}
          setEmail={setEmail}
        />
      </div>
    </>
  );
};

export default AboutPage;
