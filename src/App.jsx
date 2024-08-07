import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { useState, useEffect } from 'react';

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [pinnedNews, setPinnedNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {

    if(searchTerm == '')
      return;

    // Replace with your API URL
    fetch('http://localhost/eduhor-news-app/public/api/list?search='+searchTerm)
      .then((response) => response.json())
      .then((data) => {
        setNews(data.news);
      })
      .catch((error) => console.error('Error fetching news:', error));
  }, [searchTerm]);

  useEffect(() => {
    // Replace with your API URL
    fetch('http://localhost/eduhor-news-app/public/api/getpin')
      .then((response) => response.json())
      .then((data) => {
        setPinnedNews(Object.values(data.pinned_news));
      })
      .catch((error) => console.error('Error fetching news:', error));
  }, []);

  const pinArticle = (article) => {
    if (!pinnedNews.includes(article)) {
      fetch('http://localhost/eduhor-news-app/public/api/pin?news_id='+article.source, {
        method: 'PUT',

      }).then(() => {
          // setPinnedNews(Object.values(data.pinned_news));
          setPinnedNews([...pinnedNews, article]);
        })
        .catch((error) => console.error('Error fetching news:', error));
      
    }
  };

  const unpinArticle = (article) => {
    if (pinnedNews.includes(article)) {
      fetch('http://localhost/eduhor-news-app/public/api/unpin?news_id='+article.source, {
        method: 'PUT',

      })
      .then((response) => response.json())
      .then((data) => {
          // setPinnedNews(Object.values(data.pinned_news));
          console.log(data);
          setPinnedNews(Object.values(data.pinned_news));
        })
        .catch((error) => console.error('Error fetching news:', error));
      
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h2>News</h2>
      <input
        type="text"
        placeholder="Search news..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <h3>All News</h3>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {news.map((article, index) => (
            <tr key={index}>
              <td style={{ width: '70%' }}>
                <h4>{article.title}</h4>
                <p><strong>Source:</strong> {article.source}</p>
                <p><strong>Section:</strong> {article.section}</p>
                <p><strong>Published on:</strong> {new Date(article.publication_date).toLocaleDateString()}</p>
                <p><strong>Summary:</strong> {article.summary_text}</p>
                <a href={article.link} target="_blank" rel="noopener noreferrer">Read more</a>
                <br/>
                <button onClick={() => pinArticle(article)}>Pin</button>
              </td>
              <td style={{ width: '30%' }}>
                {article.image && <img src={article.image} alt={article.title} style={{ maxWidth: '150px', maxHeight: '100px', objectFit: 'cover' }} />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Pinned News</h3>
      {pinnedNews.length === 0 ? (
        <p>No pinned news</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {pinnedNews.map((article, index) => (
              <tr key={index}>
                <td style={{ width: '70%' }}>
                  <h4>{article.title}</h4>
                  <p><strong>Source:</strong> {article.source}</p>
                  <p><strong>Section:</strong> {article.section}</p>
                  <p><strong>Published on:</strong> {new Date(article.publication_date).toLocaleDateString()}</p>
                  <p><strong>Summary:</strong> {article.summary_text}</p>
                  <a href={article.link} target="_blank" rel="noopener noreferrer">Read more</a>
                  <br/>
                  <button onClick={() => unpinArticle(article)}>Unpin</button>
                </td>
                <td style={{ width: '30%' }}>
                  {article.image && <img src={article.image} alt={article.title} style={{ maxWidth: '150px', maxHeight: '100px', objectFit: 'cover' }} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
};

export default NewsList;
