const ARABIC_INDIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

export function toArabicDigits(value) {
  return String(value).replace(/[0-9]/g, (d) => ARABIC_INDIC_DIGITS[Number(d)])
}

export function toWesternDigits(value) {
  return String(value).replace(/[٠-٩]/g, (d) => String(ARABIC_INDIC_DIGITS.indexOf(d)))
}

export function localizeNumber(value, locale) {
  if (value === null || value === undefined) return value
  return locale === 'ar' ? toArabicDigits(value) : String(value)
}
