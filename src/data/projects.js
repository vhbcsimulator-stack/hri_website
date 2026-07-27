// Project catalogue shared by the Projects list and the Project Details page.
export const PROJECTS = [
  {
    id: 'hermosa-heights',
    name: 'Hermosa Heights',
    category: 'Residential',
    tag: 'Exclusive',
    location: 'Alfonso, Cavite',
    priceFrom: '₱2.8M',
    status: 'Now Selling',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    ],
    summary:
      'A thoughtfully planned residential community offering comfortable homes surrounded by natural scenery.',
    description:
      'Hermosa Heights is designed for families seeking comfort, security, and long-term value. Each home is built with functional spaces, refined interiors, and access to open green areas that make everyday living peaceful and rewarding.',
    features: ['Thoughtful Design', 'Refined Interiors', 'Peaceful Community', '24/7 Security'],
    specs: { lotArea: '120 sqm', floorArea: '80 sqm', bedrooms: 3, bathrooms: 2 },
  },
  {
    id: 'verde-commercial',
    name: 'Verde Commercial Park',
    category: 'Commercial',
    location: 'Tagaytay City',
    priceFrom: '₱6.5M',
    status: 'Pre-Selling',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
    ],
    summary:
      'Strategically positioned commercial lots suitable for businesses, rentals, and future ventures.',
    description:
      'Verde Commercial Park places your business where opportunity grows. Positioned along a high-traffic corridor, these commercial lots are ideal for retail, offices, and mixed-use developments with strong long-term appreciation.',
    features: ['Prime Location', 'High Foot Traffic', 'Flexible Lot Sizes', 'Wide Road Access'],
    specs: { lotArea: '250 sqm', floorArea: '—', bedrooms: 0, bathrooms: 2 },
  },
  {
    id: 'sunrise-farm-estates',
    name: 'Sunrise Farm Estates',
    category: 'Farm',
    location: 'Silang, Cavite',
    priceFrom: '₱3.9M',
    status: 'Now Selling',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80',
    ],
    summary:
      'Nature-inspired farm lots for a private retreat, agri-business, or a weekend escape.',
    description:
      'Sunrise Farm Estates offers spacious farm lots for those who value nature and long-term investment. Cultivate, build a rest house, or simply enjoy the fresh air — the choice is yours in this serene countryside setting.',
    features: ['Wide Open Space', 'Rich Soil', 'Cool Climate', 'Titled Lots'],
    specs: { lotArea: '1,000 sqm', floorArea: '—', bedrooms: 0, bathrooms: 0 },
  },
  {
    id: 'lakeside-leisure',
    name: 'Lakeside Leisure Residences',
    category: 'Leisure',
    tag: 'New',
    location: 'Talisay, Batangas',
    priceFrom: '₱5.2M',
    status: 'Pre-Selling',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80',
    ],
    summary:
      'Leisure homes with resort-style amenities and scenic lake and mountain views.',
    description:
      'Lakeside Leisure Residences blends relaxation and investment. Wake up to lake and mountain views, enjoy resort-style amenities, and own a property designed for both restful weekends and rewarding rental potential.',
    features: ['Lake Views', 'Resort Amenities', 'Clubhouse', 'Landscaped Grounds'],
    specs: { lotArea: '180 sqm', floorArea: '110 sqm', bedrooms: 4, bathrooms: 3 },
  },
]

export const getProject = (id) => PROJECTS.find((p) => p.id === id)
