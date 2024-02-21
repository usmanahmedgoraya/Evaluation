import FullLayout from '@/src/layouts/FullLayout';
import useArticleStore from '@/zustand/article.zustand';
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardTitle, Col, Table } from 'reactstrap';

const DataFigures = () => {
    const { getAllArticles, articles, totalPages } = useArticleStore();
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 10; // Number of articles to display per page

    useEffect(() => {
        getAllArticles(currentPage);
    }, []);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        const formattedDate = date.toLocaleDateString('en-US', options);
        return formattedDate;
    }

    const handlePagination = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
        getAllArticles(page);
    }

    // Logic to slice the articles array based on currentPage
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;

    return (
        <FullLayout>
            <div>
                <Col lg="12">
                    <Card>
                        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                            <i className="bi bi-card-text me-2"> </i>
                            Data Figures of Articles
                        </CardTitle>
                        <CardBody className="">
                            <div style={{ overflowX: 'auto' }}>
                                <Table bordered hover className='overflow-x-scroll'>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Author</th>
                                            <th>Country</th>
                                            <th>Language</th>
                                            <th>Site URL</th>
                                            <th>Comments</th>
                                            <th>Likes</th>
                                            <th>Spam Score</th>
                                            <th>Published</th>
                                            <th>Crawled</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            articles.map((article: any, index: number) => {
                                                return (
                                                    <tr key={article._id}>
                                                        <th scope="row">{indexOfFirstArticle + index + 1}</th>
                                                        <td className='font-medium'>{article?.author}</td>
                                                        <td>{article?.reference?.country}</td>
                                                        <td>{article?.language}</td>
                                                        <td>{article?.reference?.site_url}</td>
                                                        <td>{article?.comments?.length}</td>
                                                        <td>{article?.likes?.length}</td>
                                                        <td>{article?.reference?.spam_score}</td>
                                                        <td>{formatDate(article?.published)}</td>
                                                        <td>{formatDate(article?.crawled)}</td>
                                                    </tr>)
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </CardBody>
                        <Pagination count={Math.ceil(totalPages / 10)} onChange={handlePagination} className='my-4' />
                    </Card>
                </Col>
            </div>
        </FullLayout>
    )
}

export default DataFigures;
