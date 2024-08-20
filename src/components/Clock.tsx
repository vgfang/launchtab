import { useState, useEffect } from "react";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const updateTimeInterval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(updateTimeInterval);
  }, []);

  return (
    <div>
      <h1 className="time-text">{time.toLocaleTimeString()}</h1>
    </div>
  );
};

export default Clock;
