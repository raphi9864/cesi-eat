import restaurantImg from '../fallback/restaurant.jpg';
import dishImg from '../fallback/dish.jpg';
import restaurantBannerImg from '../fallback/restaurantBanner.jpg';
import featuredImg from '../fallback/featured.jpg';
import thaiImg from '../fallback/thai.jpg';
import curryImg from '../fallback/curry.jpg';
import italianImg from '../fallback/italian.jpg';
import japaneseImg from '../fallback/japanese.jpg';
import bbqImg from '../fallback/bbq.jpg';
import veganImg from '../fallback/vegan.jpg';
import seafoodImg from '../fallback/seafood.jpg';
import mediterraneanImg from '../fallback/mediterranean.jpg';

// Images de remplacement (placeholders) pour les problèmes de connectivité
const placeholderImages = {
  // Images locales pour remplacer les images manquantes
  restaurant: restaurantImg,
  dish: dishImg,
  restaurantBanner: restaurantBannerImg,
  featured: featuredImg,
  
  // Images par type de cuisine
  thai: thaiImg,
  curry: curryImg,
  italian: italianImg,
  japanese: japaneseImg,
  bbq: bbqImg,
  vegan: veganImg,
  seafood: seafoodImg,
  mediterranean: mediterraneanImg,
  
  // Base64 de secours en cas de problème avec les images locales
  restaurantBase64: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMThweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OTk5OSI+SW1hZ2UgZHUgUmVzdGF1cmFudDwvdGV4dD48L3N2Zz4=",
  dishBase64: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTRweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OTk5OSI+SW1hZ2UgZHUgUGxhdDwvdGV4dD48L3N2Zz4="
};

export default placeholderImages; 