import { PersonalSafetyPlan } from '../types';

export const DEFAULT_SAFETY_PLAN: PersonalSafetyPlan = {
  trustedContacts: [
    {
      id: 'tc-1',
      name: 'Primary Trusted Friend',
      relationship: 'Close Friend / College Peer',
      phone: '',
      notes: 'Has a spare hostel/room key and knows my daily schedule.',
      knowsCodeWord: true,
      canHost: true,
    },
    {
      id: 'tc-2',
      name: 'Trusted Sibling / Guardian',
      relationship: 'Family Member',
      phone: '',
      notes: 'Available for transport, medical emergencies, or urgent calls.',
      knowsCodeWord: true,
      canHost: true,
    },
  ],
  safePlaces: [
    {
      id: 'sp-1',
      name: 'Campus Central Library (24-Hour Reading Hall)',
      type: 'Campus',
      addressOrLocation: 'Campus Academic Block, Level 1',
      howToGetThere: '5-minute walk; populated, well-lit, and CCTV-monitored.',
      contactPerson: 'Library Security Desk',
    },
    {
      id: 'sp-2',
      name: 'University Main Security Booth / Proctor Office',
      type: 'Campus',
      addressOrLocation: 'Main Campus Entrance Gate',
      howToGetThere: 'Guard stationed 24/7 with emergency vehicle access.',
      contactPerson: 'Campus Chief Security Officer',
    },
    {
      id: 'sp-3',
      name: 'Nearest Government Hospital / Civil Hospital Emergency',
      type: 'Medical / Police',
      addressOrLocation: 'Nearest Government Medical College or District Hospital',
      howToGetThere: 'Cab / Ambulance / Metro; free emergency medical care by law.',
      contactPerson: 'Casualty Medical Officer (CMO)',
    },
  ],
  emergencyChecklist: [
    {
      id: 'chk-1',
      step: 'Move immediately to a populated, well-lit space or lockable room.',
      category: 'Immediate',
      completed: false,
    },
    {
      id: 'chk-2',
      step: 'Send your secret distress code word or emoji to your trusted contact.',
      category: 'Immediate',
      completed: false,
    },
    {
      id: 'chk-3',
      step: 'Activate Emergency SOS on your phone (press Power button 5 times rapidly).',
      category: 'Immediate',
      completed: false,
    },
    {
      id: 'chk-4',
      step: 'Call National Emergency 112 or Women Helpline 1091 if in imminent danger.',
      category: 'Transport',
      completed: false,
    },
    {
      id: 'chk-5',
      step: 'Preserve physical evidence: do not wash, shower, or change clothing if assault occurred.',
      category: 'Medical',
      completed: false,
    },
    {
      id: 'chk-6',
      step: 'Preserve digital evidence: take full-screen screenshots displaying sender phone/handle and timestamp.',
      category: 'Digital',
      completed: false,
    },
    {
      id: 'chk-7',
      step: 'Request a Zero FIR at any police station; police cannot reject based on jurisdiction.',
      category: 'Legal',
      completed: false,
    },
  ],
  codeWord: {
    phrase: 'Did you find that blue chemistry notebook?',
    meaning: 'I am in an uncomfortable or unsafe situation. Call me immediately and pretend there is an urgent family/college emergency, or come to my location.',
    duressEmoji: '🔴',
    instructionsForContact: 'If I text this exact code phrase or send the red circle emoji, call me right away. If I do not pick up after two attempts, dial 112 with my last known location.',
  },
  digitalSafety: {
    locationSharingOff: false,
    passwordsUpdated: false,
    twoFactorEnabled: false,
    screenshotsPreserved: false,
    deviceMonitoredWarning: false,
    emergencySosConfigured: false,
    customTips: [
      'Disable Google Maps Location Sharing and WhatsApp Live Location when moving to an undisclosed safe place.',
      'Use Private / Incognito browsing or clear browser history after visiting safety resources if your phone is monitored.',
      'Set up lock screen Emergency Contacts and Medical ID on iOS/Android so first responders can call without unlocking.',
      'Export WhatsApp/Instagram chat threads before an abusive party can unsend or delete messages.',
      'Store sensitive evidence screenshots in a locked folder (Google Photos Locked Folder or hidden album).'
    ],
  },
  supportPreferences: {
    preferredHelpline: '112 (National Emergency) & 1091 (Women in Distress)',
    nearestHospital: 'Government District Hospital / AIIMS',
    nearestPoliceStation: 'Nearest Police Station (Zero FIR right applies anywhere in India)',
    iccContact: 'Campus Internal Complaints Committee (ICC) Presiding Officer',
  },
  personalNotes: 'Keep ₹500–₹1,000 cash separate in my wallet. Ensure metro card has sufficient balance. Power bank kept in bag charged above 70%.',
  emergencyBagItems: 'College ID card, Aadhar card photocopy, phone charger, power bank, hostel spare key, daily prescription medication, emergency cash.',
};
