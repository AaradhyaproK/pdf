export interface RTOInfo {
  code: string; // e.g. "MH12"
  stateCode: string; // "MH"
  stateName: string; // "Maharashtra"
  district: string; // "Pune"
  officeLocation: string; // "Pune Central RTO"
  vehicleTypeHint?: string;
}

export const INDIAN_STATES: Record<string, string> = {
  AN: 'Andaman and Nicobar Islands',
  AP: 'Andhra Pradesh',
  AR: 'Arunachal Pradesh',
  AS: 'Assam',
  BR: 'Bihar',
  CG: 'Chhattisgarh',
  CH: 'Chandigarh',
  DD: 'Daman and Diu',
  DL: 'Delhi',
  DN: 'Dadra and Nagar Haveli',
  GA: 'Goa',
  GJ: 'Gujarat',
  HP: 'Himachal Pradesh',
  HR: 'Haryana',
  JH: 'Jharkhand',
  JK: 'Jammu and Kashmir',
  KA: 'Karnataka',
  KL: 'Kerala',
  LA: 'Ladakh',
  LD: 'Lakshadweep',
  MH: 'Maharashtra',
  ML: 'Meghalaya',
  MN: 'Manipur',
  MP: 'Madhya Pradesh',
  MZ: 'Mizoram',
  NL: 'Nagaland',
  OD: 'Odisha',
  PB: 'Punjab',
  PY: 'Puducherry',
  RJ: 'Rajasthan',
  SK: 'Sikkim',
  TN: 'Tamil Nadu',
  TS: 'Telangana',
  TR: 'Tripura',
  UK: 'Uttarakhand',
  UP: 'Uttar Pradesh',
  WB: 'West Bengal',
  BH: 'Bharat Series (Pan-India Tax Paid)',
};

export const POPULAR_RTO_LIST: RTOInfo[] = [
  // Maharashtra
  { code: 'MH01', stateCode: 'MH', stateName: 'Maharashtra', district: 'Mumbai South', officeLocation: 'Tardeo RTO, Mumbai' },
  { code: 'MH02', stateCode: 'MH', stateName: 'Maharashtra', district: 'Mumbai West', officeLocation: 'Andheri RTO, Mumbai' },
  { code: 'MH03', stateCode: 'MH', stateName: 'Maharashtra', district: 'Mumbai East', officeLocation: 'Wadala RTO, Mumbai' },
  { code: 'MH04', stateCode: 'MH', stateName: 'Maharashtra', district: 'Thane', officeLocation: 'Thane RTO' },
  { code: 'MH12', stateCode: 'MH', stateName: 'Maharashtra', district: 'Pune', officeLocation: 'Pune Central RTO' },
  { code: 'MH14', stateCode: 'MH', stateName: 'Maharashtra', district: 'Pimpri-Chinchwad', officeLocation: 'PCMC RTO, Pune' },
  { code: 'MH31', stateCode: 'MH', stateName: 'Maharashtra', district: 'Nagpur Urban', officeLocation: 'Nagpur RTO' },
  { code: 'MH43', stateCode: 'MH', stateName: 'Maharashtra', district: 'Navi Mumbai', officeLocation: 'Vashi RTO, Navi Mumbai' },

  // Delhi
  { code: 'DL01', stateCode: 'DL', stateName: 'Delhi', district: 'North Delhi', officeLocation: 'Mall Road, Civil Lines' },
  { code: 'DL02', stateCode: 'DL', stateName: 'Delhi', district: 'New Delhi', officeLocation: 'Tilak Marg, New Delhi' },
  { code: 'DL03', stateCode: 'DL', stateName: 'Delhi', district: 'South Delhi', officeLocation: 'Sheikh Sarai, New Delhi' },
  { code: 'DL04', stateCode: 'DL', stateName: 'Delhi', district: 'West Delhi', officeLocation: 'Janakpuri, New Delhi' },
  { code: 'DL05', stateCode: 'DL', stateName: 'Delhi', district: 'North East Delhi', officeLocation: 'Loni Road, Delhi' },
  { code: 'DL06', stateCode: 'DL', stateName: 'Delhi', district: 'Central Delhi', officeLocation: 'Sarai Kale Khan, Delhi' },
  { code: 'DL07', stateCode: 'DL', stateName: 'Delhi', district: 'East Delhi', officeLocation: 'Mayur Vihar, Delhi' },
  { code: 'DL08', stateCode: 'DL', stateName: 'Delhi', district: 'North West Delhi', officeLocation: 'Rohini, Delhi' },

  // Karnataka
  { code: 'KA01', stateCode: 'KA', stateName: 'Karnataka', district: 'Bangalore Central', officeLocation: 'Koramangala, Bengaluru' },
  { code: 'KA02', stateCode: 'KA', stateName: 'Karnataka', district: 'Bangalore West', officeLocation: 'Rajajinagar, Bengaluru' },
  { code: 'KA03', stateCode: 'KA', stateName: 'Karnataka', district: 'Bangalore East', officeLocation: 'Indiranagar, Bengaluru' },
  { code: 'KA04', stateCode: 'KA', stateName: 'Karnataka', district: 'Bangalore North', officeLocation: 'Yeshwanthpur, Bengaluru' },
  { code: 'KA05', stateCode: 'KA', stateName: 'Karnataka', district: 'Bangalore South', officeLocation: 'Jayanagar, Bengaluru' },
  { code: 'KA51', stateCode: 'KA', stateName: 'Karnataka', district: 'Electronics City', officeLocation: 'Electronics City, Bengaluru' },
  { code: 'KA53', stateCode: 'KA', stateName: 'Karnataka', district: 'KR Puram', officeLocation: 'KR Puram, Bengaluru' },

  // Tamil Nadu
  { code: 'TN01', stateCode: 'TN', stateName: 'Tamil Nadu', district: 'Chennai Central', officeLocation: 'Ayanavaram, Chennai' },
  { code: 'TN02', stateCode: 'TN', stateName: 'Tamil Nadu', district: 'Chennai North West', officeLocation: 'Anna Nagar, Chennai' },
  { code: 'TN07', stateCode: 'TN', stateName: 'Tamil Nadu', district: 'Chennai South', officeLocation: 'Thiruvanmiyur, Chennai' },
  { code: 'TN09', stateCode: 'TN', stateName: 'Tamil Nadu', district: 'Chennai West', officeLocation: 'KK Nagar, Chennai' },
  { code: 'TN37', stateCode: 'TN', stateName: 'Tamil Nadu', district: 'Coimbatore South', officeLocation: 'Coimbatore RTO' },

  // Uttar Pradesh
  { code: 'UP14', stateCode: 'UP', stateName: 'Uttar Pradesh', district: 'Ghaziabad', officeLocation: 'Ghaziabad RTO' },
  { code: 'UP16', stateCode: 'UP', stateName: 'Uttar Pradesh', district: 'Gautam Buddha Nagar', officeLocation: 'Noida RTO' },
  { code: 'UP32', stateCode: 'UP', stateName: 'Uttar Pradesh', district: 'Lucknow', officeLocation: 'Lucknow Transport Office' },
  { code: 'UP70', stateCode: 'UP', stateName: 'Uttar Pradesh', district: 'Prayagraj (Allahabad)', officeLocation: 'Prayagraj RTO' },
  { code: 'UP78', stateCode: 'UP', stateName: 'Uttar Pradesh', district: 'Kanpur Nagar', officeLocation: 'Kanpur Central RTO' },

  // Gujarat
  { code: 'GJ01', stateCode: 'GJ', stateName: 'Gujarat', district: 'Ahmedabad Urban', officeLocation: 'Subhash Bridge RTO, Ahmedabad' },
  { code: 'GJ03', stateCode: 'GJ', stateName: 'Gujarat', district: 'Rajkot', officeLocation: 'Rajkot RTO' },
  { code: 'GJ05', stateCode: 'GJ', stateName: 'Gujarat', district: 'Surat Urban', officeLocation: 'Surat RTO' },
  { code: 'GJ06', stateCode: 'GJ', stateName: 'Gujarat', district: 'Vadodara', officeLocation: 'Vadodara RTO' },

  // Telangana & Andhra Pradesh
  { code: 'TS07', stateCode: 'TS', stateName: 'Telangana', district: 'Ranga Reddy', officeLocation: 'Khairatabad, Hyderabad' },
  { code: 'TS08', stateCode: 'TS', stateName: 'Telangana', district: 'Medchal-Malkajgiri', officeLocation: 'Uppal RTO, Hyderabad' },
  { code: 'TS09', stateCode: 'TS', stateName: 'Telangana', district: 'Hyderabad Central', officeLocation: 'Khairatabad, Hyderabad' },
  { code: 'AP39', stateCode: 'AP', stateName: 'Andhra Pradesh', district: 'Visakhapatnam', officeLocation: 'Vizag Central RTO' },

  // West Bengal
  { code: 'WB01', stateCode: 'WB', stateName: 'West Bengal', district: 'Kolkata Central (Two Wheelers)', officeLocation: 'Beltala RTO, Kolkata' },
  { code: 'WB02', stateCode: 'WB', stateName: 'West Bengal', district: 'Kolkata Central (Commercial)', officeLocation: 'Beltala RTO, Kolkata' },
  { code: 'WB06', stateCode: 'WB', stateName: 'West Bengal', district: 'Howrah', officeLocation: 'Howrah RTO' },

  // Haryana & Punjab
  { code: 'HR26', stateCode: 'HR', stateName: 'Haryana', district: 'Gurugram North', officeLocation: 'Gurugram RTO' },
  { code: 'HR51', stateCode: 'HR', stateName: 'Haryana', district: 'Faridabad', officeLocation: 'Faridabad RTO' },
  { code: 'PB65', stateCode: 'PB', stateName: 'Punjab', district: 'SAS Nagar (Mohali)', officeLocation: 'Mohali RTO' },

  // Rajasthan & MP
  { code: 'RJ14', stateCode: 'RJ', stateName: 'Rajasthan', district: 'Jaipur South', officeLocation: 'Jaipur RTO' },
  { code: 'MP04', stateCode: 'MP', stateName: 'Madhya Pradesh', district: 'Bhopal', officeLocation: 'Bhopal RTO' },
  { code: 'MP09', stateCode: 'MP', stateName: 'Madhya Pradesh', district: 'Indore', officeLocation: 'Indore RTO' },

  // Kerala
  { code: 'KL01', stateCode: 'KL', stateName: 'Kerala', district: 'Thiruvananthapuram', officeLocation: 'Trivandrum Central RTO' },
  { code: 'KL07', stateCode: 'KL', stateName: 'Kerala', district: 'Ernakulam', officeLocation: 'Kochi RTO' },
];

export interface PlateParsedResult {
  isValid: boolean;
  rawInput: string;
  formattedPlate: string;
  stateCode?: string;
  stateName?: string;
  rtoCode?: string;
  district?: string;
  officeLocation?: string;
  seriesCode?: string;
  uniqueNumber?: string;
  isBHSeries?: boolean;
  message?: string;
}

export function parseIndianVehiclePlate(input: string): PlateParsedResult {
  const clean = input.toUpperCase().replace(/[^A-Z0-9]/g, '');

  if (!clean) {
    return { isValid: false, rawInput: input, formattedPlate: '', message: 'Please enter a registration plate number.' };
  }

  // BH Series check: e.g. 22BH1234AB
  const bhMatch = clean.match(/^(\d{2})BH(\d{4})([A-Z]{1,2})$/);
  if (bhMatch) {
    return {
      isValid: true,
      rawInput: input,
      formattedPlate: `${bhMatch[1]} BH ${bhMatch[2]} ${bhMatch[3]}`,
      stateCode: 'BH',
      stateName: 'Bharat Series (Pan-India Tax Paid)',
      isBHSeries: true,
      uniqueNumber: bhMatch[2],
      seriesCode: bhMatch[3],
      message: 'Valid Bharat (BH) Series Registration Plate. Pan-India road tax is paid.',
    };
  }

  // Standard Indian Vehicle format: ST RR AA NNNN or ST R A NNNN (e.g. MH12AB1234 or DL1C1234)
  const stdMatch = clean.match(/^([A-Z]{2})(\d{1,2})([A-Z]{1,3})?(\d{1,4})$/);

  if (!stdMatch) {
    return {
      isValid: false,
      rawInput: input,
      formattedPlate: clean,
      message: 'Invalid registration number format. Sample format: MH 12 AB 1234 or DL 01 A 9999.',
    };
  }

  const st = stdMatch[1];
  const rNum = stdMatch[2].padStart(2, '0');
  const series = stdMatch[3] || '';
  const num = stdMatch[4].padStart(4, '0');

  const rtoCodeKey = `${st}${rNum}`;
  const stateName = INDIAN_STATES[st] || 'Unknown State';
  const foundRto = POPULAR_RTO_LIST.find((r) => r.code === rtoCodeKey);

  const formatted = `${st}-${rNum} ${series ? series + ' ' : ''}${num}`;

  return {
    isValid: true,
    rawInput: input,
    formattedPlate: formatted,
    stateCode: st,
    stateName: stateName,
    rtoCode: rtoCodeKey,
    district: foundRto ? foundRto.district : `District RTO Code ${rNum}`,
    officeLocation: foundRto ? foundRto.officeLocation : `${stateName} Regional Transport Office ${rNum}`,
    seriesCode: series,
    uniqueNumber: num,
    isBHSeries: false,
    message: foundRto
      ? `Registered under ${foundRto.officeLocation} (${foundRto.district}, ${stateName})`
      : `Registered under ${stateName} State RTO Code ${rNum}`,
  };
}
