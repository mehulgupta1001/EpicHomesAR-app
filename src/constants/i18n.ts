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
  // HomeScreen translations
  'app_title': 'Epic Homes AR',
  'app_subtitle': 'Visualize Traditional Malaysian Indigenous Houses',
  'features': 'Features',
  'feature_ar_title': 'AR Visualization',
  'feature_ar_desc': 'Place and view house designs in your environment',
  'feature_materials_title': 'Material Options',
  'feature_materials_desc': 'Explore traditional building materials',
  'feature_houses_title': '5 House Types',
  'feature_houses_desc': 'Traditional Orang Asli house designs',
  'feature_share_title': 'Share & Save',
  'feature_share_desc': 'Save and share your visualizations',
  'about_title': 'About Epic Homes',
  'about_text': 'Epic Homes is dedicated to building sustainable, traditional-style houses for indigenous communities in Malaysia. Our AR visualizer helps clients and communities explore different house designs while respecting cultural heritage.',
  // AR Screen translations
  'back': 'Back',
  'place_model': 'Tap to place house model',
  'surface_detecting': 'Detecting surface...',
  'surface_detected': 'Surface detected! Tap to place.',
  'loading_model': 'Loading model...',
  'ar_error': 'AR Error',
  'ar_error_message': 'AR session failed. Please ensure ARCore is installed and camera permissions are granted.',
  // House types (will be used dynamically)
  'house_default': 'Default House',
  'house_traditional_malay': 'Traditional Malay House',
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
  // HomeScreen translations
  'app_title': 'Epic Homes AR',
  'app_subtitle': 'Visualisasikan Rumah Tradisional Orang Asli Malaysia',
  'features': 'Ciri-ciri',
  'feature_ar_title': 'Visualisasi AR',
  'feature_ar_desc': 'Letakkan dan lihat reka bentuk rumah dalam persekitaran anda',
  'feature_materials_title': 'Pilihan Bahan',
  'feature_materials_desc': 'Terokai bahan binaan tradisional',
  'feature_houses_title': '5 Jenis Rumah',
  'feature_houses_desc': 'Reka bentuk rumah Orang Asli tradisional',
  'feature_share_title': 'Kongsi & Simpan',
  'feature_share_desc': 'Simpan dan kongsi visualisasi anda',
  'about_title': 'Mengenai Epic Homes',
  'about_text': 'Epic Homes komited untuk membina rumah gaya tradisional yang mampan untuk komuniti Orang Asli di Malaysia. Visualisasi AR kami membantu pelanggan dan komuniti meneroka pelbagai reka bentuk rumah sambil menghormati warisan budaya.',
  // AR Screen translations
  'back': 'Kembali',
  'place_model': 'Ketuk untuk meletakkan model rumah',
  'surface_detecting': 'Mengesan permukaan...',
  'surface_detected': 'Permukaan dikesan! Ketuk untuk meletakkan.',
  'loading_model': 'Memuatkan model...',
  'ar_error': 'Ralat AR',
  'ar_error_message': 'Sesi AR gagal. Sila pastikan ARCore dipasang dan kebenaran kamera diberikan.',
  // House types
  'house_default': 'Rumah Lalai',
  'house_traditional_malay': 'Rumah Tradisional Melayu',
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
