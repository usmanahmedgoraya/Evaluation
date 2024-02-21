import { create, SetState } from 'zustand';

interface Article {
  author: string;
  comments: any[];
  crawled: string;
  language: string;
  likes: any[];
  ord_in_thread: number;
  participants_count: number;
  published: string;
  reference: {
    _id: string;
    uuid: string;
    site_url: string;
    country: string;
    spam_score: number;
  };
  replies_count: number;
  shares: number;
  text: string;
  thread_title: string;
  title: string;
  type: string;
  uuid: string;
  __v: number;
  _id: string;
}

interface ReactionCounts {
  happy: number;
  satisfaction: number;
  sad: number;
  love: number;
  surprise: number;
  angry: number;
}

interface LocalAuth {
  state: {
    user: {
      _id: string;
    };
    token: string;
  };
}

interface ReactionCounts {
  [key: string]: number;
}

const domain = 'https://evaluation-backend-kappa.vercel.app';
// const domain = 'http://localhost:3002';

const ArticleStore = (set: any) => ({
  articles: [] as Article[],
  singleArticle: {} as Article,
  analytics: {},
  totalPages: 0,
  totalCountries: [],
  totalLanguages: [],
  totalSites: [],
  reactions: {
    happy: 0,
    satisfaction: 0,
    sad: 0,
    love: 0,
    surprise: 0,
    angry: 0,
  },
  getAllArticles: async (page: number) => {
    const res = await fetch(`${domain}/article?page=${page}`, {
      method: 'GET',
    });
    const data = await res.json();
    console.log(data.articles);
    set({
      articles: data.articles,
      totalPages: data.totalCount,
    });
  },

  getSingleArticle: async (id: any) => {
    let localAuth: any = localStorage.getItem('Auth');
    localAuth = JSON.parse(localAuth || 'null') as LocalAuth | null;
    const res = await fetch(`${domain}/article/single/${id}`, {
      method: 'GET',

    });
    const data = await res.json();
    console.log(data);
    const reactionCounts: ReactionCounts = (data?.likes || []).reduce(
      (counts: ReactionCounts, likes: any) => {
        counts[likes?.reactionType] = (counts[likes?.reactionType] || 0) + 1;
        return counts;
      },
      {} as ReactionCounts
    );

    if (localAuth) {
      const Likes = data?.likes;
      const userReaction = Likes?.find(
        (like: any) => like?.user == localAuth?.state?.user?._id
      );
      set({
        singleArticle: data,
      });
      return { reactionCounts, userReaction };
    }
    console.log(reactionCounts);

    return { reactionCounts };
  },

  giveReaction: async (key: string, articleId: any) =>
    set(async (state: any) => {
      try {
        let localAuth: any = localStorage.getItem('Auth');
        localAuth = JSON.parse(localAuth || 'null') as LocalAuth | null;
        console.log(localAuth.state.token);
        
        // Make a POST request to the comment endpoint
        if (localAuth?.state?.user) {
          const res = await fetch(`${domain}/article/reaction/${articleId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `bearer ${localAuth?.state?.token}`,
            },
            body: JSON.stringify({
              type: key,
            }),
          });
          await res.json();
        } else {
          throw new Error('Only user is Allowed');
        }
        await state.getSingleArticle(articleId);
      } catch (error) {
        console.log(error);
      }
    }),

  getAnalytics: async () => {
    const res = await fetch(`${domain}/article/analytics`, {
      method: 'GET',
    });
    const data = await res.json();
    console.log(data);
    set({
      analytics: data
    });
  },

  getTotalStats: async () => {
    try {
      const res = await fetch(`${domain}/article/total-stats`);
      const data = await res.json()
      console.log(data);
      set({
        totalCountries: data.countryData,
        totalLanguages: data.languageData,
        totalSites: data.siteUrlData
      })
    } catch (error) {
      console.log(error);

    }
  },
  getTotalAnalyticsStats: async () => {
    try {
      const res = await fetch(`${domain}/article/analytics-stats`);
      const data = await res.json()
      console.log(data);
      set({
        analytics: data
      })
    } catch (error) {
      console.log(error);

    }
  }

});

const useArticleStore = create(ArticleStore);
export default useArticleStore;
