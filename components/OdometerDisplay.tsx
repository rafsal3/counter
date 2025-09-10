
import React from 'react';

interface OdometerDigitProps {
  digit: number;
}

const OdometerDigit: React.FC<OdometerDigitProps> = ({ digit }) => {
  const yOffset = -digit * 1; // Assuming each digit has a height of 1em

  return (
    <div className="h-[1em] overflow-hidden leading-[1em]">
      <div
        className="transition-transform duration-500 ease-in-out"
        style={{ transform: `translateY(${yOffset}em)` }}
      >
        <span>0</span><br />
        <span>1</span><br />
        <span>2</span><br />
        <span>3</span><br />
        <span>4</span><br />
        <span>5</span><br />
        <span>6</span><br />
        <span>7</span><br />
        <span>8</span><br />
        <span>9</span><br />
      </div>
    </div>
  );
};

interface OdometerDisplayProps {
  value: number;
  digits: number;
}

const OdometerDisplay: React.FC<OdometerDisplayProps> = ({ value, digits }) => {
  const formattedValue = String(value).padStart(digits, '0');

  return (
    <div className="flex font-mono text-6xl sm:text-7xl md:text-8xl font-bold text-gray-900 dark:text-gray-100 tracking-wider">
      {formattedValue.split('').map((char, index) => (
        <OdometerDigit key={index} digit={parseInt(char, 10)} />
      ))}
    </div>
  );
};

export default OdometerDisplay;
