import { pb } from '@/lib/pocketbase';

export interface HomeSlide {
     id: string;
     title: string;
     title_fr: string;
     description: string;
     description_fr: string;
     created: string;
     updated: string;
}

export async function getHomeSlides(): Promise<HomeSlide[]> {
     try {
          const result = await pb.collection('home_slider').getList(1, 50, {
               sort: '-created',
               requestKey: null,
          });

          return result.items.map((item: any) => ({
               id: item.id,
               title: item.title || '',
               title_fr: item.title_fr || '',
               description: item.description || '',
               description_fr: item.description_fr || '',
               created: item.created,
               updated: item.updated,
          }));
     } catch (error) {
          console.error('Failed to fetch home slider data:', error);
          return [];
     }
}
