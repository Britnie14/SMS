import React from "react";

interface ColorCodeItemProps {
  color: string;
  label: string;
  description: string;
}

const ColorCodeItem: React.FC<ColorCodeItemProps> = ({
  color,
  label,
  description,
}) => {
  return (
    <div className="flex items-start mb-4">
      <div className="w-6 h-6" style={{ backgroundColor: color }}></div>
      <div className="ml-4">
        <p className="text-lg font-bold">{label}</p>
        <p className="text-base">{description}</p>
      </div>
    </div>
  );
};

const ColorCodes: React.FC = () => {
  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen mt-16">
      <h1 className="text-3xl font-bold mb-4">Color Codes</h1>
      <p className="text-lg mb-6">
        Here you can manage and view color codes for your application.
      </p>
      <ColorCodeItem
        color="#4CAF50" // Green
        label="Green: Non-Emergency Incidents"
        description="Examples: Minor accidents, property damage, nuisance complaints"
      />
      <ColorCodeItem
        color="#FFEB3B" // Yellow
        label="Yellow: Warnings or Potential Threats"
        description="Examples: Hazardous material spills, natural disasters (e.g., typhoons, earthquakes), civil unrest"
      />
      <ColorCodeItem
        color="#2196F3" // Blue
        label="Blue: Medical Emergencies"
        description="Examples: Heart attacks, strokes, accidents, injuries"
      />
      <ColorCodeItem
        color="#F44336" // Red
        label="Red: Critical or Life-Threatening Incidents"
        description="Examples: Fires, building collapses, mass casualties, active shooters"
      />
      <ColorCodeItem
        color="#00BCD4" // Cyan Blue
        label="Cyan Blue: Police Assistance Button"
        description="Automated Message including the location will be sent to PNP in case assistance is needed."
      />
    </div>
  );
};

export default ColorCodes;
