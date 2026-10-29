/**
 * Flag Mapping Utility for PICT MUN Delegate Profiles
 *
 * Provides authoritative mapping between a delegate's assigned portfolio
 * (country or political organization/leader) and verified circular flag assets:
 * - Dedicated circular SVG assets for sovereign countries (/country_flags/*.svg)
 * - Individually cleaned and centered circular PNG assets for political parties (/political_parties_flags/processed/*.png)
 *
 * Strict safety rules:
 * - Only applies to authenticated delegates (role === "DELEGATE").
 * - Returns null for non-delegates (EB, Admin, etc.) or unsupported/unknown portfolios,
 *   safely falling back to the neutral initial-letter avatar.
 * - Never uses broad fuzzy matching or guessing.
 */

export interface FlagInfo {
  flagUrl: string;
  name: string;
  isParty?: boolean;
}

// 1. Authoritative ISO Alpha-2 Country Mappings (rendered as dedicated circular SVGs)
const COUNTRY_MAP: Record<string, { code: string; name: string }> = {
  // Afghanistan
  "afghanistan": { code: "af", name: "Afghanistan" },
  "islamic republic of afghanistan": { code: "af", name: "Islamic Republic of Afghanistan" },
  "islamic emirate of afghanistan": { code: "af", name: "Islamic Emirate of Afghanistan" },

  // Argentina
  "argentine republic": { code: "ar", name: "Argentine Republic" },
  "argentina": { code: "ar", name: "Argentina" },

  // Australia
  "commonwealth of australia": { code: "au", name: "Commonwealth of Australia" },
  "australia": { code: "au", name: "Australia" },

  // Bahrain
  "kingdom of bahrain": { code: "bh", name: "Kingdom of Bahrain" },
  "bahrain": { code: "bh", name: "Bahrain" },

  // Bangladesh
  "people's republic of bangladesh": { code: "bd", name: "People's Republic of Bangladesh" },
  "peoples republic of bangladesh": { code: "bd", name: "People's Republic of Bangladesh" },
  "bangladesh": { code: "bd", name: "Bangladesh" },

  // Belgium
  "kingdom of belgium": { code: "be", name: "Kingdom of Belgium" },
  "belgium": { code: "be", name: "Belgium" },

  // Brazil
  "federative republic of brazil": { code: "br", name: "Federative Republic of Brazil" },
  "brazil": { code: "br", name: "Brazil" },

  // Canada
  "canada": { code: "ca", name: "Canada" },

  // China
  "people's republic of china": { code: "cn", name: "People's Republic of China" },
  "peoples republic of china": { code: "cn", name: "People's Republic of China" },
  "china": { code: "cn", name: "China" },
  "prc": { code: "cn", name: "People's Republic of China" },

  // Colombia
  "republic of colombia": { code: "co", name: "Republic of Colombia" },
  "colombia": { code: "co", name: "Colombia" },

  // Cuba
  "republic of cuba": { code: "cu", name: "Republic of Cuba" },
  "cuba": { code: "cu", name: "Cuba" },

  // Democratic Republic of the Congo
  "democratic republic of the congo": { code: "cd", name: "Democratic Republic of the Congo" },
  "dr congo": { code: "cd", name: "Democratic Republic of the Congo" },
  "drc": { code: "cd", name: "Democratic Republic of the Congo" },

  // Denmark
  "kingdom of denmark": { code: "dk", name: "Kingdom of Denmark" },
  "denmark": { code: "dk", name: "Denmark" },

  // Egypt
  "arab republic of egypt": { code: "eg", name: "Arab Republic of Egypt" },
  "egypt": { code: "eg", name: "Egypt" },

  // France
  "french republic": { code: "fr", name: "French Republic" },
  "france": { code: "fr", name: "France" },

  // Germany
  "federal republic of germany": { code: "de", name: "Federal Republic of Germany" },
  "germany": { code: "de", name: "Germany" },

  // India
  "republic of india": { code: "in", name: "Republic of India" },
  "india": { code: "in", name: "India" },

  // Indonesia
  "republic of indonesia": { code: "id", name: "Republic of Indonesia" },
  "indonesia": { code: "id", name: "Indonesia" },

  // Iran
  "islamic republic of iran": { code: "ir", name: "Islamic Republic of Iran" },
  "iran": { code: "ir", name: "Iran" },

  // Iraq
  "republic of iraq": { code: "iq", name: "Republic of Iraq" },
  "iraq": { code: "iq", name: "Iraq" },

  // Israel
  "state of israel": { code: "il", name: "State of Israel" },
  "israel": { code: "il", name: "Israel" },

  // Italy
  "italian republic": { code: "it", name: "Italian Republic" },
  "italy": { code: "it", name: "Italy" },

  // Japan
  "japan": { code: "jp", name: "Japan" },

  // Kenya
  "republic of kenya": { code: "ke", name: "Republic of Kenya" },
  "kenya": { code: "ke", name: "Kenya" },

  // North Korea
  "democratic people's republic of korea": { code: "kp", name: "Democratic People's Republic of Korea" },
  "democratic peoples republic of korea": { code: "kp", name: "Democratic People's Republic of Korea" },
  "democratic people's republic of korea (dprk)": { code: "kp", name: "Democratic People's Republic of Korea (DPRK)" },
  "democratic peoples republic of korea (dprk)": { code: "kp", name: "Democratic People's Republic of Korea (DPRK)" },
  "north korea": { code: "kp", name: "North Korea" },
  "dprk": { code: "kp", name: "Democratic People's Republic of Korea" },

  // South Korea
  "republic of korea": { code: "kr", name: "Republic of Korea" },
  "south korea": { code: "kr", name: "South Korea" },
  "rok": { code: "kr", name: "Republic of Korea" },

  // Latvia
  "republic of latvia": { code: "lv", name: "Republic of Latvia" },
  "latvia": { code: "lv", name: "Latvia" },

  // Liberia
  "republic of liberia": { code: "lr", name: "Republic of Liberia" },
  "liberia": { code: "lr", name: "Liberia" },

  // Malaysia
  "malaysia": { code: "my", name: "Malaysia" },

  // Maldives
  "republic of maldives": { code: "mv", name: "Republic of Maldives" },
  "maldives": { code: "mv", name: "Maldives" },

  // Mexico
  "united mexican states": { code: "mx", name: "United Mexican States" },
  "mexico": { code: "mx", name: "Mexico" },

  // Myanmar
  "republic of the union of myanmar": { code: "mm", name: "Republic of the Union of Myanmar" },
  "myanmar": { code: "mm", name: "Myanmar" },
  "burma": { code: "mm", name: "Myanmar" },

  // Namibia
  "republic of namibia": { code: "na", name: "Republic of Namibia" },
  "namibia": { code: "na", name: "Namibia" },

  // Nepal
  "federal democratic republic of nepal": { code: "np", name: "Federal Democratic Republic of Nepal" },
  "nepal": { code: "np", name: "Nepal" },

  // Netherlands
  "kingdom of the netherlands": { code: "nl", name: "Kingdom of the Netherlands" },
  "netherlands": { code: "nl", name: "Netherlands" },

  // New Zealand
  "new zealand": { code: "nz", name: "New Zealand" },

  // Nigeria
  "federal republic of nigeria": { code: "ng", name: "Federal Republic of Nigeria" },
  "nigeria": { code: "ng", name: "Nigeria" },

  // Norway
  "kingdom of norway": { code: "no", name: "Kingdom of Norway" },
  "norway": { code: "no", name: "Norway" },

  // Pakistan
  "islamic republic of pakistan": { code: "pk", name: "Islamic Republic of Pakistan" },
  "pakistan": { code: "pk", name: "Pakistan" },

  // Palestine
  "state of palestine": { code: "ps", name: "State of Palestine" },
  "palestine": { code: "ps", name: "Palestine" },

  // Philippines
  "republic of the philippines": { code: "ph", name: "Republic of the Philippines" },
  "philippines": { code: "ph", name: "Philippines" },

  // Qatar
  "state of qatar": { code: "qa", name: "State of Qatar" },
  "qatar": { code: "qa", name: "Qatar" },

  // Russian Federation
  "russian federation": { code: "ru", name: "Russian Federation" },
  "russia": { code: "ru", name: "Russia" },

  // Saudi Arabia
  "kingdom of saudi arabia": { code: "sa", name: "Kingdom of Saudi Arabia" },
  "saudi arabia": { code: "sa", name: "Saudi Arabia" },

  // Singapore
  "republic of singapore": { code: "sg", name: "Republic of Singapore" },
  "singapore": { code: "sg", name: "Singapore" },

  // South Africa
  "republic of south africa": { code: "za", name: "Republic of South Africa" },
  "south africa": { code: "za", name: "South Africa" },

  // South Sudan
  "republic of south sudan": { code: "ss", name: "Republic of South Sudan" },
  "south sudan": { code: "ss", name: "South Sudan" },

  // Spain
  "kingdom of spain": { code: "es", name: "Kingdom of Spain" },
  "spain": { code: "es", name: "Spain" },

  // Sudan
  "republic of the sudan": { code: "sd", name: "Republic of the Sudan" },
  "sudan": { code: "sd", name: "Sudan" },

  // Sweden
  "kingdom of sweden": { code: "se", name: "Kingdom of Sweden" },
  "sweden": { code: "se", name: "Sweden" },

  // Switzerland
  "swiss confederation": { code: "ch", name: "Swiss Confederation" },
  "switzerland": { code: "ch", name: "Switzerland" },

  // Syria
  "syrian arab republic": { code: "sy", name: "Syrian Arab Republic" },
  "syria": { code: "sy", name: "Syria" },

  // Thailand
  "kingdom of thailand": { code: "th", name: "Kingdom of Thailand" },
  "thailand": { code: "th", name: "Thailand" },

  // Turkey / Türkiye
  "republic of türkiye": { code: "tr", name: "Republic of Türkiye" },
  "republic of turkiye": { code: "tr", name: "Republic of Türkiye" },
  "republic of turkey": { code: "tr", name: "Republic of Türkiye" },
  "türkiye": { code: "tr", name: "Türkiye" },
  "turkiye": { code: "tr", name: "Türkiye" },
  "turkey": { code: "tr", name: "Turkey" },

  // Ukraine
  "ukraine": { code: "ua", name: "Ukraine" },

  // United Kingdom
  "united kingdom of great britain and northern ireland": { code: "gb", name: "United Kingdom of Great Britain and Northern Ireland" },
  "united kingdom": { code: "gb", name: "United Kingdom" },
  "uk": { code: "gb", name: "United Kingdom" },
  "great britain": { code: "gb", name: "Great Britain" },

  // United States
  "united states of america": { code: "us", name: "United States of America" },
  "united states": { code: "us", name: "United States of America" },
  "usa": { code: "us", name: "United States of America" },
  "u.s.a.": { code: "us", name: "United States of America" },
  "us": { code: "us", name: "United States of America" },

  // Venezuela
  "bolivarian republic of venezuela": { code: "ve", name: "Bolivarian Republic of Venezuela" },
  "venezuela": { code: "ve", name: "Venezuela" },

  // Vietnam
  "socialist republic of viet nam": { code: "vn", name: "Socialist Republic of Viet Nam" },
  "socialist republic of vietnam": { code: "vn", name: "Socialist Republic of Viet Nam" },
  "viet nam": { code: "vn", name: "Viet Nam" },
  "vietnam": { code: "vn", name: "Vietnam" },
};

// 2. Authoritative Party Identifier -> Verified Processed Image Asset
export type PartyId =
  | "BJP"
  | "TDP"
  | "INC"
  | "SP"
  | "AITC"
  | "NCP_SP"
  | "SHIV_SENA_UBT"
  | "SHIV_SENA_SHINDE"
  | "AIMIM"
  | "BRS"
  | "AAP"
  | "CPIM"
  | "MNS"
  | "JKNC"
  | "JDU"
  | "RJD"
  | "DMK"
  | "JMM"
  | "BJD";

const PARTY_ASSET_MAP: Record<PartyId, { flagUrl: string; name: string }> = {
  BJP: {
    flagUrl: "/political_parties_flags/processed/bjp.png",
    name: "Bharatiya Janata Party (BJP)",
  },
  TDP: {
    flagUrl: "/political_parties_flags/processed/tdp.png",
    name: "Telugu Desam Party (TDP)",
  },
  INC: {
    flagUrl: "/political_parties_flags/processed/inc.png",
    name: "Indian National Congress (INC)",
  },
  SP: {
    flagUrl: "/political_parties_flags/processed/sp.png",
    name: "Samajwadi Party (SP)",
  },
  AITC: {
    flagUrl: "/political_parties_flags/processed/tmc.png",
    name: "All India Trinamool Congress (AITC)",
  },
  NCP_SP: {
    flagUrl: "/political_parties_flags/processed/ncp_sp.png",
    name: "Nationalist Congress Party - Sharadchandra Pawar (NCP-SP)",
  },
  SHIV_SENA_UBT: {
    flagUrl: "/political_parties_flags/processed/shiv_sena_ubt.png",
    name: "Shiv Sena (Uddhav Balasaheb Thackeray) (Shiv Sena (UBT))",
  },
  SHIV_SENA_SHINDE: {
    flagUrl: "/political_parties_flags/processed/shiv_sena_shide.png",
    name: "Shiv Sena",
  },
  AIMIM: {
    flagUrl: "/political_parties_flags/processed/aimim.png",
    name: "All India Majlis-e-Ittehadul Muslimeen (AIMIM)",
  },
  BRS: {
    flagUrl: "/political_parties_flags/processed/brs.png",
    name: "Bharat Rashtra Samithi (BRS)",
  },
  AAP: {
    flagUrl: "/political_parties_flags/processed/aap.png",
    name: "Aam Aadmi Party (AAP)",
  },
  CPIM: {
    flagUrl: "/political_parties_flags/processed/cpi.png",
    name: "Communist Party of India (Marxist) (CPI(M))",
  },
  MNS: {
    flagUrl: "/political_parties_flags/processed/mns.png",
    name: "Maharashtra Navnirman Sena (MNS)",
  },
  JKNC: {
    flagUrl: "/political_parties_flags/processed/jknc.png",
    name: "Jammu & Kashmir National Conference (JKNC)",
  },
  JDU: {
    flagUrl: "/political_parties_flags/processed/jdu.png",
    name: "Janata Dal (United) (JD(U))",
  },
  RJD: {
    flagUrl: "/political_parties_flags/processed/rjd.png",
    name: "Rashtriya Janata Dal (RJD)",
  },
  DMK: {
    flagUrl: "/political_parties_flags/processed/dmk.png",
    name: "Dravida Munnetra Kazhagam (DMK)",
  },
  JMM: {
    flagUrl: "/political_parties_flags/processed/jmm.png",
    name: "Jharkhand Mukti Morcha (JMM)",
  },
  BJD: {
    flagUrl: "/political_parties_flags/processed/bjd.png",
    name: "Biju Janata Dal (BJD)",
  },
};

// 3. Centralized Explicit Leader-to-Party Mapping (39 leaders)
const LEADER_TO_PARTY_MAP: Record<string, PartyId> = {
  // BJP Leaders
  "narendra modi": "BJP",
  "amit shah": "BJP",
  "rajnath singh": "BJP",
  "nirmala sitharaman": "BJP",
  "s. jaishankar": "BJP",
  "s jaishankar": "BJP",
  "nitin gadkari": "BJP",
  "ashwini vaishnaw": "BJP",
  "piyush goyal": "BJP",
  "jyotiraditya scindia": "BJP",
  "kiren rijiju": "BJP",
  "devendra fadnavis": "BJP",
  "yogi adityanath": "BJP",
  "shivraj singh chouhan": "BJP",
  "himanta biswa sarma": "BJP",
  "ujjwal nikam": "BJP",

  // TDP Leader
  "n. chandrababu naidu": "TDP",
  "n chandrababu naidu": "TDP",
  "chandrababu naidu": "TDP",

  // INC Leaders
  "rahul gandhi": "INC",
  "mallikarjun kharge": "INC",
  "shashi tharoor": "INC",
  "jairam ramesh": "INC",
  "p. chidambaram": "INC",
  "p chidambaram": "INC",
  "gaurav gogoi": "INC",
  "k. c. venugopal": "INC",
  "k c venugopal": "INC",
  "kc venugopal": "INC",
  "sonia gandhi": "INC",

  // SP Leader
  "akhilesh yadav": "SP",

  // AITC Leader
  "mamata banerjee": "AITC",

  // NCP-SP Leader
  "supriya sule": "NCP_SP",

  // Shiv Sena (UBT) Leaders
  "uddhav thackeray": "SHIV_SENA_UBT",
  "sanjay raut": "SHIV_SENA_UBT",

  // AIMIM Leader
  "asaduddin owaisi": "AIMIM",

  // BRS Leader
  "k. chandrashekar rao": "BRS",
  "k chandrashekar rao": "BRS",

  // AAP Leaders
  "arvind kejriwal": "AAP",
  "raghav chaddha": "AAP",
  "raghav chadha": "AAP",

  // CPI(M) Leader
  "pinarayi vijayan": "CPIM",

  // MNS Leader
  "raj thackeray": "MNS",

  // JKNC Leader
  "omar abdullah": "JKNC",

  // JD(U) Leader
  "nitish kumar": "JDU",

  // RJD Leader
  "tejashwi yadav": "RJD",

  // DMK Leaders
  "m. k. stalin": "DMK",
  "m k stalin": "DMK",
  "mk stalin": "DMK",
  "kanimozhi karunanidhi": "DMK",
  "kanimozhi": "DMK",

  // JMM Leader
  "hemant soren": "JMM",

  // BJD Leader
  "naveen patnaik": "BJD",

  // Shiv Sena (Shinde) Leader
  "eknath shinde": "SHIV_SENA_SHINDE",
};

// 4. Direct Political Party / Organization Name Aliases
const PARTY_NAME_ALIASES: Record<string, PartyId> = {
  // BJP
  "bjp": "BJP",
  "bharatiya janata party": "BJP",

  // TDP
  "tdp": "TDP",
  "telugu desam party": "TDP",

  // INC
  "inc": "INC",
  "indian national congress": "INC",
  "congress": "INC",

  // SP
  "sp": "SP",
  "samajwadi party": "SP",

  // AITC
  "aitc": "AITC",
  "tmc": "AITC",
  "all india trinamool congress": "AITC",
  "trinamool congress": "AITC",

  // NCP-SP
  "ncp-sp": "NCP_SP",
  "ncp_sp": "NCP_SP",
  "ncp (sp)": "NCP_SP",
  "nationalist congress party - sharadchandra pawar": "NCP_SP",
  "nationalist congress party (sharadchandra pawar)": "NCP_SP",
  "nationalist congress party": "NCP_SP",

  // Shiv Sena UBT
  "shiv sena (ubt)": "SHIV_SENA_UBT",
  "shiv sena ubt": "SHIV_SENA_UBT",
  "shiv sena (uddhav balasaheb thackeray)": "SHIV_SENA_UBT",
  "shiv sena - uddhav balasaheb thackeray": "SHIV_SENA_UBT",

  // Shiv Sena (Shinde)
  "shiv sena": "SHIV_SENA_SHINDE",
  "shiv sena (shinde)": "SHIV_SENA_SHINDE",
  "shiv sena shinde": "SHIV_SENA_SHINDE",
  "shiv sena (eknath shinde)": "SHIV_SENA_SHINDE",
  "shiv_sena_shide": "SHIV_SENA_SHINDE",

  // AIMIM
  "aimim": "AIMIM",
  "all india majlis-e-ittehadul muslimeen": "AIMIM",

  // BRS
  "brs": "BRS",
  "bharat rashtra samithi": "BRS",

  // AAP
  "aap": "AAP",
  "aam aadmi party": "AAP",

  // CPI(M)
  "cpi": "CPIM",
  "cpi-m": "CPIM",
  "cpi(m)": "CPIM",
  "cpim": "CPIM",
  "communist party of india": "CPIM",
  "communist party of india (marxist)": "CPIM",

  // MNS
  "mns": "MNS",
  "maharashtra navnirman sena": "MNS",

  // JKNC
  "jknc": "JKNC",
  "jammu & kashmir national conference": "JKNC",
  "jammu and kashmir national conference": "JKNC",

  // JD(U)
  "jdu": "JDU",
  "jd(u)": "JDU",
  "janata dal (united)": "JDU",
  "janata dal united": "JDU",

  // RJD
  "rjd": "RJD",
  "rashtriya janata dal": "RJD",

  // DMK
  "dmk": "DMK",
  "dravida munnetra kazhagam": "DMK",

  // JMM
  "jmm": "JMM",
  "jharkhand mukti morcha": "JMM",

  // BJD
  "bjd": "BJD",
  "biju janata dal": "BJD",
};

/**
 * Normalizes an assignment name for robust key comparison.
 */
function normalizeName(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Returns the verified flag image URL for a delegate's assigned portfolio.
 *
 * @param role The user's role (e.g. 'DELEGATE', 'EB', 'ADMIN')
 * @param portfolio The delegate's assigned portfolio (country name or political leader/party)
 * @returns FlagInfo with verified URL, name label, and isParty indicator, or null if unsupported/non-delegate.
 */
export function getDelegateFlag(
  role?: string | null,
  portfolio?: string | null
): FlagInfo | null {
  // Flag replacement is strictly for authenticated DELEGATE accounts
  if (!role || role.toUpperCase() !== "DELEGATE" || !portfolio || typeof portfolio !== "string") {
    return null;
  }

  const normalized = normalizeName(portfolio);

  // 1. Check verified country mapping -> /country_flags/{code}.svg
  const country = COUNTRY_MAP[normalized];
  if (country) {
    return {
      flagUrl: `/country_flags/${country.code}.svg`,
      name: country.name,
      isParty: false,
    };
  }

  // 2. Check direct political party assignment
  const directPartyId = PARTY_NAME_ALIASES[normalized];
  if (directPartyId && PARTY_ASSET_MAP[directPartyId]) {
    const asset = PARTY_ASSET_MAP[directPartyId];
    return {
      flagUrl: asset.flagUrl,
      name: asset.name,
      isParty: true,
    };
  }

  // 3. Check political leader-to-party mapping
  const leaderPartyId = LEADER_TO_PARTY_MAP[normalized];
  if (leaderPartyId && PARTY_ASSET_MAP[leaderPartyId]) {
    const asset = PARTY_ASSET_MAP[leaderPartyId];
    return {
      flagUrl: asset.flagUrl,
      name: asset.name,
      isParty: true,
    };
  }

  // 4. Safe fallback: unknown or unsupported assignments return null
  return null;
}
