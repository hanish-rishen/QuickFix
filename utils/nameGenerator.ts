const firstNames = [
  "Aarav",
  "Arjun",
  "Aisha",
  "Diya",
  "Ishaan",
  "Kabir",
  "Kavya",
  "Krishna",
  "Meera",
  "Neha",
  "Priya",
  "Rahul",
  "Riya",
  "Rohan",
  "Shankar",
  "Tara",
  "Vihan",
  "Zara",
];

const lastNames = [
  "Kumar",
  "Singh",
  "Patel",
  "Sharma",
  "Verma",
  "Gupta",
  "Malhotra",
  "Reddy",
  "Nair",
  "Pillai",
  "Iyer",
  "Joshi",
  "Kapoor",
  "Mehta",
  "Shah",
  "Chauhan",
];

export const generateIndianName = () => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

// Define an interface to enforce type safety for the cities and localities
interface CityLocalities {
  [city: string]: string[];
}

const cityLocalities: CityLocalities = {
  Mumbai: ["Bandra", "Andheri", "Juhu", "Powai", "Worli", "Colaba"],
  Delhi: ["Hauz Khas", "Connaught Place", "Dwarka", "Rohini", "Saket"],
  Bangalore: ["Indiranagar", "Koramangala", "HSR Layout", "Whitefield"],
  Hyderabad: ["Banjara Hills", "Jubilee Hills", "Gachibowli", "Madhapur"],
  Chennai: ["T Nagar", "Adyar", "Anna Nagar", "Velachery", "Mylapore"],
  // ... add more cities and localities as needed
};

export const getRandomLocality = (cityName: string) => {
  const localities = cityLocalities[cityName] || ["Central"];
  return localities[Math.floor(Math.random() * localities.length)];
};

export const getRandomSpecialties = () => {
  const allSpecialties = [
    "Network Setup",
    "PC Repair",
    "Data Recovery",
    "Virus Removal",
    "Smart Home",
    "Cloud Setup",
    "WiFi Troubleshooting",
    "Hardware Repair",
    "Software Installation",
    "Security Systems",
  ];

  const count = Math.floor(Math.random() * 2) + 2; // 2-3 specialties
  const specialties = new Set<string>();

  while (specialties.size < count) {
    specialties.add(
      allSpecialties[Math.floor(Math.random() * allSpecialties.length)]
    );
  }

  return Array.from(specialties);
};
