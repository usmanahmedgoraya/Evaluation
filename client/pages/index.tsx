import bg4 from '@/src/assets/images/bg/bg4.jpg'
import Blog from '@/src/components/dashboard/Blog'
import useArticleStore from '@/zustand/article.zustand'
import Pagination from '@mui/material/Pagination'
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'reactstrap'
import Header from "../src/layouts/header/Header"
const Home = () => {
  const { getAllArticles, articles, totalPages } = useArticleStore();
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10; // Number of articles to display per page

  useEffect(() => {
    getAllArticles(currentPage);
  }, []);


  function handlePagination(event: React.ChangeEvent<unknown>, page: number) {
    setCurrentPage(page);
    getAllArticles(page);
  }

  // Logic to slice the articles array based on currentPage
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  return (
    <div className='overflow-x-hidden'>
      <Header showMobmenu={function (): void {
        throw new Error('Function not implemented.')
      }} />
      {/***Blog Cards***/}
      <Row className='m-8'>
        {articles?.map((blg: any) => (
          <Col sm="6" lg="6" xl="4" key={blg.title}>
            <Blog
              image={blg.image}
              title={blg.title}
              subtitle={blg.subtitle}
              text={blg.text}
              color={blg.btnbg}
              defaultImage={bg4}
              blog={blg}
            />
          </Col>
        ))}
        <Pagination count={Math.ceil(totalPages / 10)} className='my-4' onChange={handlePagination} />
      </Row>
    </div>
  )
}

export default Home