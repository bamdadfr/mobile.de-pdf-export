interface ImageSource {
  src: string;
  srcSet: string;
}

interface ImageSourceExtended extends ImageSource {
  thumbnailSrc: string;
  type: 'image' | string;
}

interface GalleryImage extends ImageSourceExtended {
  alt: string;
}

export interface AdProps {
  attributes: {
    label: string;
    tag: string;
    value: string;
  }[];
  category: string;
  contactInfo: {
    address1?: string;
    address2?: string;
    canBeFollowed: boolean;
    country: string;
    dealerHomepageLink: string;
    hasContactPhones: boolean;
    heroImage: ImageSource;
    isDealerFollowed: boolean;
    languages: string;
    latLong: {
      lat: number;
      lon: number;
    };
    logo: ImageSource;
    mapLink?: string;
    markingText: string;
    name: string;
    numResultsTotal: number;
    openingHours: {time: string; day: string;}[];
    person: {
      logo: ImageSource;
    };
    phones: {number: string; type: string; uri: string;}[];
    rating: {
      adRealityRate: number;
      consultingScore: number;
      count: number;
      friendlinessScore: number;
      link: string;
      recommendationRate: number;
      responseTimeScore: number;
      score: number;
      scoreLocalized: string;
    };
    sellerType: 'FSBO' | 'DEALER';
    showroomGallery: ImageSourceExtended[];
    type: string;
    withMobileSince: string;
  };
  customDimensions: {
    [id: number]: string;
  };
  emailLink: string;
  features: string[];
  financeBudget: unknown;
  financePlan: unknown;
  footnotes: unknown;
  galleryImages: GalleryImage[];
  highlights: string[];
  htmlDescription: string;
  id: number;
  isConditionNew: boolean;
  isLeasingOnlyAd: boolean;
  isNew: boolean;
  isVideoEnabled: boolean;
  leasingRate: null;
  make: string;
  makeKey: string;
  mediaGallery: unknown;
  model: string;
  modelKey: string;
  onLoadFlags: unknown;
  partnerLinks: unknown;
  price: {
    gross: string;
    grossAmount: number;
    grossCurrency: string;
    net: string;
    netAmount: number;
    type: string;
    vat: string;
  };
  priceRating: {
    rating: string;
    ratingLabel: string;
    thresholdLabels: string[];
    vehiclePriceOffset: number;
  };
  searchId: string;
  segment: string;
  sellerId: number;
  serviceLinks: unknown;
  shortTitle: string;
  similarAdsInfo: unknown;
  subTitle: string;
  title: string;
  url: string;
  vc: string;
  vehicleCondition: string;
}

export interface MobileProps {
  search: {
    vip: {
      adContacts: {};
      adListingType: 'purchase';
      ads: {
        [adKey: number]: {
          data: {
            ad: AdProps;
          };
          status: 'empty' | 'loaded';
        };
      };
      current: {
        adId: string;
        url: string;
      };
    };
  };
}
