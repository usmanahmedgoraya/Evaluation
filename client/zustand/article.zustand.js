import { create } from 'zustand'

const domain = 'http://localhost:3002'
const ArticleStore = (set) => ({
    articles: [],
    singleArticle: {},
    totalPages: 0,
    reactions: {
        happy: 0,
        satisfaction: 0,
        sad: 0,
        love: 0,
        surprise: 0,
        angry: 0,
    },
    getAllArticles: async (page) => {
        const res = await fetch(`${domain}/article?page=${page}`, {
            method: 'GET',
            headers: {
                'Authorization': `bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1Y2QxMTZhNDA4NWY2Y2JlMTcyZjBhOSIsImlhdCI6MTcwNzk3NzU1NiwiZXhwIjoxNzA4MjM2NzU2fQ.rHJN143klUtbb1WgJV-MhTIqha5qOsU4YHGPB2YKtUA`
            }
        });
        const data = await res.json();
        console.log(data.articles)
        set({
            articles: data.articles,
            totalPages: data.totalCount
        });
    },

    getSingleArticle: async (id) => {
        let localAuth = localStorage.getItem('Auth');
        localAuth = JSON.parse(localAuth);
        const res = await fetch(`${domain}/article/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1Y2QxMTZhNDA4NWY2Y2JlMTcyZjBhOSIsImlhdCI6MTcwNzk3NzU1NiwiZXhwIjoxNzA4MjM2NzU2fQ.rHJN143klUtbb1WgJV-MhTIqha5qOsU4YHGPB2YKtUA`
            }
        });
        const data = await res.json();
        console.log(data);
        const reactionCounts = data?.likes?.reduce((counts, likes) => {
            counts[likes?.reactionType] = (counts[likes?.reactionType] || 0) + 1;
            return counts;
        }, {});

        if (localAuth) {
            const Likes = data?.likes
            const userReaction = Likes?.find((like) => like?.user == localAuth?.state?.user?._id)
            set({
                singleArticle: data
            });
            return { reactionCounts, userReaction }
        }
        console.log(reactionCounts);
       

        return { reactionCounts }
    },
    // Update Comment
    giveReaction: async (key, articleId) => set(async (state) => {
        try {
            let localAuth = localStorage.getItem('Auth');
            localAuth = JSON.parse(localAuth);
            // Make a POST request to the comment endpoint
            if (localAuth?.state?.user) {
                const res = await fetch(`${domain}/article/reaction/${articleId}`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${localAuth.state.token}`
                    },
                    body: JSON.stringify({
                        type: key
                    })
                });
                const reactions = await res.json();
            } else {
                throw new Error('Only user is Allowed')
            }
            await state.getSingleArticle(articleId)
        } catch (error) {
            console.log(error);
        }
    }),
});

const useArticleStore = create(ArticleStore)
export default useArticleStore