// One list used by the home page, the providers page and the sign-up form.
// "key" must match the backend Category enum exactly.
export const CATEGORIES = [
  { key: "CLEANER", label: "Home Cleaning" },
  { key: "PLUMBER", label: "Plumbing" },
  { key: "ELECTRICIAN", label: "Electrician" },
  { key: "CARPENTER", label: "Carpentry" },
  { key: "BEAUTY", label: "Beauty and Wellness" },
  { key: "TUTOR", label: "Tutoring" },
  { key: "PET_CARE", label: "Pet Care" },
  { key: "PAINTING", label: "Painting" },
];

export const labelOf = (key) => CATEGORIES.find((c) => c.key === key)?.label || key;
