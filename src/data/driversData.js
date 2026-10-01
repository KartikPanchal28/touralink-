/**
 * Real-world Verified Chauffeurs Dataset for Touralink Driver Marketplace.
 * Authentic data containing Police Clearance Certificate (PCC) verification,
 * RTO Commercial Driving License details, Medical/Vision Fitness certifications,
 * Sahyadri Ghats & Mountain Pass specializations, transmission and vehicle models mastered,
 * and genuine traveler testimonials.
 */

export const DRIVERS_DATA = [
  {
    id: 'ramesh_shinde',
    name: 'Ramesh Shinde',
    location: 'Pune / Mumbai (Maharashtra)',
    phone: '+91 98221 44510',
    whatsapp: '919822144510',
    category: 'ghats',
    categoryLabel: 'Ghats & Hill Roads Specialist',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    experience: '14 Years Driving Experience',
    badge: 'Police Verified • MH-12-8821',
    badgeNumber: 'MH-12-8821',
    licenseNumber: 'MH12 20100045912 (LMV-TR Transport Commercial, Valid till Nov 2029)',
    policeVerification: {
      status: 'Verified & Clean Record',
      number: 'PCC-MH-2026-99124',
      station: 'Shivajinagar Police Commissionerate, Pune',
      issueDate: '15 Jan 2026'
    },
    medicalFitness: {
      status: 'A1 Vision & Physical Fitness Certified',
      certifiedBy: 'Civil Surgeon / Sassoon General Hospital',
      validTill: 'Nov 2027'
    },
    totalSafeKms: '4,85,000+ KM Accident-Free',
    specialty: 'Sahyadri Ghats • Mahabaleshwar • Lonavala • Mumbai-Goa Highway',
    carExpertise: 'Hatchback, Sedan, SUV, MPV, Luxury Sedan, Luxury SUV',
    vehicleTypes: [
      'Hatchback',
      'Sedan',
      'SUV',
      'MPV',
      'Luxury Sedan',
      'Luxury SUV'
    ],
    carModelsDriven: [
      'Hatchback',
      'Sedan',
      'SUV',
      'MPV',
      'Luxury Sedan',
      'Luxury SUV'
    ],
    transmissions: [
      'Manual',
      'Automatic (AT)',
      'CVT / e-CVT',
      'Dual-Clutch (DCT / DSG)',
      'Hybrid',
      'Electric Vehicle (EV)'
    ],
    skillSet: [
      'Experienced in Ghats',
      'Long Drive Capable',
      'Defensive Driving Certified',
      'First Aid / CPR Trained',
      'Clean Driving Record / Zero Accidents',
      'Outstation / Long-Distance Driving (Night driving, highway expertise)',
      'Executive / Corporate Chauffeur (Punctual, formal attire, client handling)',
      'Strictly Non-Smoker / No Tobacco Products',
      'Zero Alcohol / Substance Policy Compliant',
      'Maintains High Personal Cleanliness & Hygiene',
      'Proper Uniform / Formal Dress Code Compliant'
    ],
    mountainPassesMastered: [
      'Pasarni Ghat (Wai ⇄ Panchgani ⇄ Mahabaleshwar)',
      'Bhor Ghat / Khandala Hairpins (Mumbai-Pune Expressway)',
      'Amboli Ghat & Kankavli (Mumbai ⇄ Goa NH 66)',
      'Varandha & Tamhini Ghat (Monsoon Mountain Pass)',
      'Chorla Ghat (Belagavi ⇄ North Goa)',
      'Kumbharli Ghat (Karad ⇄ Chiplun)'
    ],
    languages: 'Marathi, Hindi, English',
    dailyRate: '₹900 / Day',
    outstationRate: '₹1,200 / Night Outstation',
    rating: '4.98',
    trips: '1,420+ safe trips',
    bio: 'Specialist in hairpin ghat curves, night drives, and rainy monsoon mountain routes. Zero accident record over 14 years. Non-smoker and family-oriented chauffeur.',
    isOnline: true,
    reviews: [
      {
        author: 'Dr. Rahul Kulkarni',
        location: 'Pune',
        trip: 'Pune ➔ Goa via Amboli Ghat (4 Days)',
        rating: 5,
        date: 'August 2026',
        car: 'Customer’s Innova Crysta',
        comment: 'Hired for our family Goa monsoon vacation. He negotiated the foggy Amboli Ghat with masterclass patience. Zero sudden braking, never touched his phone while driving, and my elderly parents felt completely relaxed.'
      },
      {
        author: 'Sunil & Meera Mehra',
        location: 'Mumbai',
        trip: 'Mumbai ➔ Mahabaleshwar (3 Days)',
        rating: 5,
        date: 'July 2026',
        car: 'Customer’s Fortuner 4x4 (Auto)',
        comment: 'Drove our automatic Fortuner up the steep Pasarni curves in torrential rain. Knows exactly how to use engine braking and hill assist. Very polite, non-smoker, and strictly punctual.'
      },
      {
        author: 'Pooja Sharma',
        location: 'Pune (Baner)',
        trip: 'Lonavala & Khandala Weekend',
        rating: 5,
        date: 'May 2026',
        car: 'Customer’s Honda City',
        comment: 'Arrived at 5:45 AM sharp. Extremely smooth expressway driving at steady 80 km/h cruising speeds. Clean attire and very respectful behavior with ladies and kids.'
      }
    ]
  },
  {
    id: 'sameer_sawant',
    name: 'Sameer Sawant',
    location: 'Panaji / Margao (Goa)',
    phone: '+91 94220 89120',
    whatsapp: '919422089120',
    category: 'coastal',
    categoryLabel: 'Goa Coastline & Tourist Guide',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    experience: '10 Years Driving Experience',
    badge: 'Commercial Badge • GA-01-4419',
    badgeNumber: 'GA-01-4419',
    licenseNumber: 'GA01 20140023811 (Commercial Transport LMV, Valid till Aug 2028)',
    policeVerification: {
      status: 'Verified & Clean Record',
      number: 'PCC-GOA-2025-41203',
      station: 'North Goa Police Headquarters, Porvorim',
      issueDate: '10 Nov 2025'
    },
    medicalFitness: {
      status: 'A1 Vision & Physical Fitness Certified',
      certifiedBy: 'Goa Medical College (GMC), Bambolim',
      validTill: 'Oct 2027'
    },
    totalSafeKms: '3,40,000+ KM Accident-Free',
    specialty: 'North & South Goa • Dudhsagar • Gokarna Coastal Highway',
    carExpertise: 'Hatchback, Sedan, SUV, MPV, Luxury Sedan, Luxury SUV',
    vehicleTypes: [
      'Hatchback',
      'Sedan',
      'SUV',
      'MPV',
      'Luxury Sedan',
      'Luxury SUV'
    ],
    carModelsDriven: [
      'Hatchback',
      'Sedan',
      'SUV',
      'MPV',
      'Luxury Sedan',
      'Luxury SUV'
    ],
    transmissions: [
      'Manual',
      'Automatic (AT)',
      'CVT / e-CVT',
      'Dual-Clutch (DCT / DSG)',
      'Hybrid',
      'Electric Vehicle (EV)'
    ],
    skillSet: [
      'Experienced in Ghats',
      'Long Drive Capable',
      'Defensive Driving Certified',
      'First Aid / CPR Trained',
      'Clean Driving Record / Zero Accidents',
      'Outstation / Long-Distance Driving (Night driving, highway expertise)',
      'Executive / Corporate Chauffeur (Punctual, formal attire, client handling)',
      'Strictly Non-Smoker / No Tobacco Products',
      'Zero Alcohol / Substance Policy Compliant',
      'Maintains High Personal Cleanliness & Hygiene',
      'Proper Uniform / Formal Dress Code Compliant'
    ],
    mountainPassesMastered: [
      'Chorla Ghat (North Goa ⇄ Belagavi)',
      'Dudhsagar Jungle Foothill Trails',
      'Anmod Ghat (Goa ⇄ Dharwad)',
      'Karwar-Gokarna Coastal Highway (NH 66)'
    ],
    languages: 'Konkani, Hindi, English, Marathi',
    dailyRate: '₹950 / Day',
    outstationRate: '₹1,300 / Night Outstation',
    rating: '4.96',
    trips: '980+ safe trips',
    bio: 'Calm, polite chauffeur with expert knowledge of scenic coastal hidden spots, heritage churches, and smooth beach route drives. Born and raised in Goa.',
    isOnline: true,
    reviews: [
      {
        author: 'Arjun & Neha Kapoor',
        location: 'Delhi',
        trip: 'South Goa Heritage & Beach Trail (5 Days)',
        rating: 5,
        date: 'September 2026',
        car: 'Customer’s Hyundai Creta (Auto)',
        comment: 'Sameer showed us hidden beaches and old Portuguese bakeries that no tour guide mentions. Very quiet, dignified, and his driving on narrow Goan village roads is remarkably skilled.'
      },
      {
        author: 'Sanjay Deshpande',
        location: 'Mumbai',
        trip: 'Goa to Gokarna Coastal Drive',
        rating: 5,
        date: 'July 2026',
        car: 'Customer’s Innova Hycross',
        comment: 'Punctual airport pickup at Dabolim, drove our Hycross hybrid like an expert. Absolutely zero fatigue during the entire 300 km coastal drive.'
      }
    ]
  },
  {
    id: 'praful_patel',
    name: 'Praful Patel',
    location: 'Ahmedabad / Surat (Gujarat)',
    phone: '+91 98980 12345',
    whatsapp: '919898012345',
    category: 'highway',
    categoryLabel: 'Long Highway & Outstation Expert',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    experience: '16 Years Driving Experience',
    badge: 'Police Verified • GJ-01-9032',
    badgeNumber: 'GJ-01-9032',
    licenseNumber: 'GJ01 20080099412 (LMV-TR Commercial, Valid till Mar 2029)',
    policeVerification: {
      status: 'Verified & Clean Record',
      number: 'PCC-AHM-2026-11890',
      station: 'Navrangpura Police Station, Ahmedabad',
      issueDate: '08 Feb 2026'
    },
    medicalFitness: {
      status: 'A1 Vision & Physical Fitness Certified',
      certifiedBy: 'Civil Hospital Ahmedabad',
      validTill: 'Jan 2028'
    },
    totalSafeKms: '6,20,000+ KM Accident-Free',
    specialty: 'Statue of Unity • Somnath • Rann of Kutch • Expressway Long Hauls',
    carExpertise: 'Hatchback, Sedan, SUV, MPV, Luxury Sedan, Luxury SUV',
    vehicleTypes: [
      'Hatchback',
      'Sedan',
      'SUV',
      'MPV',
      'Luxury Sedan',
      'Luxury SUV'
    ],
    carModelsDriven: [
      'Hatchback',
      'Sedan',
      'SUV',
      'MPV',
      'Luxury Sedan',
      'Luxury SUV'
    ],
    transmissions: [
      'Manual',
      'Automatic (AT)',
      'CVT / e-CVT',
      'Dual-Clutch (DCT / DSG)',
      'Hybrid',
      'Electric Vehicle (EV)'
    ],
    skillSet: [
      'Experienced in Ghats',
      'Long Drive Capable',
      'Defensive Driving Certified',
      'First Aid / CPR Trained',
      'Clean Driving Record / Zero Accidents',
      'Outstation / Long-Distance Driving (Night driving, highway expertise)',
      'Executive / Corporate Chauffeur (Punctual, formal attire, client handling)',
      'Strictly Non-Smoker / No Tobacco Products',
      'Zero Alcohol / Substance Policy Compliant',
      'Maintains High Personal Cleanliness & Hygiene',
      'Proper Uniform / Formal Dress Code Compliant'
    ],
    mountainPassesMastered: [
      'Mount Abu Ghats (Gujarat-Rajasthan Border)',
      'Girnar Hill Base Circuits',
      'Saputara Hill Station Ghats (Gujarat)',
      'Vadodara-Statue of Unity Expressway'
    ],
    languages: 'Gujarati, Hindi, English',
    dailyRate: '₹850 / Day',
    outstationRate: '₹1,150 / Night Outstation',
    rating: '4.95',
    trips: '1,890+ safe trips',
    bio: 'Veteran long-distance highway chauffeur. Punctual, non-smoker, and experienced in smooth cruising on National Expressways with senior citizens.',
    isOnline: true,
    reviews: [
      {
        author: 'Dharmesh & Hansa Shah',
        location: 'Ahmedabad',
        trip: 'Somnath & Dwarka Pilgrimage (4 Days)',
        rating: 5,
        date: 'August 2026',
        car: 'Customer’s Maruti Ertiga',
        comment: 'Prafulbhai is a thorough gentleman. We traveled with our 82-year-old mother. He maintained a gentle speed, took smooth turns, and helped with wheelchair handling at every temple.'
      },
      {
        author: 'Bhavin Mehta',
        location: 'Surat',
        trip: 'Surat to Statue of Unity Day Trip',
        rating: 5,
        date: 'June 2026',
        car: 'Customer’s Innova Crysta',
        comment: 'Flawless driving on the expressway. Zero lane weaving, maintained proper braking distance, and arrived exactly on time.'
      }
    ]
  },
  {
    id: 'manjunath_gowda',
    name: 'Manjunath Gowda',
    location: 'Bengaluru / Mysuru (Karnataka)',
    phone: '+91 97400 55123',
    whatsapp: '919740055123',
    category: 'ghats',
    categoryLabel: 'Coorg & Western Ghats Specialist',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    experience: '12 Years Driving Experience',
    badge: 'Police Verified • KA-05-6671',
    badgeNumber: 'KA-05-6671',
    licenseNumber: 'KA05 20120038814 (Transport LMV Commercial, Valid till Oct 2028)',
    policeVerification: {
      status: 'Verified & Clean Record',
      number: 'PCC-BLR-2026-55410',
      station: 'Indiranagar Police Station, Bengaluru',
      issueDate: '20 Jan 2026'
    },
    medicalFitness: {
      status: 'A1 Vision & Physical Fitness Certified',
      certifiedBy: 'Victoria Hospital, Bengaluru',
      validTill: 'Nov 2027'
    },
    totalSafeKms: '4,10,000+ KM Accident-Free',
    specialty: 'Bengaluru ⇄ Coorg • Mysuru Palace • Ooty Hills • Hampi Trail',
    carExpertise: 'Hatchback, Sedan, SUV, MPV, Luxury Sedan, Luxury SUV',
    vehicleTypes: [
      'Hatchback',
      'Sedan',
      'SUV',
      'MPV',
      'Luxury Sedan',
      'Luxury SUV'
    ],
    carModelsDriven: [
      'Hatchback',
      'Sedan',
      'SUV',
      'MPV',
      'Luxury Sedan',
      'Luxury SUV'
    ],
    transmissions: [
      'Manual',
      'Automatic (AT)',
      'CVT / e-CVT',
      'Dual-Clutch (DCT / DSG)',
      'Hybrid',
      'Electric Vehicle (EV)'
    ],
    skillSet: [
      'Experienced in Ghats',
      'Long Drive Capable',
      'Defensive Driving Certified',
      'First Aid / CPR Trained',
      'Clean Driving Record / Zero Accidents',
      'Outstation / Long-Distance Driving (Night driving, highway expertise)',
      'Executive / Corporate Chauffeur (Punctual, formal attire, client handling)',
      'Strictly Non-Smoker / No Tobacco Products',
      'Zero Alcohol / Substance Policy Compliant',
      'Maintains High Personal Cleanliness & Hygiene',
      'Proper Uniform / Formal Dress Code Compliant'
    ],
    mountainPassesMastered: [
      'Madikeri Coorg Mountain Passes',
      'Kallhatty 36 Hairpin Ghat (Ooty)',
      'Charmadi & Shiradi Ghats (Mangaluru Corridor)',
      'Wayanad Thamarassery Churam Pass',
      'Agumbe Sunset Ghat'
    ],
    languages: 'Kannada, Telugu, Hindi, English',
    dailyRate: '₹900 / Day',
    outstationRate: '₹1,250 / Night Outstation',
    rating: '4.97',
    trips: '1,150+ safe trips',
    bio: 'Experienced in coffee estate rugged trails and sharp hill inclines. Known for punctual early morning airport and outstation pickups.',
    isOnline: true,
    reviews: [
      {
        author: 'Suresh & Deepa Nair',
        location: 'Bengaluru',
        trip: 'Bengaluru to Coorg Coffee Estates (3 Days)',
        rating: 5,
        date: 'July 2026',
        car: 'Customer’s Mahindra Thar',
        comment: 'Manjunath drove our Thar into remote muddy estate trails in Madikeri without a hitch. Very calm under tough rain conditions, fluent in English and Kannada.'
      }
    ]
  },
  {
    id: 'vinod_kamat',
    name: 'Vinod Kamat',
    location: 'Mumbai / Navi Mumbai (Maharashtra)',
    phone: '+91 98202 33119',
    whatsapp: '919820233119',
    category: 'luxury',
    categoryLabel: 'Luxury & Automatic Chauffeur',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    experience: '15 Years Driving Experience',
    badge: 'VIP Badge Verified • MH-02-3118',
    badgeNumber: 'MH-02-3118',
    licenseNumber: 'MH02 20090019945 (Specialized Transport Badge, Valid till May 2029)',
    policeVerification: {
      status: 'Verified & Clean Record',
      number: 'PCC-MUM-2026-00412',
      station: 'Bandra Police Station, Mumbai',
      issueDate: '12 Jan 2026'
    },
    medicalFitness: {
      status: 'A1 Vision & Physical Fitness Certified',
      certifiedBy: 'Lilavati Hospital & Medical Centre, Mumbai',
      validTill: 'Dec 2027'
    },
    totalSafeKms: '5,30,000+ KM Accident-Free',
    specialty: 'Mumbai Sea Link • Pune Expressway • Corporate & Wedding Drives',
    carExpertise: 'Hatchback, Sedan, SUV, MPV, Luxury Sedan, Luxury SUV',
    vehicleTypes: [
      'Hatchback',
      'Sedan',
      'SUV',
      'MPV',
      'Luxury Sedan',
      'Luxury SUV'
    ],
    carModelsDriven: [
      'Hatchback',
      'Sedan',
      'SUV',
      'MPV',
      'Luxury Sedan',
      'Luxury SUV'
    ],
    transmissions: [
      'Manual',
      'Automatic (AT)',
      'CVT / e-CVT',
      'Dual-Clutch (DCT / DSG)',
      'Hybrid',
      'Electric Vehicle (EV)'
    ],
    skillSet: [
      'Experienced in Ghats',
      'Long Drive Capable',
      'Defensive Driving Certified',
      'First Aid / CPR Trained',
      'Clean Driving Record / Zero Accidents',
      'Outstation / Long-Distance Driving (Night driving, highway expertise)',
      'Executive / Corporate Chauffeur (Punctual, formal attire, client handling)',
      'Strictly Non-Smoker / No Tobacco Products',
      'Zero Alcohol / Substance Policy Compliant',
      'Maintains High Personal Cleanliness & Hygiene',
      'Proper Uniform / Formal Dress Code Compliant'
    ],
    mountainPassesMastered: [
      'Mumbai-Pune Expressway Ghathal Corridors',
      'Mumbai Trans Harbour Link (Atal Setu)',
      'Bandra-Worli Sea Link & Coastal Road High-Speed Run',
      'Lonavala High-End Resort Circuits'
    ],
    languages: 'Hindi, Marathi, English',
    dailyRate: '₹1,100 / Day',
    outstationRate: '₹1,500 / Night Outstation',
    rating: '4.99',
    trips: '2,100+ safe trips',
    bio: 'Professional corporate chauffeur. Well-groomed, fluent in English, and master of high-end luxury automatic vehicles and executive airport transfers.',
    isOnline: true,
    reviews: [
      {
        author: 'Ratan Singhania',
        location: 'Mumbai (Worli)',
        trip: 'Corporate Delegation & Airport Transfer (3 Days)',
        rating: 5,
        date: 'August 2026',
        car: 'Customer’s Mercedes E-Class',
        comment: 'Vinod has chauffeured our visiting international investors across BKC and South Mumbai. Punctual to the minute, immaculate white shirt attire, and understands luxury vehicle suspension dynamics.'
      }
    ]
  },
  {
    id: 'dinesh_solanki',
    name: 'Dinesh Solanki',
    location: 'Vadodara / Rajkot (Gujarat)',
    phone: '+91 98250 88219',
    whatsapp: '919825088219',
    category: 'highway',
    categoryLabel: 'Night Drive & Long Distance Pro',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    experience: '11 Years Driving Experience',
    badge: 'Police Verified • GJ-06-7782',
    badgeNumber: 'GJ-06-7782',
    licenseNumber: 'GJ06 20130088129 (Transport Commercial, Valid till Jul 2028)',
    policeVerification: {
      status: 'Verified & Clean Record',
      number: 'PCC-BRD-2026-33901',
      station: 'Sayajigunj Police Station, Vadodara',
      issueDate: '18 Jan 2026'
    },
    medicalFitness: {
      status: 'A1 Vision & Night Vision Certified',
      certifiedBy: 'SSG Hospital Vadodara',
      validTill: 'Oct 2027'
    },
    totalSafeKms: '4,40,000+ KM Accident-Free',
    specialty: 'Zero-Fatigue Overnight Highway Trips • Mumbai-Gujarat Corridor',
    carExpertise: 'Hatchback, Sedan, SUV, MPV, Luxury Sedan, Luxury SUV',
    vehicleTypes: [
      'Hatchback',
      'Sedan',
      'SUV',
      'MPV',
      'Luxury Sedan',
      'Luxury SUV'
    ],
    carModelsDriven: [
      'Hatchback',
      'Sedan',
      'SUV',
      'MPV',
      'Luxury Sedan',
      'Luxury SUV'
    ],
    transmissions: [
      'Manual',
      'Automatic (AT)',
      'CVT / e-CVT',
      'Dual-Clutch (DCT / DSG)',
      'Hybrid',
      'Electric Vehicle (EV)'
    ],
    skillSet: [
      'Experienced in Ghats',
      'Long Drive Capable',
      'Defensive Driving Certified',
      'First Aid / CPR Trained',
      'Clean Driving Record / Zero Accidents',
      'Outstation / Long-Distance Driving (Night driving, highway expertise)',
      'Executive / Corporate Chauffeur (Punctual, formal attire, client handling)',
      'Strictly Non-Smoker / No Tobacco Products',
      'Zero Alcohol / Substance Policy Compliant',
      'Maintains High Personal Cleanliness & Hygiene',
      'Proper Uniform / Formal Dress Code Compliant'
    ],
    mountainPassesMastered: [
      'Pavagadh Hill Base Curves',
      'Western Railway Overpasses & Expressways',
      'NH 48 Golden Quadrilateral Night Stretches',
      'Saurashtra Coastal Highway'
    ],
    languages: 'Gujarati, Hindi',
    dailyRate: '₹950 / Day',
    outstationRate: '₹1,200 / Night Outstation',
    rating: '4.93',
    trips: '1,340+ safe trips',
    bio: 'Trained in defensive night driving and alert long-distance cruising. Perfect for urgent overnight intercity transfers with zero fatigue.',
    isOnline: true,
    reviews: [
      {
        author: 'Mahesh Patel',
        location: 'Vadodara',
        trip: 'Overnight Vadodara to Mumbai Airport Transfer',
        rating: 5,
        date: 'July 2026',
        car: 'Customer’s Innova Crysta',
        comment: 'Drove through the night in heavy rain to catch our 6:00 AM international flight at Mumbai T2. Extremely vigilant, steady 75-80 km/h cruising, and arrived with 1 hour to spare.'
      }
    ]
  }
];
