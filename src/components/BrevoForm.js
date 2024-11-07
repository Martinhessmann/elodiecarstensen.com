import React from 'react';

const BrevoForm = ({ onSubmit, email, setEmail }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!process.env.REACT_APP_BREVO_API_KEY) {
        console.error('API key is missing');
        throw new Error('Configuration error');
      }

      const response = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': process.env.REACT_APP_BREVO_API_KEY
        },
        body: JSON.stringify({
          email: email,
          listIds: [3],
          updateEnabled: true
        })
      });

      let responseData;
      const responseText = await response.text();
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.log('Raw response:', responseText);
        responseData = {};
      }

      console.log('Brevo API Response:', responseData);

      if (response.ok) {
        onSubmit(true);
        setEmail('');
      } else {
        console.error('API Error:', responseData);
        throw new Error(responseData.message || `Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Detailed Error:', error);
      onSubmit(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="brevo-form"
    >
      <div className="input-group">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your e-mail token to continue..."
          required
        />
        <button type="submit" className="send-button">
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.09999 4.49961V0.599609H7.19999V4.49961C7.19999 4.69824 7.12089 4.88926 6.98027 5.02989C6.83965 5.17051 6.64863 5.24961 6.44999 5.24961H2.43569L4.08569 3.59961L3.44994 2.96386L1.03179 5.38142C0.856591 5.5572 0.856591 5.84196 1.03179 6.01775L3.44994 8.4353L4.08569 7.79955L2.43569 6.14955H6.44999C7.36112 6.14955 8.09999 5.41074 8.09999 4.49961Z" fill="white" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default BrevoForm;