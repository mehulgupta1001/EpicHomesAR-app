// Pure React Native internationalization - simplified version
// Note: This is a simplified version without expo-localization

interface Translations {
  [key: string]: string;
}

const en: Translations = {
  'welcome': 'Welcome to Epic Homes AR',
  'select_house': 'Select House Design',
  'start_ar': 'Start AR Experience',
  'construction_guide': 'Construction Guide',
  'materials': 'Materials',
  'measurements': 'Measurements',
  'share': 'Share',
  'close': 'Close',
  'next': 'Next',
  'previous': 'Previous',
  'complete': 'Complete',
  'in_progress': 'In Progress',
  'not_started': 'Not Started',
  'epic_homes': 'Epic Homes',
  'traditional_house': 'Traditional House',
  'ar_visualization': 'AR Visualization',
  'step': 'Step',
  'of': 'of',
  'progress': 'Progress',
  'notes': 'Notes',
  'safety_notes': 'Safety Notes',
  'materials_needed': 'Materials Needed',
  'tools_required': 'Tools Required',
  'estimated_time': 'Estimated Time',
  'cultural_info': 'Cultural Information',
  'technical_details': 'Technical Details',
  'dimensions': 'Dimensions',
  'construction_time': 'Construction Time',
  'special_features': 'Special Features',
  'customize_materials': 'Customize Materials',
  'wood_type': 'Wood Type',
  'roofing': 'Roofing',
  'binding': 'Binding',
  'cengal': 'Cengal',
  'meranti': 'Meranti',
  'bamboo': 'Bamboo',
  'nipah_palm': 'Nipah Palm',
  'rumbia': 'Rumbia',
  'bamboo_shingle': 'Bamboo Shingle',
  'rattan': 'Rattan',
  'natural_fiber': 'Natural Fiber',
  'modern_binding': 'Modern Binding',
};

const ms: Translations = {
  'welcome': 'Selamat Datang ke Epic Homes AR',
  'select_house': 'Pilih Reka Bentuk Rumah',
  'start_ar': 'Mula Pengalaman AR',
  'construction_guide': 'Panduan Pembinaan',
  'materials': 'Bahan',
  'measurements': 'Ukuran',
  'share': 'Kongsi',
  'close': 'Tutup',
  'next': 'Seterusnya',
  'previous': 'Sebelumnya',
  'complete': 'Selesai',
  'in_progress': 'Sedang Berjalan',
  'not_started': 'Belum Bermula',
  'epic_homes': 'Epic Homes',
  'traditional_house': 'Rumah Tradisional',
  'ar_visualization': 'Visualisasi AR',
  'step': 'Langkah',
  'of': 'daripada',
  'progress': 'Kemajuan',
  'notes': 'Nota',
  'safety_notes': 'Nota Keselamatan',
  'materials_needed': 'Bahan Diperlukan',
  'tools_required': 'Alat Diperlukan',
  'estimated_time': 'Masa Anggaran',
  'cultural_info': 'Maklumat Budaya',
  'technical_details': 'Butiran Teknikal',
  'dimensions': 'Dimensi',
  'construction_time': 'Masa Pembinaan',
  'special_features': 'Ciri Khas',
  'customize_materials': 'Sesuaikan Bahan',
  'wood_type': 'Jenis Kayu',
  'roofing': 'Bumbung',
  'binding': 'Pengikat',
  'cengal': 'Cengal',
  'meranti': 'Meranti',
  'bamboo': 'Buluh',
  'nipah_palm': 'Daun Nipah',
  'rumbia': 'Rumbia',
  'bamboo_shingle': 'Gentian Buluh',
  'rattan': 'Rotan',
  'natural_fiber': 'Serat Semula Jadi',
  'modern_binding': 'Pengikat Moden',
};

// Simple i18n implementation
class I18n {
  private translations: Translations;
  private locale: string;

  constructor(translations: Translations, locale: string = 'en') {
    this.translations = translations;
    this.locale = locale;
  }

  t(key: string, _config?: any): string {
    const translation = this.translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation;
  }

  setLocale(locale: string) {
    this.locale = locale;
  }
}

// Create instances
const enI18n = new I18n(en, 'en');
const msI18n = new I18n(ms, 'ms');

// Default to English
let currentI18n = enI18n;

export const t = (key: string, config?: any) => currentI18n.t(key, config);

export const setLocale = (locale: string) => {
  if (locale === 'ms') {
    currentI18n = msI18n;
  } else {
    currentI18n = enI18n;
  }
};

export const getCurrentLocale = () => currentI18n.locale;
