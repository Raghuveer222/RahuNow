// Pythagorean Numerology letter values
const NUMEROLOGY_MAP = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9
};

const VOWELS = ['a', 'e', 'i', 'o', 'u'];

// Helper to reduce number to single digit (or master numbers 11, 22, 33)
export function reduceNumber(num, allowMaster = true) {
  while (num > 9) {
    if (allowMaster && (num === 11 || num === 22 || num === 33)) {
      return num;
    }
    num = num.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
  }
  return num;
}

// Calculate Numerology values from Name & Date of Birth
export function calculateNumerology(name = "", dobStr = "") {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, "");
  
  // 1. Life Path Number (Sum of all digits in DOB)
  let lifePath = 0;
  if (dobStr) {
    const digits = dobStr.replace(/[^0-9]/g, "");
    const sum = digits.split('').reduce((acc, d) => acc + parseInt(d), 0);
    lifePath = reduceNumber(sum, true);
  }

  // 2. Destiny Number (Sum of all letters in name)
  let destinySum = 0;
  for (let char of cleanName) {
    destinySum += NUMEROLOGY_MAP[char] || 0;
  }
  const destiny = reduceNumber(destinySum, true);

  // 3. Soul Urge Number (Vowels sum)
  let soulUrgeSum = 0;
  for (let char of cleanName) {
    if (VOWELS.includes(char)) {
      soulUrgeSum += NUMEROLOGY_MAP[char] || 0;
    }
  }
  const soulUrge = reduceNumber(soulUrgeSum, true);

  // 4. Personality Number (Consonants sum)
  let personalitySum = 0;
  for (let char of cleanName) {
    if (!VOWELS.includes(char) && char >= 'a' && char <= 'z') {
      personalitySum += NUMEROLOGY_MAP[char] || 0;
    }
  }
  const personality = reduceNumber(personalitySum, true);

  return {
    lifePath,
    destiny,
    soulUrge,
    personality
  };
}

// Numerology descriptions database
export const NUMEROLOGY_DESCRIPTIONS = {
  1: {
    title: "The Pioneer Leader",
    traits: "Independent, ambitious, creative, self-reliant, and highly focused.",
    desc: "Number 1 represents energy, creation, and singular direction. You are born to lead, innovate, and carve out new paths. You perform best when working independently and struggle under heavy restriction."
  },
  2: {
    title: "The Diplomatic Peacemaker",
    traits: "Intuitive, cooperative, sensitive, understanding, and supportive.",
    desc: "Number 2 is the diplomat and peacemaker. You seek harmony, balance, and partnership in all aspects of life. You have a deep sensitivity and natural empathy, making you an excellent listener and teammate."
  },
  3: {
    title: "The Creative Expresser",
    traits: "Artistic, charismatic, expressive, optimistic, and social.",
    desc: "Number 3 carries a vibrant, creative frequency. You possess a natural charm, talent for self-expression (whether written, spoken, or artistic), and a joyful, infectious outlook that inspires others."
  },
  4: {
    title: "The Practical Builder",
    traits: "Disciplined, reliable, methodical, loyal, and organized.",
    desc: "Number 4 represents structure, order, and practicality. You are the foundation-builder. Your discipline, dedication, and systematic approach allow you to turn abstract ideas into lasting, stable realities."
  },
  5: {
    title: "The Dynamic Adventurer",
    traits: "Versatile, freedom-loving, curious, adaptable, and energetic.",
    desc: "Number 5 is the explorer and seeker of freedom. You crave experience, sensory adventure, and change. You adapt exceptionally fast to new cultures or environments but dislike repetitive routine."
  },
  6: {
    title: "The Nurturing Guardian",
    traits: "Compassionate, responsible, artistic, loving, and community-minded.",
    desc: "Number 6 represents the caretaker, teacher, and healer. You find fulfillment in serving others, creating beautiful, harmonious spaces, and taking responsibility for family and community well-being."
  },
  7: {
    title: "The Mystic Seeker",
    traits: "Analytical, spiritual, intellectual, reserved, and truth-seeking.",
    desc: "Number 7 is the path of wisdom, analysis, and spiritual depth. You seek the underlying truth behind all things. You enjoy solitude, study, and introspection, possessing strong intuitive insights."
  },
  8: {
    title: "The Powerhouse Achiever",
    traits: "Authoritative, practical, goal-oriented, business-minded, and resilient.",
    desc: "Number 8 represents material success, authority, and karmic balance. You possess the mental strength and strategic mind required to build wealth and run organizations, but must balance material ambitions with spiritual integrity."
  },
  9: {
    title: "The Compassionate Humanitarian",
    traits: "Generous, selfless, creative, broad-minded, and philosophical.",
    desc: "Number 9 represents completions, endings, and universal love. You are highly compassionate and driven to make the world a better place. You possess deep creative instincts and a global perspective on humanity."
  },
  11: {
    title: "The Master Intuitive",
    traits: "Highly spiritual, inspiring, highly sensitive, visionary, and creative.",
    desc: "As a Master Number 11, you represent spiritual illumination. You act as a bridge between the physical and metaphysical worlds. You possess intense intuition and carry the challenge of nervous anxiety, but your calling is to inspire others."
  },
  22: {
    title: "The Master Builder",
    traits: "Visionary, practical, exceptionally capable, leader, and builder.",
    desc: "Master Number 22 is considered the most powerful of all numbers. You have the ability to materialize grand visions onto the physical plane. You combine the spiritual insights of 11 with the practical, hard-working structure of 4."
  },
  33: {
    title: "The Master Teacher",
    traits: "Altruistic, nurturing, spiritually elevated, wise, and devoted.",
    desc: "Master Number 33 is the path of the spiritual teacher or avatar. You embody unconditional love, absolute devotion to the service of humanity, and deep wisdom. Your challenge is mastering emotional boundaries while caring for the world."
  }
};

// Standard daytime divisions (8 parts of Sunrise-Sunset, Sunrise = 06:00, Sunset = 18:00)
// This list specifies the daytime part (1 to 8) during which Rahu Kaal occurs for each day of the week.
// Part mapping: 1st=06:00-07:30, 2nd=07:30-09:00, 3rd=09:00-10:30, 4th=10:30-12:00, 5th=12:00-13:30, 6th=13:30-15:00, 7th=15:00-16:30, 8th=16:30-18:00
const RAHU_KAAL_PARTS = {
  0: 8, // Sunday -> 8th part
  1: 2, // Monday -> 2nd part
  2: 7, // Tuesday -> 7th part
  3: 5, // Wednesday -> 5th part
  4: 6, // Thursday -> 6th part
  5: 4, // Friday -> 4th part
  6: 3  // Saturday -> 3rd part
};

const YAMAGANDA_PARTS = {
  0: 5, // Sun -> 5th
  1: 4, // Mon -> 4th
  2: 3, // Tue -> 3rd
  3: 2, // Wed -> 2nd
  4: 1, // Thu -> 1st
  5: 7, // Fri -> 7th
  6: 6  // Sat -> 6th
};

const GULIKA_PARTS = {
  0: 7, // Sun -> 7th
  1: 6, // Mon -> 6th
  2: 5, // Tue -> 5th
  3: 4, // Wed -> 4th
  4: 3, // Thu -> 3rd
  5: 2, // Fri -> 2nd
  6: 1  // Sat -> 1st
};

// Helper: Format decimal hours to HH:MM
function formatDecimalTime(decimalHours) {
  let h = Math.floor(decimalHours);
  let m = Math.floor((decimalHours - h) * 60);
  h = h % 24;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

// Helper: Parse HH:MM to decimal hours
function parseTimeToDecimal(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h + m / 60;
}

// Calculate Rahu Kaal, Yamaganda, Gulika, Abhijit Muhurta
export function calculateAstrologicalTimings(dateStr, sunriseStr = "06:12", sunsetStr = "18:54") {
  const date = dateStr ? new Date(dateStr) : new Date();
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

  const sunrise = parseTimeToDecimal(sunriseStr);
  const sunset = parseTimeToDecimal(sunsetStr);
  const dayLength = sunset - sunrise;
  const partLength = dayLength / 8;

  // Calculate Specific parts
  const getInterval = (partNumber) => {
    const start = sunrise + (partNumber - 1) * partLength;
    const end = start + partLength;
    return {
      start: formatDecimalTime(start),
      end: formatDecimalTime(end),
      startDec: start,
      endDec: end
    };
  };

  const rahuPart = RAHU_KAAL_PARTS[dayOfWeek];
  const yamaPart = YAMAGANDA_PARTS[dayOfWeek];
  const gulikaPart = GULIKA_PARTS[dayOfWeek];

  const rahuKaal = getInterval(rahuPart);
  const yamaganda = getInterval(yamaPart);
  const gulika = getInterval(gulikaPart);

  // Abhijit Muhurta: ~48 mins centered around local mid-day (noon)
  const midDay = sunrise + dayLength / 2;
  const abhijitStart = midDay - 24 / 60; // 24 mins before
  const abhijitEnd = midDay + 24 / 60;   // 24 mins after
  const abhijit = {
    start: formatDecimalTime(abhijitStart),
    end: formatDecimalTime(abhijitEnd),
    startDec: abhijitStart,
    endDec: abhijitEnd
  };

  return {
    rahuKaal,
    yamaganda,
    gulika,
    abhijit,
    dayOfWeek
  };
}

// Choghadiya sequences by Day of the Week
// Day sequence starts from Sunrise. Night sequence starts from Sunset.
const CHOGHADIYA_TYPES = {
  UDVEG: { name: "Udveg", quality: "inauspicious", energy: "Anxiety & Stress", color: "var(--color-inauspicious)" },
  CHALA: { name: "Chala", quality: "neutral", energy: "Fluctuating & Active", color: "var(--color-neutral)" },
  LABHA: { name: "Labha", quality: "auspicious", energy: "Gain & Benefit", color: "var(--color-auspicious)" },
  AMRITA: { name: "Amrita", quality: "auspicious", energy: "Nectar & Life-giving", color: "var(--accent-gold)" },
  KALA: { name: "Kala", quality: "inauspicious", energy: "Obstacles & Losses", color: "#8b5cf6" }, // purple bad
  SHUBH: { name: "Shubh", quality: "auspicious", energy: "Lucky & Blessed", color: "#10b981" },
  ROGA: { name: "Roga", quality: "inauspicious", energy: "Sickness & Delays", color: "#64748b" }
};

const DAY_CHOGHADIYA_ORDER = {
  0: ["UDVEG", "CHALA", "LABHA", "AMRITA", "KALA", "SHUBH", "ROGA", "UDVEG"], // Sun
  1: ["AMRITA", "KALA", "SHUBH", "ROGA", "UDVEG", "CHALA", "LABHA", "AMRITA"], // Mon
  2: ["ROGA", "UDVEG", "CHALA", "LABHA", "AMRITA", "KALA", "SHUBH", "ROGA"], // Tue
  3: ["LABHA", "AMRITA", "KALA", "SHUBH", "ROGA", "UDVEG", "CHALA", "LABHA"], // Wed
  4: ["SHUBH", "ROGA", "UDVEG", "CHALA", "LABHA", "AMRITA", "KALA", "SHUBH"], // Thu
  5: ["CHALA", "LABHA", "AMRITA", "KALA", "SHUBH", "ROGA", "UDVEG", "CHALA"], // Fri
  6: ["KALA", "SHUBH", "ROGA", "UDVEG", "CHALA", "LABHA", "AMRITA", "KALA"]  // Sat
};

const NIGHT_CHOGHADIYA_ORDER = {
  0: ["SHUBH", "AMRITA", "CHALA", "ROGA", "KALA", "LABHA", "UDVEG", "SHUBH"], // Sun
  1: ["CHALA", "ROGA", "KALA", "LABHA", "UDVEG", "SHUBH", "AMRITA", "CHALA"], // Mon
  2: ["KALA", "LABHA", "UDVEG", "SHUBH", "AMRITA", "CHALA", "ROGA", "KALA"], // Tue
  3: ["UDVEG", "SHUBH", "AMRITA", "CHALA", "ROGA", "KALA", "LABHA", "UDVEG"], // Wed
  4: ["AMRITA", "CHALA", "ROGA", "KALA", "LABHA", "UDVEG", "SHUBH", "AMRITA"], // Thu
  5: ["ROGA", "KALA", "LABHA", "UDVEG", "SHUBH", "AMRITA", "CHALA", "ROGA"], // Fri
  6: ["LABHA", "UDVEG", "SHUBH", "AMRITA", "CHALA", "ROGA", "KALA", "LABHA"]  // Sat
};

export function calculateChoghadiya(dateStr, sunriseStr = "06:12", sunsetStr = "18:54") {
  const date = dateStr ? new Date(dateStr) : new Date();
  const dayOfWeek = date.getDay();

  const sunrise = parseTimeToDecimal(sunriseStr);
  const sunset = parseTimeToDecimal(sunsetStr);
  
  const dayLength = sunset - sunrise;
  const dayInterval = dayLength / 8;

  const nightLength = (24 - sunset) + sunrise;
  const nightInterval = nightLength / 8;

  // Day Choghadiya list
  const dayChoghadiyas = DAY_CHOGHADIYA_ORDER[dayOfWeek].map((typeKey, index) => {
    const start = sunrise + index * dayInterval;
    const end = start + dayInterval;
    const type = CHOGHADIYA_TYPES[typeKey];
    return {
      index,
      start: formatDecimalTime(start),
      end: formatDecimalTime(end),
      startDec: start,
      endDec: end,
      name: type.name,
      quality: type.quality,
      energy: type.energy,
      color: type.color
    };
  });

  // Night Choghadiya list
  const nightChoghadiyas = NIGHT_CHOGHADIYA_ORDER[dayOfWeek].map((typeKey, index) => {
    let start = sunset + index * nightInterval;
    let end = start + nightInterval;
    const type = CHOGHADIYA_TYPES[typeKey];
    return {
      index,
      start: formatDecimalTime(start),
      end: formatDecimalTime(end),
      startDec: start,
      endDec: end,
      name: type.name,
      quality: type.quality,
      energy: type.energy,
      color: type.color
    };
  });

  return {
    day: dayChoghadiyas,
    night: nightChoghadiyas
  };
}

// Generate stable, consistent astrological data based on Name, Date, Time & Coordinates
export function generateKundliData(name, dob, tob, location) {
  // Deterministic seed generation based on inputs
  const inputStr = `${name}-${dob}-${tob}-${location}`;
  let hash = 0;
  for (let i = 0; i < inputStr.length; i++) {
    hash = inputStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  const nakshatras = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
  ];

  // Helper to get deterministic index in range
  const getIndex = (seed, length) => (hash + seed) % length;
  
  // Calculate Ascendant (Lagna) sign index (1-12)
  const lagnaIndex = getIndex(7, 12);
  const ascendantSign = signs[lagnaIndex];

  // Generate planet placements
  const planetNames = [
    { key: "asc", label: "Ascendant (Lagna)" },
    { key: "sun", label: "Sun (Surya)" },
    { key: "mon", label: "Moon (Chandra)" },
    { key: "mar", label: "Mars (Mangal)" },
    { key: "mer", label: "Mercury (Budha)" },
    { key: "jup", label: "Jupiter (Guru)" },
    { key: "ven", label: "Venus (Shukra)" },
    { key: "sat", label: "Saturn (Shani)" },
    { key: "rah", label: "Rahu (North Node)" },
    { key: "ket", label: "Ketu (South Node)" }
  ];

  const placements = planetNames.map((planet, index) => {
    const planetHashSeed = index * 41;
    const signIndex = getIndex(planetHashSeed, 12);
    // Calculate placement house relative to Lagna (1st house is Lagna sign)
    // House = (SignIndex - LagnaIndex + 12) % 12 + 1
    const house = ((signIndex - lagnaIndex + 12) % 12) + 1;
    const degrees = (getIndex(planetHashSeed + 13, 300) / 10).toFixed(2);
    const nakshatraIndex = getIndex(planetHashSeed + 19, 27);
    const nakshatra = nakshatras[nakshatraIndex];
    const pada = (getIndex(planetHashSeed + 23, 4) + 1);

    return {
      key: planet.key,
      label: planet.label,
      sign: signs[signIndex],
      house: house,
      degrees: degrees,
      nakshatra: nakshatra,
      pada: pada,
      retrograde: planet.key !== "asc" && planet.key !== "sun" && planet.key !== "mon" && planet.key !== "rah" && planet.key !== "ket" && (getIndex(planetHashSeed + 99, 10) < 2)
    };
  });

  // Rahu and Ketu are always opposite (6 signs / 180 degrees apart)
  const rahPlacement = placements.find(p => p.key === "rah");
  if (rahPlacement) {
    const ketPlacement = placements.find(p => p.key === "ket");
    if (ketPlacement) {
      const rahSignIdx = signs.indexOf(rahPlacement.sign);
      const finalSignIndex = (rahSignIdx + 6) % 12;
      ketPlacement.sign = signs[finalSignIndex];
      ketPlacement.house = ((finalSignIndex - lagnaIndex + 12) % 12) + 1;
    }
  }

  // Organize chart placements (Houses 1-12 listing planets)
  const chartData = {};
  for (let i = 1; i <= 12; i++) {
    chartData[i] = {
      house: i,
      sign: signs[(lagnaIndex + i - 1) % 12],
      signNumber: ((lagnaIndex + i - 1) % 12) + 1,
      planets: placements.filter(p => p.house === i && p.key !== "asc")
    };
  }

  // Generate Dashas (Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury)
  const dashaPlanets = [
    { name: "Ketu", years: 7 },
    { name: "Venus", years: 20 },
    { name: "Sun", years: 6 },
    { name: "Moon", years: 10 },
    { name: "Mars", years: 7 },
    { name: "Rahu", years: 18 },
    { name: "Jupiter", years: 16 },
    { name: "Saturn", years: 19 },
    { name: "Mercury", years: 17 }
  ];

  // Pick starting dasha and balance based on Moon's degree/nakshatra
  const birthYear = dob ? new Date(dob).getFullYear() : 2000;
  const startDashaIndex = getIndex(99, 9);
  
  let currentYear = birthYear - getIndex(37, 5); // offset birth slightly for dasha balance
  const dashas = [];

  for (let i = 0; i < 9; i++) {
    const idx = (startDashaIndex + i) % 9;
    const dp = dashaPlanets[idx];
    const endYear = currentYear + dp.years;
    
    // Sub-dashas (Antardashas) for the active Mahadasha
    const subDashas = [];
    let subCurrentYear = currentYear;
    const subPart = dp.years / 9;
    for (let j = 0; j < 9; j++) {
      const sIdx = (idx + j) % 9;
      const sName = dashaPlanets[sIdx].name;
      const sEnd = subCurrentYear + subPart;
      subDashas.push({
        planet: sName,
        period: `${Math.floor(subCurrentYear)} - ${Math.floor(sEnd)}`
      });
      subCurrentYear = sEnd;
    }

    dashas.push({
      planet: dp.name,
      start: Math.floor(currentYear),
      end: Math.floor(endYear),
      subDashas: subDashas
    });
    currentYear = endYear;
  }

  // Panchang parameters specifically for this birth chart
  const birthPanchang = {
    tithi: `${getIndex(11, 15) + 1} Shunya`,
    nakshatra: placements.find(p => p.key === "mon").nakshatra,
    yoga: `${getIndex(41, 27) + 1} Vyaghata`,
    karana: `${getIndex(13, 11) + 1} Bava`,
    var: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][getIndex(3, 7)]
  };

  return {
    ascendant: ascendantSign,
    placements,
    chart: chartData,
    dashas,
    panchang: birthPanchang,
    lagnaSignNumber: lagnaIndex + 1
  };
}

// Generate Panchang details for a specific Date
export function getDailyPanchang(dateStr) {
  const date = dateStr ? new Date(dateStr) : new Date();
  
  // Deterministic seed based on date
  const dateSeed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  let hash = dateSeed;
  for (let i = 0; i < 3; i++) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
  }

  const tithis = [
    "Prathama (1st Tithi, Shukla Paksha)", "Dwitiya (2nd Tithi, Shukla Paksha)", 
    "Tritiya (3rd Tithi, Shukla Paksha)", "Chaturthi (4th Tithi, Shukla Paksha)",
    "Panchami (5th Tithi, Shukla Paksha)", "Shashthi (6th Tithi, Shukla Paksha)",
    "Saptami (7th Tithi, Shukla Paksha)", "Ashtami (8th Tithi, Shukla Paksha)",
    "Navami (9th Tithi, Shukla Paksha)", "Dashami (10th Tithi, Shukla Paksha)",
    "Ekadashi (11th Tithi, Shukla Paksha)", "Dwadashi (12th Tithi, Shukla Paksha)",
    "Trayodashi (13th Tithi, Shukla Paksha)", "Chaturdashi (14th Tithi, Shukla Paksha)",
    "Purnima (Full Moon)", 
    "Prathama (1st Tithi, Krishna Paksha)", "Dwitiya (2nd Tithi, Krishna Paksha)",
    "Tritiya (3rd Tithi, Krishna Paksha)", "Chaturthi (4th Tithi, Krishna Paksha)",
    "Panchami (5th Tithi, Krishna Paksha)", "Shashthi (6th Tithi, Krishna Paksha)",
    "Saptami (7th Tithi, Krishna Paksha)", "Ashtami (8th Tithi, Krishna Paksha)",
    "Navami (9th Tithi, Krishna Paksha)", "Dashami (10th Tithi, Krishna Paksha)",
    "Ekadashi (11th Tithi, Krishna Paksha)", "Dwadashi (12th Tithi, Krishna Paksha)",
    "Trayodashi (13th Tithi, Krishna Paksha)", "Chaturdashi (14th Tithi, Krishna Paksha)",
    "Amavasya (New Moon)"
  ];

  const nakshatras = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
  ];

  const yogas = [
    "Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", 
    "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", 
    "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", 
    "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", 
    "Brahma", "Indra", "Vaidhriti"
  ];

  const karanas = [
    "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", 
    "Visti (Bhadra)", "Shakuni", "Chatushpada", "Naga", "Kintughna"
  ];

  const rasis = [
    "Aries (Mesha)", "Taurus (Vrishabha)", "Gemini (Mithuna)", "Cancer (Karka)", 
    "Leo (Simha)", "Virgo (Kanya)", "Libra (Tula)", "Scorpio (Vrischika)", 
    "Sagittarius (Dhanu)", "Capricorn (Makara)", "Aquarius (Kumbha)", "Pisces (Meena)"
  ];

  const getIdx = (seed) => (hash + seed) % 100;

  const tithi = tithis[getIdx(2) % tithis.length];
  const nakshatra = nakshatras[getIdx(7) % nakshatras.length];
  const yoga = yogas[getIdx(13) % yogas.length];
  const karana = karanas[getIdx(19) % karanas.length];
  const moonSign = rasis[getIdx(23) % rasis.length];
  const sunSign = rasis[getIdx(31) % rasis.length];

  const weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()];

  // Calculate day rating (auspiciousness score)
  // Auspiciousness score will vary between 40% and 95%
  const score = 40 + (getIdx(53) % 56);
  let tone = "Inauspicious elements present. Proceed with caution.";
  if (score > 75) {
    tone = "Exceptional day for auspicious undertakings.";
  } else if (score > 60) {
    tone = "Moderately positive day. Suitable for routine actions.";
  }

  return {
    tithi,
    nakshatra,
    yoga,
    karana,
    var: weekDay,
    moonSign,
    sunSign,
    auspiciousScore: score,
    tone
  };
}

// Generate calendar auspiciousness for Muhurat page
export function generateMonthMuhuratData(year, month) {
  const numDays = new Date(year, month + 1, 0).getDate();
  const days = [];

  const muhuratTypes = [
    { id: "marriage", label: "Marriage (Vivah)", icon: "Heart" },
    { id: "house", label: "House Warming (Griha Pravesh)", icon: "Home" },
    { id: "business", label: "Business Launch", icon: "TrendingUp" },
    { id: "travel", label: "Auspicious Travel", icon: "Compass" },
    { id: "purchase", label: "Asset Purchase", icon: "ShoppingBag" }
  ];

  for (let d = 1; d <= numDays; d++) {
    const daySeed = year * 10000 + (month + 1) * 100 + d;
    let hash = daySeed;
    for (let i = 0; i < 2; i++) {
      hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    }
    
    // Day rating
    const score = 30 + (hash % 66); // 30 to 95
    let status = "neutral";
    if (score > 75) status = "auspicious";
    else if (score < 45) status = "inauspicious";

    // Best hours (e.g. 10:30-12:00, 15:30-17:00)
    const bestHourIdx = hash % 3;
    const hourIntervals = [
      "09:15 AM - 10:45 AM (Amrita)",
      "12:05 PM - 12:55 PM (Abhijit)",
      "04:30 PM - 06:00 PM (Shubh)"
    ];

    // Eligible activities based on astrological seed
    const activeMuhurats = [];
    muhuratTypes.forEach((m, idx) => {
      if ((hash + idx * 7) % 10 < 4) { // 40% chance of eligibility
        activeMuhurats.push(m.id);
      }
    });

    days.push({
      day: d,
      score,
      status,
      bestHour: hourIntervals[bestHourIdx],
      activeMuhurats
    });
  }

  return days;
}
