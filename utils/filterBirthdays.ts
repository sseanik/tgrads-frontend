const starSigns = {
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

export const filterBirthdays = (grads, month) => {
  const birthdayGradsA = grads
    .filter((grad) => grad.attributes.StarSign === starSigns[month][0])
    .sort((a, b) => a.attributes.FullName.localeCompare(b.attributes.FullName));

  const birthdayGradsB = grads
    .filter((grad) => grad.attributes.StarSign === starSigns[month][1])
    .sort((a, b) => a.attributes.FullName.localeCompare(b.attributes.FullName));
  return { birthdayGradsA, birthdayGradsB };
};

export const getStarSigns = (month) => {
  return starSigns[month];
}
