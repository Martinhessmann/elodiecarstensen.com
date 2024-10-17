import React, { useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const SplashPage = ({ onEnter }) => {
  const history = useHistory();
  const landscapeRef = useRef(null);

  useEffect(() => {
    const handleScroll = (e) => {
      if (landscapeRef.current) {
        landscapeRef.current.style.transform = `translateX(-${window.scrollX}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEnter = () => {
    onEnter();
    history.push('/gallery');
  };

  return (
    <div className="relative w-full h-screen overflow-x-scroll overflow-y-hidden">
      <div ref={landscapeRef} className="absolute top-0 left-0 w-[300vw] h-full bg-cover bg-center" style={{backgroundImage: "url('/images/landscape.jpg')"}}>
        <div className="absolute inset-0 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-3/5 bg-transparent shadow-[0_0_0_1000px_rgba(255,255,255,0.2)]"></div>
        </div>
      </div>
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-2xl text-white">ELODIE CARSTENSEN</div>
      <div className="absolute bottom-12 right-12 text-right text-white">
        <p>Step into a world where vulnerability becomes armor</p>
        <button onClick={handleEnter} className="mt-5 px-5 py-2 bg-transparent border border-white text-white hover:bg-white hover:text-black transition-colors">ENTER</button>
      </div>
    </div>
  );
};

export default SplashPage;
