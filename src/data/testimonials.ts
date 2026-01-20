/**
 * Testimonials data from Google Reviews
 * Source: https://github.com/maksym-khrapa/stylehome
 */

export interface Testimonial {
  id: string;
  authorName: string;
  authorInitials?: string;
  authorAvatar?: string;
  rating: number;
  date: string;
  dateRelative: string; // e.g., "13 days ago", "2 months ago"
  text: string;
  fullText?: string;
  verified: boolean;
  source: 'google' | 'other';
}

export interface GoogleReviewsSummary {
  rating: number;
  totalReviews: number;
  reviewUrl?: string;
}

export const googleReviewsSummary: GoogleReviewsSummary = {
  rating: 5.0,
  totalReviews: 5,
  reviewUrl: 'https://g.page/r/CYJqJ8VqJ8VqEBM/review' // Update with actual Google Reviews URL
};

export const testimonials: Testimonial[] = [
  {
    id: 'dennis-serov',
    authorName: 'Dennis Serov',
    authorInitials: 'DS',
    rating: 5,
    date: '2026-01-07',
    dateRelative: '13 days ago',
    text: 'Extremely great company. I love how friendly and helpful Taras is. I will definitely use them again and...',
    fullText: 'Extremely great company. I love how friendly and helpful Taras is. I will definitely use them again and recommend them to others.',
    verified: true,
    source: 'google'
  },
  {
    id: 'dmitry-bibik',
    authorName: 'Дмитрий Бибик',
    authorInitials: 'ДБ',
    rating: 5,
    date: '2025-11-20',
    dateRelative: '2 months ago',
    text: 'Professional worker! Great job!',
    fullText: 'Professional worker! Great job!',
    verified: true,
    source: 'google'
  },
  {
    id: 'sasha-pasichny',
    authorName: 'Саша Пасичный',
    authorInitials: 'СП',
    rating: 5,
    date: '2025-11-18',
    dateRelative: '2 months ago',
    text: 'I worked with Style Homes LLC and was very impressed with the results. They create kitchens,...',
    fullText: 'I worked with Style Homes LLC and was very impressed with the results. They create kitchens, closets, and decorative furniture at the highest level. Every detail is well thought out — design, material quality, and precise installation. You can tell the team truly loves what they do.',
    verified: true,
    source: 'google'
  },
  {
    id: 'nataliia-chaika',
    authorName: 'Nataliia Chaika',
    authorInitials: 'NC',
    rating: 5,
    date: '2025-10-15',
    dateRelative: '3 months ago',
    text: 'Really happy with Style Homes! The guys did an amazing job — everything looks beautiful and the quality is great. They were easy to work with, always on time, and very professional. Totally recommend them if you want your project done right!',
    fullText: 'Really happy with Style Homes! The guys did an amazing job — everything looks beautiful and the quality is great. They were easy to work with, always on time, and very professional. Totally recommend them if you want your project done right!',
    verified: true,
    source: 'google'
  },
  {
    id: 'sergo-kushnarenko',
    authorName: 'Sergo Kushnarenko',
    authorInitials: 'SK',
    rating: 5,
    date: '2025-09-20',
    dateRelative: '4 months ago',
    text: 'Highly recommend Style Homes! I ordered all the finish work for my house from them — closets, pantry, doors, and trims. Everything turned out amazing! The quality is top-notch, clean, and modern.',
    fullText: 'Highly recommend Style Homes! I ordered all the finish work for my house from them — closets, pantry, doors, and trims. Everything turned out amazing! The quality is top-notch, clean, and modern.',
    verified: true,
    source: 'google'
  },
  {
    id: 'sasha-pasichnyi',
    authorName: 'Sasha Pasichnyi',
    authorInitials: 'SP',
    rating: 5,
    date: '2025-08-10',
    dateRelative: '5 months ago',
    text: 'I worked with Style Homes LLC and was very impressed with the results. They create kitchens, closets, and decorative furniture at the highest level. Every detail is well thought out — design, material quality, and precise installation. You can tell the team truly loves what they do.',
    fullText: 'I worked with Style Homes LLC and was very impressed with the results. They create kitchens, closets, and decorative furniture at the highest level. Every detail is well thought out — design, material quality, and precise installation. You can tell the team truly loves what they do.',
    verified: true,
    source: 'google'
  }
];

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/**
 * Format date relative (e.g., "13 days ago")
 */
export function formatDateRelative(date: string): string {
  const now = new Date();
  const reviewDate = new Date(date);
  const diffTime = Math.abs(now.getTime() - reviewDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
}
