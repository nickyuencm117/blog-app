import usePostsMetaData from '../../hook/usePostsMetaData.jsx';
import PostCard from '../../components/PostCard/PostCard.jsx';
import SkeletonCard from '../../components/SkeletonCard/SkeletonCard.jsx';
import Hero from '../../components/Hero/Hero.jsx';
import Pagination from '../../components/Pagination/Pagination.jsx';
import styles from './PostListPage.module.css';
import { useSearchParams } from 'react-router-dom';
import { useMemo, useCallback } from 'react';
import SearchToolbar from '../../components/SearchToolBar/SearchToolBar.jsx';
import { updateSearchParams } from '../../utils.jsx';

function PostListPage(props) {
    const [searchParams, setSearchParams] = useSearchParams({ page: 1, orderBy: 'createdAt', orderDir: 'desc' });
    const { posts, total, loading } = usePostsMetaData(searchParams);

    const sortingOptions = useMemo(() => ([
        { value: 'createdAt:desc', label: 'Date of Creation (Desc)' },
        { value: 'createdAt:asc', label: 'Date of Creation (Asc)' },
        { value: 'title:desc', label: 'Title (Desc)' },
        { value: 'title:asc', label: 'Title (Asc)' }
    ]));

    const handleSearchParamsChange = useCallback((updates) => {
        setSearchParams((prev) => {
            const newSearchParams = updateSearchParams(prev, { ...updates });
            return newSearchParams;
        })
    }, []);

    function handlePageChange(page) {
        handleSearchParamsChange({ page })
        document.documentElement.scrollTop = 530;
    };

    return (
        <main>
            <div className='mainLayout'>
                <section className='mb8'>
                    <Hero 
                        title='Blog'
                        text='Discover stories from web development community'
                    >
                        <Hero.Image
                            src='/blog-header_480.png'
                            size='small'
                            alt='blog icon'
                        />
                    </Hero>
                </section>

                <section>
                    <SearchToolbar
                        initialParams={{
                            orderBy: searchParams.get('orderBy'),
                            orderDir: searchParams.get('orderDir')
                        }}
                        sortOptions={sortingOptions}
                        onParamChange={handleSearchParamsChange}
                    />     

                    <div className={styles.cardGroup}>
                        {loading ? (
                            Array(3).fill().map((_, index) => (
                                <div key={index}> 
                                    <SkeletonCard />                                   
                                </div>
                            )) 
                        ) : (
                            posts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    id={post.id}
                                    title={post.title}
                                    summary={post.summary}
                                    author={post.author.username}
                                    date={new Date(post.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                    imgSrc='/fff.jpg'
                                />
                            ))                            
                        )}
                    </div>

                    {!loading && (
                        <Pagination
                            currentPage={Number(searchParams.get('page')) || 1}
                            totalPages={Math.ceil(total / 9)}
                            maxVisiblePageBtn={5}
                            onPageChange={handlePageChange}
                        />
                    )}
                </section>
            </div>
        </main>
    );
};

export default PostListPage;