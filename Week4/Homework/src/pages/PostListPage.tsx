import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { getPosts } from '../apis/post';

export default function PostListPage() {
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const searchTerm = searchInput.trim();
  const canSearch = searchTerm.length >= 2 && searchTerm.length <= 50;
  const { data: posts, isPending, isError } = useQuery({
    queryKey: ['posts', keyword],
    queryFn: () => getPosts(keyword),
    staleTime: 30_000,
  });

  return (
    <>
      <h1>게시글 목록</h1>
      <form
        className="post-search"
        onSubmit={(event) => {
          event.preventDefault();
          if (canSearch) setKeyword(searchTerm);
        }}
      >
        <label htmlFor="post-keyword">제목 검색</label>
        <div className="post-search-fields">
          <input
            id="post-keyword"
            type="search"
            placeholder="검색어를 입력하세요"
            value={searchInput}
            maxLength={50}
            aria-describedby="post-search-hint"
            onChange={(event) => {
              const value = event.target.value;
              setSearchInput(value);
              if (!value.trim()) setKeyword('');
            }}
          />
          <button type="submit" disabled={!canSearch}>검색</button>
        </div>
        <p id="post-search-hint">검색어를 2~50자로 입력해주세요.</p>
      </form>

      {isPending && <p role="status">게시글을 불러오는 중입니다.</p>}
      {isError && <p role="alert">게시글을 불러오지 못했습니다.</p>}
      {posts?.length === 0 && (
        <p role="status">{keyword ? '검색 결과가 없습니다.' : '아직 게시글이 없습니다.'}</p>
      )}
      {posts && posts.length > 0 && (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.id}>
              <article>
                <Link to={`/posts/${post.id}`} className="post-preview">
                  <h2>{post.title}</h2>
                  <p>{post.content}</p>
                  <small>{post.author}</small>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
