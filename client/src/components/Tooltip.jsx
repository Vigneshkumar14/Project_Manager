import React, { useState } from "react";

const Tooltip = ({ text, children }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setIsTooltipVisible(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isTooltipVisible && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 p-2 bg-slate-700 text-white rounded-md text-sm">
          <span className="whitespaces-nowrap">{text}</span>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
