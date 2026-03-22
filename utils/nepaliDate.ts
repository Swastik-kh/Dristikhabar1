export const getNepaliDigits = (num: number | string): string => {
  const digits: Record<string, string> = {
    '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
    '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
  };
  return num.toString().split('').map(d => digits[d] || d).join('');
};

const nepaliMonths = [
  'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज',
  'कात्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत'
];

const nepaliDays = [
  'आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'
];

/**
 * Highly Precise Nepali Date & Time utility.
 * Reference: January 14, 2025 (Tuesday) = Magh 1, 2081 (Maghe Sankranti)
 */
export const getExactNepaliDate = (): string => {
  const now = new Date();
  
  // Get Nepal Time components directly to ensure timezone consistency
  // This handles the "server time" vs "user time" issue effectively
  const nepalTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kathmandu"}));
  const dayName = nepaliDays[nepalTime.getDay()];

  // Fixed Anchor: January 14, 2025 = Magh 1, 2081
  // This is a standard reference point for 2081 BS
  const anchorDate = new Date(2025, 0, 14); // Jan 14
  
  // Reset both to midnight to calculate exact day difference
  const d1 = new Date(nepalTime.getFullYear(), nepalTime.getMonth(), nepalTime.getDate());
  const d2 = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), anchorDate.getDate());
  
  const diffTime = d1.getTime() - d2.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // Calendar configuration for 2081 BS
  const months2081 = [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30];
  
  let bsYear = 2081;
  let bsMonthIndex = 9; // Index for Magh (Starts at 0=Baishakh)
  let bsDay = 2 + diffDays; // Base is Magh 1, adjusted by +1 as per user request

  // Handle month overflows (Forward in time)
  while (bsDay > months2081[bsMonthIndex]) {
    bsDay -= months2081[bsMonthIndex];
    bsMonthIndex++;
    if (bsMonthIndex > 11) {
      bsMonthIndex = 0;
      bsYear++;
    }
  }

  // Handle month underflows (Backward in time)
  while (bsDay < 1) {
    bsMonthIndex--;
    if (bsMonthIndex < 0) {
      bsMonthIndex = 11;
      bsYear--;
    }
    bsDay += months2081[bsMonthIndex];
  }

  // Time formatting for display
  let hours = nepalTime.getHours();
  const minutes = nepalTime.getMinutes();
  const ampm = hours >= 12 ? 'अपराह्न' : 'पूर्वाह्न';
  hours = hours % 12;
  hours = hours ? hours : 12; 
  
  const nepYearStr = getNepaliDigits(bsYear);
  const nepMonthStr = nepaliMonths[bsMonthIndex];
  const nepDayStr = getNepaliDigits(bsDay);
  const nepTimeStr = `${getNepaliDigits(hours.toString().padStart(2, '0'))}:${getNepaliDigits(minutes.toString().padStart(2, '0'))}`;

  return `${nepYearStr} साल ${nepMonthStr} ${nepDayStr} गते, ${dayName} (समय: ${nepTimeStr} ${ampm})`;
};