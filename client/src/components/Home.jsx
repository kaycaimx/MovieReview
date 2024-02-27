import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { MOVIE_API_URL, NA_POSTER_URL } from "../constants";
import '../style/style.css';

export default function Home() {
  const [title, setTitle] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [notFound, setNotFound] = useState("");
  const navigate = useNavigate();

  useEffect( () => {
    // make a request to external API to get list of movies
    async function getMovieList() {
      const res = await fetch(
        `${ MOVIE_API_URL }/titles/search/title/${title}?exact=false&titleType=movie&limit=18`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_MOVIE_API_KEY,
          'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.results.length === 0) {
          setNotFound(`Oops, your search for "${title}" returned no results😭`);
        } else {
          setNotFound("");
          // only reset the searchInput column when there are valid results, otherwise, leave the original input 
          // to allow the user to modify the original input
          const searchInput = document.getElementById("searchInput");
          searchInput.value = "";
        }
        setMovieList(data.results);
      }
    }

  if (title.length > 0) {
    getMovieList();
  }
}, [title])

  return (
    <div className='home'>
      <div className='searchBar'>
        <form onSubmit={(e) => {e.preventDefault(); setTitle(e.target.searchInput.value)}}>
          <input type="text" id="searchInput" name="searchInpu" placeholder="Find a movie by title" required />
          <input type="submit" id="searchBtn" value="Search!"/> 
        </form>
      </div>
      <div className='notFoundBar'>{notFound}</div>
      <div className='resultsWrapper'>
        <ul className='movieList'>
          {movieList.map( (item) => {
            return (
              <li key={item.id} className='movieWrapper' onClick={() => navigate(`/movie/${item.id}`)}>
              <img className='smallPoster' src={item.primaryImage? item.primaryImage.url : NA_POSTER_URL} 
                alt={`A poster of ${item.originalTitleText.text}`} />
              <div className='movieTitle'>{item.originalTitleText.text}</div>
              <div>Year: {item.releaseYear? item.releaseYear.year: "N/A"}</div>
              <div>IMDb #{item.id}</div>
              </li>
             )
          })}
        </ul>
      </div>
    </div>
  );
}
