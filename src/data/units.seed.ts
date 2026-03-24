// export interface ATCUnit {
//   slug: string;
//   unit: string;
//   abbreviation: string;
//   location: string;
//   yearEstablished?: string;
//   role: string;
//   description: string; // short intro (card view)
//   fullDescription: string; // detailed page content
//   responsibilities: string[];
//   aircraft?: string[];
//   parentCommand?: string;
//
//   gallery?: string[];
//   contact?: {
//     address?: string;
//     phone?: string;
//     email?: string;
//   };
//   links: {
//     title: string;
//     url: string;
//   }[];
// }

export const unitSeedData = [
  /* ========================= 401 FTS ========================= */

  {
    slug: "401-flying-training-school",
    unit: "401 Flying Training School Kaduna",
    abbreviation: "401 FTS",
    location: "Kaduna, Nigeria",
    role: "Primary and Basic Flying Training",
    description: "Provides ab-initio and basic flying training for NAF pilots.",
    fullDescription:
      "The 401 Flying Training School (401 FTS), located in Kaduna, is responsible for foundational flying training within the Nigerian Air Force. The school conducts ab-initio training for cadets, basic flying training, transport conversion training, instructor pilot courses, and recurrency programmes. It also undertakes light liaison transport missions, UAV operator training, paradropping exercises, combat air support operations, and search and rescue missions in support of national objectives.",
    responsibilities: [
      "Ab-initio pilot training",
      "Basic flying training",
      "Transport conversion courses",
      "Instructor pilot training",
      "UAV operator training",
      "Combat air support missions",
      "Search and rescue operations",
      "Paradrop exercises",
    ],
    aircraft: ["DA-40", "DA-42", "Super Mushshak", "DO-228"],
    parentCommand: "Air Training Command",
    links: [{ title: "Air Training Command Overview", url: "/atc-overview" }],
  },

  /* ========================= 403 FTS ========================= */

  {
    slug: "403-flying-training-school",
    unit: "403 Flying Training School Kano",
    abbreviation: "403 FTS",
    location: "Kano, Nigeria",
    role: "Advanced Jet Training",
    description: "Provides advanced jet and instructor pilot training.",
    fullDescription:
      "The 403 Flying Training School (403 FTS), located in Kano, provides advanced jet training using the L-39ZA aircraft. The school conducts instructor pilot training and fighter orientation for pilots trained in civil institutions. It also supports internal security operations and national emergency missions as directed.",
    responsibilities: [
      "Advanced jet pilot training",
      "Instructor pilot training",
      "Fighter orientation courses",
      "Operational air support missions",
      "National emergency response support",
    ],
    aircraft: ["L-39ZA Albatros"],
    parentCommand: "Air Training Command",
    links: [{ title: "NAF Official Website", url: "https://airforce.mil.ng" }],
  },

  /* ========================= 405 HCTG ========================= */

  {
    slug: "405-helicopter-combat-training-group",
    unit: "405 Helicopter Combat Training Group Enugu",
    abbreviation: "405 HCTG",
    location: "Enugu, Nigeria",
    role: "Helicopter Pilot Training",
    description:
      "Conducts basic, tactical and specialized helicopter training.",
    fullDescription:
      "The 405 Helicopter Combat Training Group (405 HCTG), based in Enugu, provides structured helicopter pilot training covering basic, tactical, and specialized operational competencies. The group also undertakes operational missions as directed by Headquarters Nigerian Air Force.",
    responsibilities: [
      "Basic helicopter training",
      "Tactical helicopter training",
      "Operational conversion",
      "Specialized mission training",
      "Support to national operations",
    ],
    aircraft: ["Mi-35", "Bell 412", "EC-135"],
    parentCommand: "Air Training Command",
    links: [],
  },

  /* ========================= 407 ACTG ========================= */

  {
    slug: "407-air-combat-training-group",
    unit: "407 Air Combat Training Group Kainji",
    abbreviation: "407 ACTG",
    location: "Kainji, Nigeria",
    role: "Tactical Fighter Training",
    description: "Conducts tactical fighter and recurrency training.",
    fullDescription:
      "The 407 Air Combat Training Group (407 ACTG), located in Kainji, conducts tactical fighter training and recurrency programmes on the Alpha Jet and A-29 Super Tucano aircraft. The group also participates in internal security operations and executes assigned air combat tasks.",
    responsibilities: [
      "Tactical fighter training",
      "Recurrency training",
      "Air combat readiness exercises",
      "Internal security air support",
    ],
    aircraft: ["Alpha Jet", "A-29 Super Tucano"],
    parentCommand: "Air Training Command",
    links: [],
  },

  /* ========================= 409 IHFS ========================= */

  {
    slug: "409-international-helicopter-flying-school",
    unit: "409 International Helicopter Flying School Enugu",
    abbreviation: "IHFS",
    location: "Enugu, Nigeria",
    role: "Military & Civil Helicopter Training",
    description: "Trains military and civilian helicopter pilots.",
    fullDescription:
      "The International Helicopter Flying School (IHFS), located in Enugu, operates under a public-private partnership arrangement to provide helicopter training for both military and civilian pilots. It delivers internationally compliant aviation training programmes.",
    responsibilities: [
      "Helicopter pilot training",
      "Civil aviation training programmes",
      "Operational conversion training",
    ],
    aircraft: ["EC-135"],
    parentCommand: "Air Training Command",
    links: [],
  },

  /* ========================= 410 CFS ========================= */

  {
    slug: "410-central-flying-school",
    unit: "410 Central Flying School Katsina",
    abbreviation: "410 CFS",
    location: "Katsina, Nigeria",
    role: "Instructor Pilot Training",
    description: "Responsible for training instructor pilots.",
    fullDescription:
      "The 410 Central Flying School (410 CFS), located in Katsina, is responsible for the training and standardization of all instructor pilots in the Nigerian Air Force. The school also conducts air displays and functions as the NAF aerobatic team.",
    responsibilities: [
      "Instructor pilot training",
      "Flight standardization",
      "Air display operations",
      "Aerobatic team coordination",
    ],
    parentCommand: "Air Training Command",
    links: [],
  },

  /* ========================= 413 FPG ========================= */

  {
    slug: "413-force-protection-group",
    unit: "413 Force Protection Group Kaduna",
    abbreviation: "413 FPG",
    location: "Kaduna, Nigeria",
    role: "Base Defence and Security",
    description: "Provides force protection for NAF Base Kaduna.",
    fullDescription:
      "The 413 Force Protection Group (413 FPG), located in Kaduna, is responsible for defending NAF Base Kaduna and enhancing its security architecture. The group monitors and advises the Air Officer Commanding on security matters and participates in internal security operations.",
    responsibilities: [
      "Base defence operations",
      "Security monitoring and intelligence",
      "Perimeter protection",
      "Internal security support",
    ],
    parentCommand: "Air Training Command",
    links: [],
  },

  /* ========================= 431 Engineering ========================= */

  {
    slug: "431-engineering-group",
    unit: "431 Engineering Group Kaduna",
    abbreviation: "431 Engr Gp",
    location: "Kaduna, Nigeria",
    role: "Aircraft Maintenance",
    description: "Conducts third- and fourth-line aircraft maintenance.",
    fullDescription:
      "The 431 Engineering Group, located in Kaduna, conducts third- and fourth-line maintenance on multiple NAF aircraft platforms. It also operates and maintains Aerospace Ground Equipment in support of air operations.",
    responsibilities: [
      "Aircraft overhaul",
      "Major airframe inspections",
      "Engine maintenance",
      "Ground equipment maintenance",
    ],
    aircraft: ["DO-228", "DA-40", "DA-42", "Super Mushshak"],
    parentCommand: "Air Training Command",
    links: [],
  },

  /* ========================= Remaining Units (Summarized Structured) ========================= */

  {
    slug: "441-cis-group",
    unit: "441 Communications and Information Systems Group Kaduna",
    abbreviation: "441 CIS Gp",
    location: "Kaduna, Nigeria",
    role: "Communications & IT Systems",
    description: "Implements communications and radar systems.",
    fullDescription:
      "Responsible for installation, operation and maintenance of communications, navigation aids, radar systems, electronic warfare systems and IT infrastructure in ATC.",
    responsibilities: [
      "Communications infrastructure management",
      "Radar system maintenance",
      "IT systems administration",
      "Electronic warfare systems support",
    ],
    parentCommand: "Air Training Command",
    links: [],
  },

  {
    slug: "453-base-services-group-kaduna",
    unit: "453 Base Services Group Kaduna",
    abbreviation: "453 BSG",
    location: "Kaduna, Nigeria",
    role: "Administrative and Welfare Services",
    description: "Provides welfare and administrative support.",
    fullDescription:
      "Provides centralized personnel management, welfare services and administrative support to ATC units.",
    responsibilities: [
      "Personnel administration",
      "Accommodation management",
      "Welfare services",
      "Logistics support",
    ],
    parentCommand: "Air Training Command",
    links: [],
  },

  {
    slug: "455-base-services-group-kano",
    unit: "455 Base Services Group Kano",
    abbreviation: "455 BSG",
    location: "Kano, Nigeria",
    role: "Base Support & Security",
    description: "Provides base security and welfare services.",
    fullDescription:
      "Provides aerodrome defence, accommodation management and internal security liaison.",
    responsibilities: [
      "Aerodrome defence",
      "VIP reception",
      "Barracks maintenance",
      "Internal security coordination",
    ],
    parentCommand: "Air Training Command",
    links: [],
  },

  {
    slug: "461-naf-hospital-kaduna",
    unit: "461 NAF Hospital Kaduna",
    abbreviation: "461 NAFH",
    location: "Kaduna, Nigeria",
    role: "Military Healthcare Services",
    description: "Provides healthcare services to personnel.",
    fullDescription:
      "Provides medical services to NAF personnel, dependants and NHIS enrollees and supports air operations medically.",
    responsibilities: [
      "Primary and secondary healthcare",
      "Aero-medical support",
      "Medical outreaches",
    ],
    parentCommand: "Air Training Command",
    links: [],
  },

  {
    slug: "465-naf-hospital-kano",
    unit: "465 NAF Hospital Kano",
    abbreviation: "465 NAFH",
    location: "Kano, Nigeria",
    role: "Healthcare & Referral Services",
    description: "Provides primary and secondary healthcare.",
    fullDescription:
      "Serves as referral centre and supports civil-military medical initiatives.",
    responsibilities: [
      "Medical consultation",
      "Referral services",
      "Community medical outreach",
    ],
    parentCommand: "Air Training Command",
    links: [],
  },

  {
    slug: "air-traffic-services-training-centre",
    unit: "Air Traffic Services Training Centre",
    abbreviation: "ATSTC",
    location: "Kaduna, Nigeria",
    role: "Air Traffic Control Training",
    description: "Trains air traffic control officers.",
    fullDescription:
      "Trains ATC officers, flight dispatchers and aviation specialists for NAF and civil organizations.",
    responsibilities: [
      "ATC officer training",
      "Flight dispatch training",
      "Aviation specialist development",
    ],
    parentCommand: "Air Training Command",
    links: [],
  },

  {
    slug: "central-avionics-overhaul-calibration-centre",
    unit: "Central Avionics Overhaul Calibration Centre Kaduna",
    abbreviation: "CAOCC",
    location: "Kaduna, Nigeria",
    role: "Avionics Maintenance",
    description: "Performs avionics overhaul and calibration.",
    fullDescription:
      "Responsible for third- and fourth-line avionics and electrical systems maintenance across NAF aircraft.",
    responsibilities: [
      "Avionics overhaul",
      "Calibration services",
      "Electrical systems maintenance",
    ],
    parentCommand: "Air Training Command",
    links: [],
  },

  {
    slug: "naf-institute-of-safety",
    unit: "Nigerian Air Force Institute of Safety Ipetu-Ijesha",
    abbreviation: "NAFIS",
    location: "Ipetu-Ijesha, Nigeria",
    role: "Safety Training & Evaluation",
    description: "Promotes aviation and operational safety.",
    fullDescription:
      "Develops safety training programmes, hazard identification systems and evaluation standards for NAF.",
    responsibilities: [
      "Safety training programmes",
      "Risk analysis training",
      "Standards evaluation",
    ],
    parentCommand: "Air Training Command",
    links: [],
  },

  {
    slug: "naf-school-of-air-intelligence",
    unit: "Nigerian Air Force School of Air Intelligence Makurdi",
    abbreviation: "NAFSAINT",
    location: "Makurdi, Nigeria",
    role: "Air Intelligence Training",
    description: "Trains intelligence personnel.",
    fullDescription:
      "Provides structured intelligence and security training for NAF personnel.",
    responsibilities: [
      "Intelligence officer training",
      "Security operations training",
      "Joint intelligence coordination",
    ],
    parentCommand: "Air Training Command",
    links: [],
  },

  {
    slug: "air-force-girls-comprehensive-school",
    unit: "Air Force Girls Comprehensive School Abuja",
    abbreviation: "AFGCS",
    location: "Abuja, Nigeria",
    role: "Secondary Education",
    description: "Provides comprehensive secondary education.",
    fullDescription:
      "A NAF boarding school dedicated to providing quality secondary education and character development.",
    responsibilities: [
      "Secondary education delivery",
      "Character development",
      "Academic excellence promotion",
    ],
    parentCommand: "Air Training Command",
    links: [],
  },
];
export const units_in_atc2 = [
  {
    slug: "dummy-data",
    unit: "401 Flying Training School Kaduna",
    description:
      "The 401 Flying Training School (401 FTS), located in Kaduna, provides quality flying training for NAF pilots, including ab-initio, basic flying, and transport conversion training. It also conducts light liaison transport missions, type rating and recurrency trainings, instructor pilot training on the DO-228, UAV operator trainings, paradropping exercises, combat air support, and search and rescue operations.",
    abbreviation: "401 FTS",
  },
  {
    slug: "dummy-data",
    unit: "403 Flying Training School Kano",
    description:
      "The 403 Flying Training School (403 FTS), located in Kano, trains NAF pilots on the L-39ZA aircraft, including basic and instructor pilot trainings. It also provides fighter orientation for pilots trained in civil schools, supports internal security operations, conducts national emergency operations, and undertakes tasks assigned by ASA.",
    abbreviation: "403 FTS",
  },
  {
    slug: "dummy-data",
    unit: "405 Helicopter Combat Training Group Enugu",
    description:
      "The 405 Helicopter Combat Training Group (405 HCTG), based in Enugu, conducts basic, tactical, and specialized helicopter pilot trainings. It also carries out operational missions as directed by HQ NAF.",
    abbreviation: "405 HCTG",
  },
  {
    slug: "dummy-data",
    unit: "407 Air Combat Training Group Kainji",
    description:
      "The 407 Air Combat Training Group, located in Kainji, conducts tactical fighter and recurrency trainings on the Alpha Jet and A-29 Super Tucano. It also participates in internal security operations and executes tasks assigned by ASA.",
    abbreviation: "407 ACTG",
  },
  {
    slug: "dummy-data",
    unit: "409 International Helicopter Flying School Enugu",
    description:
      "The International Helicopter Flying School (IHFS), located in Enugu, trains both military and civilian helicopter pilots under a public-private partnership arrangement.",
    abbreviation: "IHFS",
  },
  {
    slug: "dummy-data",
    unit: "410 Central Flying School Katsina",
    description:
      "The 410 Central Flying School, currently a virtual school located in Katsina, is responsible for training all instructor pilots in the NAF. It also conducts air displays and functions as the NAF aerobatic team.",
    abbreviation: "410 CFS",
  },
  {
    slug: "dummy-data",
    unit: "413 Force Protection Group Kaduna",
    description:
      "The 413 Force Protection Group, located in Kaduna, defends NAF Base Kaduna and enhances its security architecture. It monitors and advises the AOC on security frameworks and participates in internal security operations with sister agencies.",
    abbreviation: "413 FPG",
  },
  {
    slug: "dummy-data",
    unit: "431 Engineering Group Kaduna",
    description:
      "The 431 Engineering Group, located in Kaduna, conducts third- and fourth-line maintenance on DO-228, DA-40, DA-42, Super Mushshak, and ABT-18 aircraft. It also operates and maintains associated Aerospace Ground Equipment.",
    abbreviation: "431 Engr Gp",
  },
  {
    slug: "dummy-data",
    unit: "441 Communications and Information Systems Group Kaduna",
    description:
      "The 441 Communications and Information Systems Group (441 CIS Gp), located in Kaduna, implements communications, radar, IT, and space technology policies from HQ NAF. It manages installation, maintenance, and operations of communications, navigation aids, electronic warfare systems, and electro-optics.",
    abbreviation: "441 CIS Gp",
  },
  {
    slug: "dummy-data",
    unit: "453 Base Services Group Kaduna",
    description:
      "The 453 Base Services Group, located in Kaduna, provides administrative, welfare, and centralized personnel management support to ATC and co-located NAF units. It sustains personnel motivation and fosters intra-service cooperation.",
    abbreviation: "453 BSG",
  },
  {
    slug: "dummy-data",
    unit: "455 Base Services Group Kano",
    description:
      "The 455 Base Services Group, located in Kano, provides base security, welfare services, accommodation, VIP reception, and barracks maintenance. It conducts aerodrome defence at MAKIA and internal security operations in liaison with other agencies.",
    abbreviation: "455 BSG",
  },
  {
    slug: "dummy-data",
    unit: "461 NAF Hospital Kaduna",
    description:
      "The 461 NAF Hospital, located in Kaduna, provides healthcare services to NAF personnel, dependants, and NHIS civilian enrollees. It collaborates with the 061 Aero Medical Centre to support air operations and conducts medical outreaches.",
    abbreviation: "461 NAFH",
  },
  {
    slug: "dummy-data",
    unit: "465 NAF Hospital Kano",
    description:
      "The 465 NAF Hospital in Kano provides primary, secondary, and selected tertiary healthcare services to NAF personnel, their dependants, and NHIS subscribers. It serves as a referral centre for various military and civil medical facilities and supports CIMIC initiatives through medical outreaches.",
    abbreviation: "465 NAFH",
  },
  {
    slug: "dummy-data",
    unit: "Air Traffic Services Training Centre",
    description:
      "The Air Traffic Services Training Centre (ATSTC) trains air traffic control officers, assistants, flight dispatchers, and other aviation specialists for the NAF, NA, and civil organizations. It develops capacity to sustain safe and efficient NAF air operations.",
    abbreviation: "ATSTC",
  },
  {
    slug: "dummy-data",
    unit: "Central Avionics Overhaul Calibration Centre Kaduna",
    description:
      "The Central Avionics Overhaul Calibration Centre, located in Kaduna, performs third- and fourth-line maintenance on avionics, instrumentation, and electrical systems across all NAF aircraft.",
    abbreviation: "CAOCC",
  },
  {
    slug: "dummy-data",
    unit: "Nigerian Air Force Institute of Safety Ipetu-Ijesha",
    description:
      "The Nigerian Air Force Institute of Safety (NAFIS), located in Ipetu-Ijesha, promotes safety through training and education. It develops programmes that help personnel identify hazards, analyse risks, and trains standard evaluators for the NAF Standards and Evaluation Branch.",
    abbreviation: "NAFIS",
  },
  {
    slug: "dummy-data",
    unit: "Nigerian Air Force School of Air Intelligence Makurdi",
    description:
      "The Nigerian Air Force School of Air Intelligence (NAFSAINT), located in Makurdi, trains intelligence personnel for the NAF. It develops capacity for intelligence and security operations and trains selected non-intelligence AFN personnel.",
    abbreviation: "NAFSAINT",
  },
  {
    slug: "dummy-data",
    unit: "Air Force Girls Comprehensive School Abuja",
    description:
      "The Air Force Girls Comprehensive School, located in Abuja, is a NAF boarding school dedicated to girls. It provides comprehensive secondary education and grooming to prepare them for challenges of life, including military-related responsibilities.",
    abbreviation: "AFGCS",
  },
];
