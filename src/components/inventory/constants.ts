
export const categories = [
  'Lights', 'Fans', 'HVAC', 'Smart Devices', 
  'Curtain & Blinds', 'Security', 'Other'
];

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Lights': return 'bg-yellow-100 text-yellow-800';
    case 'Fans': return 'bg-blue-100 text-blue-800';
    case 'HVAC': return 'bg-red-100 text-red-800';
    case 'Smart Devices': return 'bg-purple-100 text-purple-800';
    case 'Curtain & Blinds': return 'bg-green-100 text-green-800';
    case 'Security': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const defaultPrices = [
  { id: '1', category: 'Lights', subcategory: 'Basic ON/OFF', wattage: 6, pricePerUnit: 150, notes: 'Actuator based' },
  { id: '2', category: 'Lights', subcategory: 'Tunable', wattage: 9, pricePerUnit: 250, notes: 'Dali based' },
  { id: '3', category: 'Lights', subcategory: 'RGB', wattage: 12, pricePerUnit: 350, notes: 'Dali based' },
  { id: '4', category: 'Lights', subcategory: 'RGBW', wattage: 15, pricePerUnit: 450, notes: 'Dali based' },
  { id: '5', category: 'Fans', pricePerUnit: 2000, notes: 'Ceiling fan' },
  { id: '6', category: 'HVAC', pricePerUnit: 35000, notes: 'Standard AC unit' },
  { id: '7', category: 'Curtain & Blinds', pricePerUnit: 7000, notes: 'Smart Wi-Fi motor' },
  { id: '8', category: 'Smart Devices', pricePerUnit: 1500, notes: 'Smart switch/sensor' },
  { id: '9', category: 'Security', pricePerUnit: 3000, notes: 'Security device' }
];
