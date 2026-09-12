export type Category =
  | 'الكل'
  | 'زفات عروس'
  | 'زفات عريس'
  | 'زفات مولودة'
  | 'زفات مولود'
  | 'زفات تخرج بنت'
  | 'زفات تخرج ولد'
  | 'زفات عيد ميلاد'
  | 'زفات عقد قران'
  | 'زفات ذكرى زواج'
  | (string & {});

export type Artist =
  | 'حسين الجسمي'
  | 'محمد عبده'
  | 'إبراهيم عباس'
  | 'ماجد المهندس'
  | 'عايل القطري'
  | 'عايض'
  | 'فؤاد عبدالواحد'
  | 'جابر الكاسر'
  | (string & {});

export interface Track {
  _id?: string;
  id: string;
  title: string;
  category: string;
  artist: string;
  duration?: string;
  audioUrl: string;
  coverImage?: string;
  releaseYear?: string;
  isPopular?: boolean;
  createdAt?: string;
}

export interface ArtistInfo {
  name: string;
  image: string;
  description?: string;
  trackCount: number;
}
