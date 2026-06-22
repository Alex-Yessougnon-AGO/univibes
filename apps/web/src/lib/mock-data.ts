// =====================================================
// UNIVIBES — MOCK DATA
// =====================================================

export type MockCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string;  // Lucide icon name (e.g. "music", "mic", "sparkles")
  color: string;
};

export type MockOrganizer = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  description: string;
  verified: boolean;
  followersCount: number;
  eventsCount: number;
};

export type MockTicketType = {
  id: string;
  name: string;
  description?: string;
  price: number;
  remaining: number;
  total: number;
};

export type MockEvent = {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  location: string;
  city: string;
  university?: string;
  startDate: string;
  endDate: string;
  isFree: boolean;
  price?: number;
  lowestPrice?: number;
  status?: 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';
  views: number;
  favoritesCount: number;
  isFavorited: boolean;
  category: MockCategory;
  organizer: MockOrganizer;
  tags?: string[];
  tickets?: MockTicketType[];
};

export type Event = MockEvent;
export type EventCategory = MockCategory;

// =====================================================
// CATEGORIES
// =====================================================

export const CATEGORIES: MockCategory[] = [
  {
    id: "cat-1",
    name: "Musique",
    slug: "musique",
    icon: "music",
    color: "#7C3AED",
  },
  {
    id: "cat-2",
    name: "Conférences",
    slug: "conferences",
    icon: "mic",
    color: "#0F5132",
  },
  { id: "cat-3", name: "Galas", slug: "galas", icon: "sparkles", color: "#9A7D1F" },
  {
    id: "cat-4",
    name: "Hackathons",
    slug: "hackathons",
    icon: "code",
    color: "#0672A3",
  },
  { id: "cat-5", name: "Sports", slug: "sports", icon: "trophy", color: "#DC2626" },
  {
    id: "cat-6",
    name: "Culture",
    slug: "culture",
    icon: "palette",
    color: "#C2410C",
  },
  {
    id: "cat-7",
    name: "Networking",
    slug: "networking",
    icon: "handshake",
    color: "#046582",
  },
  {
    id: "cat-8",
    name: "Afterwork",
    slug: "afterwork",
    icon: "glass-water",
    color: "#BE185D",
  },
];

// =====================================================
// CITIES
// =====================================================

export const CITIES: string[] = [
  "Cotonou",
  "Abomey-Calavi",
  "Porto-Novo",
  "Parakou",
  "Bohicon",
  "Lokossa",
  "Natitingou",
  "Kandi",
];

// =====================================================
// UNIVERSITIES
// =====================================================

export const UNIVERSITIES: string[] = [
  "UAC - Université d'Abomey-Calavi",
  "ENEAM",
  "EPAC",
  "FASEG",
  "FSS",
  "UNSTIM",
  "Université de Parakou",
  "UCAO",
  "Université de Lokossa",
  "Université de Natitingou",
];

// =====================================================
// ORGANIZERS
// =====================================================

export const ORGANIZERS: MockOrganizer[] = [
  {
    id: "org-1",
    name: "BDE FASEG",
    slug: "bde-faseg",
    logoUrl: "https://picsum.photos/seed/org1/200/200",
    description:
      "Le Bureau des Étudiants de la FASEG organise les meilleurs événements du campus depuis 2015. Galas, soirées, conférences et bien plus.",
    verified: true,
    followersCount: 4200,
    eventsCount: 24,
  },
  {
    id: "org-2",
    name: "TECH HUB UAC",
    slug: "tech-hub-uac",
    logoUrl: "https://picsum.photos/seed/org2/200/200",
    description:
      "Le hub technologique de l'UAC. Hackathons, workshops et conférences tech pour les étudiants passionnés d'innovation.",
    verified: true,
    followersCount: 3100,
    eventsCount: 18,
  },
  {
    id: "org-3",
    name: "Club Culturel UAC",
    slug: "club-culturel-uac",
    logoUrl: "https://picsum.photos/seed/org3/200/200",
    description:
      "Promotion de la culture africaine à travers des événements artistiques, des expositions et des spectacles.",
    verified: false,
    followersCount: 1850,
    eventsCount: 12,
  },
  {
    id: "org-4",
    name: "SportCampus BJ",
    slug: "sportcampus-bj",
    logoUrl: "https://picsum.photos/seed/org4/200/200",
    description:
      "Organisation des compétitions sportives inter-universitaires au Bénin.",
    verified: true,
    followersCount: 2700,
    eventsCount: 31,
  },
  {
    id: "org-5",
    name: "Élite Events",
    slug: "elite-events",
    logoUrl: "https://picsum.photos/seed/org5/200/200",
    description:
      "Agence événementielle spécialisée dans les galas et soirées de gala pour le monde universitaire.",
    verified: true,
    followersCount: 5600,
    eventsCount: 42,
  },
];

// =====================================================
// EVENTS
// =====================================================

export const EVENTS: MockEvent[] = [
  {
    id: "evt-1",
    title: "Gala de Fin d'Année FASEG 2025",
    slug: "gala-fin-annee-faseg-2025",
    description:
      "Le grand rendez-vous annuel des étudiants de la FASEG est de retour ! Une nuit inoubliable de musique live, de danse et de célébration. Dress code : tenue de soirée. Au programme : concert, awards, buffet, open bar et after-party.\n\nNe manquez pas cet événement qui réunit chaque année plus de 800 étudiants dans une ambiance électrique. Les meilleures associations, les meilleures performances et les souvenirs qui durent toute une vie.",
    coverImage: "https://picsum.photos/seed/evt1/800/500",
    location: "Palais des Congrès de Cotonou",
    city: "Cotonou",
    university: "UAC - Université d'Abomey-Calavi",
    startDate: "2025-07-19T20:00:00",
    endDate: "2025-07-20T04:00:00",
    isFree: false,
    price: 5000,
    views: 12400,
    favoritesCount: 843,
    lowestPrice: 5000,
    isFavorited: false,
    category: CATEGORIES[2],
    organizer: ORGANIZERS[0],
    tags: ["gala", "soirée", "danse", "musique live"],
    tickets: [
      {
        id: "tkt-1a",
        name: "Standard",
        description: "Accès salle principale",
        price: 5000,
        remaining: 120,
        total: 400,
      },
      {
        id: "tkt-1b",
        name: "VIP",
        description: "Table réservée + open bar + accès backstage",
        price: 15000,
        remaining: 14,
        total: 50,
      },
      {
        id: "tkt-1c",
        name: "VVIP",
        description: "Lounge privé + accès total + goodie bag",
        price: 35000,
        remaining: 3,
        total: 10,
      },
    ],
  },
  {
    id: "evt-2",
    title: "HackBénin — 48h Innovation Numérique",
    slug: "hackbenin-48h-innovation-numerique",
    description:
      "Le plus grand hackathon étudiant du Bénin revient pour sa 5ème édition. 48 heures non-stop pour résoudre des problèmes réels à travers la technologie. Des équipes de 3 à 5 personnes s'affrontent sur des thématiques : Fintech, Agritech, Healthtech.\n\nPrix à gagner : 500 000 FCFA pour le 1er, 250 000 FCFA pour le 2ème, 100 000 FCFA pour le 3ème. Mentorat par des professionnels du secteur tech.",
    coverImage: "https://picsum.photos/seed/evt2/800/500",
    location: "EPAC — Campus d'Abomey-Calavi",
    city: "Abomey-Calavi",
    university: "EPAC",
    startDate: "2025-07-25T08:00:00",
    endDate: "2025-07-27T10:00:00",
    isFree: true,
    views: 8900,
    favoritesCount: 612,
    lowestPrice: 0,
    isFavorited: true,
    category: CATEGORIES[3],
    organizer: ORGANIZERS[1],
    tags: ["hackathon", "tech", "innovation", "coding"],
    tickets: [
      {
        id: "tkt-2a",
        name: "Participant",
        description: "Accès complet + repas + kit participant",
        price: 0,
        remaining: 45,
        total: 150,
      },
    ],
  },
  {
    id: "evt-3",
    title: "Conférence : L'Entrepreneuriat Étudiant en Afrique",
    slug: "conference-entrepreneuriat-etudiant-afrique",
    description:
      "Une conférence exceptionnelle réunissant les jeunes entrepreneurs les plus inspirants d'Afrique francophone. Speakers de 6 pays différents, panels interactifs et sessions de networking.\n\nIntervenants confirmés : PDG de startups à succès, investisseurs en capital-risque, et directeurs d'incubateurs. Une occasion unique pour pitcher votre idée devant des investisseurs.",
    coverImage: "https://picsum.photos/seed/evt3/800/500",
    location: "Amphithéâtre 500 — UAC",
    city: "Abomey-Calavi",
    university: "UAC - Université d'Abomey-Calavi",
    startDate: "2025-07-12T09:00:00",
    endDate: "2025-07-12T18:00:00",
    isFree: false,
    price: 2000,
    views: 6700,
    favoritesCount: 389,
    lowestPrice: 2000,
    isFavorited: false,
    category: CATEGORIES[1],
    organizer: ORGANIZERS[1],
    tags: ["entrepreneuriat", "business", "Afrique", "startup"],
    tickets: [
      {
        id: "tkt-3a",
        name: "Étudiant",
        price: 2000,
        remaining: 80,
        total: 200,
      },
      {
        id: "tkt-3b",
        name: "Professionnel",
        price: 5000,
        remaining: 25,
        total: 60,
      },
    ],
  },
  {
    id: "evt-4",
    title: "AfroBeats Night — Open Mic & DJ Set",
    slug: "afrobeats-night-open-mic-dj-set",
    description:
      "Une nuit dédiée à la musique afrobeat, afropop et afrofusion. Venez vibrer au rythme des meilleurs DJs de Cotonou et découvrir les talents de la scène musicale émergente. Open mic pour les artistes qui veulent se produire.\n\nAmbiance garantie, bonne musique, bonne vibes. Le rendez-vous de tous les amoureux de musique africaine contemporaine.",
    coverImage: "https://picsum.photos/seed/evt4/800/500",
    location: "Le Millénaire — Cotonou",
    city: "Cotonou",
    startDate: "2025-08-02T21:00:00",
    endDate: "2025-08-03T03:00:00",
    isFree: false,
    price: 3000,
    views: 5400,
    favoritesCount: 701,
    lowestPrice: 3000,
    isFavorited: false,
    category: CATEGORIES[0],
    organizer: ORGANIZERS[4],
    tags: ["afrobeat", "DJ", "musique", "soirée"],
    tickets: [
      {
        id: "tkt-4a",
        name: "Entrée simple",
        price: 3000,
        remaining: 200,
        total: 500,
      },
      {
        id: "tkt-4b",
        name: "Table VIP (4 pers.)",
        price: 50000,
        remaining: 6,
        total: 15,
      },
    ],
  },
  {
    id: "evt-5",
    title: "Tournoi de Football Inter-Facs",
    slug: "tournoi-football-inter-facs",
    description:
      "La compétition sportive la plus chaude du campus est de retour. 16 équipes représentant les différentes facultés s'affrontent pour le titre suprême. Ambiance de stade garantie, supporters déchaînés et matchs épiques.\n\nPhase de groupes sur 2 semaines, quarts de finale, demi-finales et grande finale. Venez supporter votre faculté !",
    coverImage: "https://picsum.photos/seed/evt5/800/500",
    location: "Stade UAC — Abomey-Calavi",
    city: "Abomey-Calavi",
    university: "UAC - Université d'Abomey-Calavi",
    startDate: "2025-07-08T14:00:00",
    endDate: "2025-07-08T20:00:00",
    isFree: true,
    views: 4200,
    favoritesCount: 258,
    lowestPrice: 0,
    isFavorited: false,
    category: CATEGORIES[4],
    organizer: ORGANIZERS[3],
    tags: ["football", "sport", "compétition"],
    tickets: [
      {
        id: "tkt-5a",
        name: "Entrée",
        description: "Accès tribune",
        price: 0,
        remaining: 800,
        total: 1000,
      },
    ],
  },
  {
    id: "evt-6",
    title: "Expo-Photo : Visages d'Afrique",
    slug: "expo-photo-visages-afrique",
    description:
      "Une exposition photographique exceptionnelle mettant en valeur les visages et les histoires des populations d'Afrique de l'Ouest. 40 photographes de 8 pays exposent leurs œuvres dans un parcours immersif.\n\nVisites guidées chaque jour à 10h et 15h. Vente de tirages disponible. Discussion avec les artistes le samedi.",
    coverImage: "https://picsum.photos/seed/evt6/800/500",
    location: "Centre Culturel Français — Cotonou",
    city: "Cotonou",
    startDate: "2025-08-10T10:00:00",
    endDate: "2025-08-17T18:00:00",
    isFree: false,
    price: 1000,
    views: 3100,
    favoritesCount: 195,
    lowestPrice: 1000,
    isFavorited: false,
    category: CATEGORIES[5],
    organizer: ORGANIZERS[2],
    tags: ["photo", "art", "culture", "exposition"],
    tickets: [
      { id: "tkt-6a", name: "Entrée", price: 1000, remaining: 300, total: 500 },
      {
        id: "tkt-6b",
        name: "Pass semaine",
        price: 5000,
        remaining: 40,
        total: 80,
      },
    ],
  },
  {
    id: "evt-7",
    title: "Speed Networking Étudiants — Promo 2025",
    slug: "speed-networking-etudiants-promo-2025",
    description:
      "L'événement networking de la rentrée ! En format speed-meeting, rencontrez en 2 heures des professionnels, des entrepreneurs et des alumni prêts à partager leurs expériences et ouvrir leurs réseaux.\n\n30 mentors disponibles, 150 étudiants participants. Format : 5 minutes par rencontre, tournante. Apportez vos cartes de visite !",
    coverImage: "https://picsum.photos/seed/evt7/800/500",
    location: "Hub Cotonou — Quartier Akpakpa",
    city: "Cotonou",
    startDate: "2025-08-15T17:00:00",
    endDate: "2025-08-15T20:00:00",
    isFree: false,
    price: 1500,
    views: 2800,
    favoritesCount: 310,
    lowestPrice: 1500,
    isFavorited: true,
    category: CATEGORIES[6],
    organizer: ORGANIZERS[0],
    tags: ["networking", "carrière", "rencontre"],
    tickets: [
      {
        id: "tkt-7a",
        name: "Étudiant",
        price: 1500,
        remaining: 60,
        total: 150,
      },
    ],
  },
  {
    id: "evt-8",
    title: "Campus Afterwork — Vendredi Vibes",
    slug: "campus-afterwork-vendredi-vibes",
    description:
      "Le rendez-vous mensuel pour décompresser après les partiels. Cocktails, pétanque, musique chill et bonnes discussions. Le spot parfait pour rencontrer des gens de différentes facultés dans une ambiance décontractée.\n\nBoissons à prix réduit, food trucks sur place. Pas de dress code, venez comme vous êtes !",
    coverImage: "https://picsum.photos/seed/evt8/800/500",
    location: "Rooftop Campus Bar — UAC",
    city: "Abomey-Calavi",
    university: "UAC - Université d'Abomey-Calavi",
    startDate: "2025-07-18T17:30:00",
    endDate: "2025-07-18T22:00:00",
    isFree: true,
    views: 1900,
    favoritesCount: 142,
    lowestPrice: 0,
    isFavorited: false,
    category: CATEGORIES[7],
    organizer: ORGANIZERS[4],
    tags: ["afterwork", "soirée", "détente"],
    tickets: [
      {
        id: "tkt-8a",
        name: "Entrée libre",
        price: 0,
        remaining: 200,
        total: 200,
      },
    ],
  },
  {
    id: "evt-9",
    title: "Workshop : Créer sa Startup en 1 Weekend",
    slug: "workshop-creer-startup-weekend",
    description:
      "En seulement deux jours, apprenez à valider une idée de startup, construire un MVP et pitcher devant des investisseurs. Encadré par des mentors de Google for Startups et des fondateurs de licornes africaines.",
    coverImage: "https://picsum.photos/seed/evt9/800/500",
    location: "ENEAM — Amphi 200",
    city: "Cotonou",
    university: "ENEAM",
    startDate: "2025-08-22T08:00:00",
    endDate: "2025-08-23T18:00:00",
    isFree: false,
    price: 3000,
    views: 4700,
    favoritesCount: 420,
    lowestPrice: 3000,
    isFavorited: false,
    category: CATEGORIES[1],
    organizer: ORGANIZERS[1],
    tags: ["startup", "workshop", "entrepreneuriat"],
    tickets: [
      {
        id: "tkt-9a",
        name: "Participant",
        price: 3000,
        remaining: 35,
        total: 80,
      },
    ],
  },
  {
    id: "evt-10",
    title: "Soirée Karaoké & Talents — BDE EPAC",
    slug: "soiree-karaoke-talents-bde-epac",
    description:
      "La grande soirée annuelle des talents de l'EPAC ! Karaoké, danse, humour et surprises. Tous les étudiants sont invités à monter sur scène et montrer ce qu'ils ont dans le ventre.",
    coverImage: "https://picsum.photos/seed/evt10/800/500",
    location: "Foyer EPAC — Abomey-Calavi",
    city: "Abomey-Calavi",
    university: "EPAC",
    startDate: "2025-09-05T19:00:00",
    endDate: "2025-09-06T01:00:00",
    isFree: false,
    price: 2500,
    views: 2200,
    favoritesCount: 178,
    lowestPrice: 2500,
    isFavorited: false,
    category: CATEGORIES[0],
    organizer: ORGANIZERS[2],
    tags: ["karaoké", "talents", "soirée"],
    tickets: [
      {
        id: "tkt-10a",
        name: "Entrée",
        price: 2500,
        remaining: 100,
        total: 250,
      },
    ],
  },
  {
    id: "evt-11",
    title: "Conférence IA & Santé en Afrique",
    slug: "conference-ia-sante-afrique",
    description:
      "Comment l'intelligence artificielle révolutionne la santé en Afrique subsaharienne ? Des experts en medtech, des médecins et des entrepreneurs partagent leurs expériences et visions.",
    coverImage: "https://picsum.photos/seed/evt11/800/500",
    location: "FSS — Amphithéâtre Principal",
    city: "Cotonou",
    university: "FSS",
    startDate: "2025-08-28T09:00:00",
    endDate: "2025-08-28T17:00:00",
    isFree: true,
    views: 3600,
    favoritesCount: 287,
    lowestPrice: 0,
    isFavorited: false,
    category: CATEGORIES[1],
    organizer: ORGANIZERS[1],
    tags: ["IA", "santé", "tech", "Afrique"],
    tickets: [
      {
        id: "tkt-11a",
        name: "Entrée libre",
        description: "Sur inscription",
        price: 0,
        remaining: 120,
        total: 200,
      },
    ],
  },
  {
    id: "evt-12",
    title: "Nuit des Arts — Festival Culturel Campus",
    slug: "nuit-des-arts-festival-culturel-campus",
    description:
      "Une nuit entière dédiée aux arts : musique traditionnelle, danse contemporaine, slam, peinture live et installations artistiques. Le festival culturel le plus attendu du campus.",
    coverImage: "https://picsum.photos/seed/evt12/800/500",
    location: "Esplanade UAC — Abomey-Calavi",
    city: "Abomey-Calavi",
    university: "UAC - Université d'Abomey-Calavi",
    startDate: "2025-09-12T18:00:00",
    endDate: "2025-09-13T02:00:00",
    isFree: false,
    price: 2000,
    views: 5100,
    favoritesCount: 467,
    lowestPrice: 2000,
    isFavorited: true,
    category: CATEGORIES[5],
    organizer: ORGANIZERS[2],
    tags: ["festival", "arts", "culture", "danse"],
    tickets: [
      {
        id: "tkt-12a",
        name: "Standard",
        price: 2000,
        remaining: 300,
        total: 600,
      },
      {
        id: "tkt-12b",
        name: "VIP",
        description: "Zone préférentielle + boissons",
        price: 8000,
        remaining: 20,
        total: 40,
      },
    ],
  },
];
