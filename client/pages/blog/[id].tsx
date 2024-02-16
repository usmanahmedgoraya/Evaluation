import useArticleStore from '@/zustand/article.zustand'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import bg4 from "@/src/assets/images/bg/bg4.jpg";
import Image from 'next/image';
import FullLayout from "@/src/layouts/FullLayout";
import Header from '@/src/layouts/header/Header';
import { ReactionBarSelector } from '@charkour/react-reactions';

export default function Page() {
  const router = useRouter()
  const [reactionCounts, setReactionCounts] = useState({
    happy: 0,
    satisfaction: 0,
    sad: 0,
    love: 0,
    surprise: 0,
    angry: 0,
  });
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const { getSingleArticle, singleArticle, giveReaction } = useArticleStore()
  const [isLoggedin, setIsLoggedin] = useState(false)


  useEffect(() => {
    const fetchData = async () => {
      let localAuth: any = localStorage.getItem('Auth')
      localAuth = JSON.parse(localAuth);
      if (!localAuth?.state?.isLoggedin) {
        router.push('/auth/login')
      } else {
        setIsLoggedin(true)
        getSingleArticle(router.query.id)
        const counts: any = await getSingleArticle(router.query.id)
        setUserReaction(counts?.userReaction?.reactionType)
        // Update the reactionCounts state based on the reactions state
        setReactionCounts({
          happy: counts?.reactionCounts?.happy || 0,
          satisfaction: counts?.reactionCounts?.satisfaction || 0,
          sad: counts?.reactionCounts?.sad || 0,
          love: counts?.reactionCounts?.love || 0,
          surprise: counts?.reactionCounts?.surprise || 0,
          angry: counts?.reactionCounts?.angry || 0,
        });
      }
      // Make sure getSingleBlog returns the reactionCounts

    };

    fetchData();

  }, [router.query.id])


  const formatDate = (dateString: string | number): string => {
    const date = new Date(dateString);

    // Rest of the code remains the same
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate
  }

  const handleReaction = (key: string) => {

    // Check if the user has already given this reaction
    if (userReaction === key) {
      // If the user selects the same reaction again, remove it
      giveReaction(key, router.query.id);
      setUserReaction(null);
      setReactionCounts((prevCounts: any) => ({
        ...prevCounts,
        [key]: prevCounts[key] - 1,
      }));
    } else if (!userReaction) {
      // If the user selects a new reaction, update it
      giveReaction(key, router.query.id);
      setUserReaction(key);
      setReactionCounts((prevCounts: any) => ({
        ...prevCounts,
        [key]: prevCounts[key] + 1,
      }));
    }
    else {
      giveReaction(key, router.query.id);

      setReactionCounts((prevCounts: any) => ({
        ...prevCounts,
        [userReaction]: prevCounts[userReaction] - 1,
      }));
      setUserReaction(key);
      setReactionCounts((prevCounts: any) => ({
        ...prevCounts,
        [key]: prevCounts[key] + 1,
      }));
    }
  };

  return (
    // <Header showMobmenu={function (): void {
    //   throw new Error('Function not implemented.');
    // }}>
    <div className='flex flex-col justify-center items-center'>
      <h1 className='mt-10 text-4xl font-bold max-w-[49rem] px-2 my-3'>{singleArticle?.title}</h1>

      <div>
        <Image src={bg4} alt="default" />
      </div>
      <div className='max-w-[49rem] px-2 mt-4'>
        <div className='flex justify-start my-3 flex-col '>
          <p className='text-left  text-lg'><span className='font-bold'>Author:</span> {singleArticle?.author}</p>
          <p><span className='font-bold'>Published</span> : {formatDate(singleArticle?.published)}</p>
        </div>
<<<<<<< HEAD
        <div>
          {singleArticle?.text}
        </div>
        <div className='mt-6 flex flex-col md:flex-row justify-center md:justify-between items-center w-full gap-2'>
          {isLoggedin &&
            <ReactionBarSelector style={{ background: "#1D232A", padding: '10px', border: '2px solid #ffffff' }} iconSize={25} onSelect={handleReaction} />
          }
          <div className='flex flex-wrap space-x-3'>
            {reactionCounts.happy > 0 && <span className='flex flex-col items-center'><span>😆</span> {reactionCounts.happy}</span>}
            {reactionCounts.satisfaction > 0 && <span className='flex flex-col items-center'><span>👍</span>{reactionCounts.satisfaction}</span>}
            {reactionCounts.sad > 0 && <span className='flex flex-col items-center'><span>😢</span>{reactionCounts.sad}</span>}
            {reactionCounts.love > 0 && <span className='flex flex-col items-center'><span>❤️</span> {reactionCounts.love}</span>}
            {reactionCounts.surprise > 0 && <span className='flex flex-col items-center'><span>😮</span> {reactionCounts.surprise}</span>}
            {reactionCounts.angry > 0 && <span className='flex flex-col items-center'><span>😡</span> {reactionCounts.angry}</span>}
=======
        <div className='max-w-[49rem] px-2 mt-4'>
          <div className='flex justify-start my-3 '>
            <p className='text-left font-bold text-lg'>{singleArticle?.author}</p>

          </div>
          <div>
            {singleArticle?.text}
>>>>>>> 51638a6bec26600d73562b96351c71361811e85f
          </div>
        </div>
      </div>
    </div>
    // </Header>
  )
}