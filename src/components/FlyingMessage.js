import React, { useState, useEffect } from 'react';

const FlyingMessage = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // Display the message for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flying-message ${isVisible ? 'visible' : ''}`}>
      {message}
    </div>
  );
};

export default FlyingMessage;