import { Grad } from "../types/User";

const STAR_SIGNS: Record<string, string[]> = {
  January: ['Capricorn', 'Aquarius'],
  February: ['Aquarius', 'Pisces'],
  March: ['Pisces', 'Aries'],
  April: ['Aries', 'Taurus'],
  May: ['Taurus', 'Gemini'],
  June: ['Gemini', 'Cancer'],
  July: ['Cancer', 'Leo'],
  August: ['Leo', 'Virgo'],
  September: ['Virgo', 'Libra'],
  October: ['Libra', 'Scorpio'],
  November: ['Scorpio', 'Sagittarius'],
  December: ['Sagittarius', 'Capricorn'],
};

export const filterBirthdaysOnStarSign = (grads: Grad[], month: string) => {
  const birthdayGradsA = grads
    .filter((grad) => grad.attributes.StarSign === STAR_SIGNS[month][0])
    .sort((a, b) => a.attributes.FullName.localeCompare(b.attributes.FullName));

  const birthdayGradsB = grads
    .filter((grad) => grad.attributes.StarSign === STAR_SIGNS[month][1])
    .sort((a, b) => a.attributes.FullName.localeCompare(b.attributes.FullName));
  return { birthdayGradsA, birthdayGradsB };
};

export const getStarSigns = (month: string): string[] => {
  return STAR_SIGNS[month];
}
