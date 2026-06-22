import { Image } from 'react-native';
import { Asset } from 'expo-asset';

// Objek banner untuk preload
export const bannerImages = {
  a: require('../../assets/images/banners-webp/banner_a.webp'),
  b: require('../../assets/images/banners-webp/banner_b.webp'),
  c: require('../../assets/images/banners-webp/banner_c.webp'),
  d: require('../../assets/images/banners-webp/banner_d.webp'),
  e: require('../../assets/images/banners-webp/banner_e.webp'),
  f: require('../../assets/images/banners-webp/banner_f.webp'),
  g: require('../../assets/images/banners-webp/banner_g.webp'),
  h: require('../../assets/images/banners-webp/banner_h.webp'),
  i: require('../../assets/images/banners-webp/banner_i.webp'),
  j: require('../../assets/images/banners-webp/banner_j.webp'),
  k: require('../../assets/images/banners-webp/banner_k.webp'),
  l: require('../../assets/images/banners-webp/banner_l.webp'),
  m: require('../../assets/images/banners-webp/banner_m.webp'),
  n: require('../../assets/images/banners-webp/banner_n.webp'),
  o: require('../../assets/images/banners-webp/banner_o.webp'),
  p: require('../../assets/images/banners-webp/banner_p.webp'),
  r: require('../../assets/images/banners-webp/banner_r.webp'),
  s: require('../../assets/images/banners-webp/banner_s.webp'),
};

// Cache untuk menyimpan banner yang telah dimuat
export const preCachedBanners: Record<string, boolean> = {};

// Resolve asset sources terlebih dahulu untuk meningkatkan prestasi
Object.keys(bannerImages).forEach(key => {
  try {
    const image = bannerImages[key as keyof typeof bannerImages];
    if (Image && typeof Image.resolveAssetSource === 'function') {
      Image.resolveAssetSource(image);
    } else {
      console.warn('resolveAssetSource tidak tersedia atau bukan fungsi');
    }
    preCachedBanners[key] = false;
  } catch (error) {
    console.warn(`Ralat resolving imej ${key}:`, error);
  }
});

// Fungsi untuk pra-memuatkan aset imej
export async function cacheImages(images: Array<string | number>): Promise<any[]> {
  // Jika tiada imej, tidak perlu diproses
  if (images.length === 0) return [];
  
  try {
    const loadPromise = Promise.all(images.map(image => {
      if (typeof image === 'string') {
        if (Image && typeof Image.prefetch === 'function') {
          return Image.prefetch(image);
        }
        return Promise.resolve();
      } else {
        // Tandakan imej sebagai telah dicache
        const key = Object.keys(bannerImages).find(
          k => bannerImages[k as keyof typeof bannerImages] === image
        );
        if (key) preCachedBanners[key] = true;
        
        return Asset.fromModule(image).downloadAsync();
      }
    }));
    
    // Tetapkan timeout yang pendek untuk mempercepat pemulaan
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, 300));
    
    // Gunakan Promise.race untuk menetapkan batas masa
    return await Promise.race([loadPromise, timeoutPromise]) as any[];
  } catch (error) {
    console.warn('Ralat memuatkan imej:', error);
    return [];
  }
}

// Fungsi untuk memeriksa jika imej telah berada dalam cache
export function isImageCached(categoryId: string): boolean {
  return preCachedBanners[categoryId] === true;
}

// Fungsi untuk menetapkan imej sebagai telah di-cache
export function setCachedImage(categoryId: string): void {
  preCachedBanners[categoryId] = true;
}

// Menambahkan default export untuk mengatasi warning
const ImageCache = {
  bannerImages,
  preCachedBanners,
  cacheImages,
  isImageCached,
  setCachedImage
};

export default ImageCache; 