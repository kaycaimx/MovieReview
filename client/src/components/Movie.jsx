import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { NA_POSTER_URL, IMBD_URL} from "../constants";
import '../style/style.css';

export default function Movie() {
  const params = useParams();
  const { accessToken } = useAuthToken();
  const [movie, setMovie] = useState(null);
  const [review, setReviews] = useState([]);
  const [noReview, setNoReview] = useState("");
  const [draft, setDraft] = useState('');

  const { isAuthenticated } = useAuth0();

  useEffect( () => {
    async function getMovie() {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/movie/${params.movieId}`)
        if (res.ok) {
          const data = await res.json();
          setMovie(data);
          if (data.reviews.length === 0) {
            setNoReview("This movie does not have any reviews. Be the first reviwer!");
            setReviews([]);
          } else {
            setNoReview('');
          }
          setReviews(data.reviews);
        }
      } 

    getMovie();
  },[])

  async function createNewReview(draft) {
    const newData = await fetch(`${process.env.REACT_APP_API_URL}/movie/${params.movieId}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        text: draft,
      }),
    });
    if (newData.ok) {
      const newEntry = await newData.json();
      return newEntry;
    } else {
      return null;
    }
  }

  const submitReview = async (e) => {
    e.preventDefault();

    if (!draft) return;

    const newReview = await createNewReview(draft);
    if (newReview) {
      setReviews([...review, newReview]);
      setDraft('');
    }
  }

  return (
		<div>
      <div className='detailsWrapper'>
        <div className='posterColumn'>
          <img className='largePoster' src={movie?.posterURL !== 'N/A'? movie?.posterURL : NA_POSTER_URL} 
                    alt={`A poster of ${movie?.title}`} />
        </div>
        <div className='detailsColumn'>
          <p>Title: <strong>{movie?.title}</strong></p>
          <p>Release year: {movie?.year !==0? movie?.year : "N/A"}</p>
          <p>IMDb id#: <a href={`${IMBD_URL}/${movie?.imbdId}`} rel="noreferrer" target="_blank" 
            title={`IMDb page of ${movie?.title}`}> 
            {movie?.imbdId} </a>
          </p>
        </div>
        <div className='reviewColumn'>
          <p className='reviewHeader'>Reviews</p>
          <p> {noReview} </p>
          <ul>
            {review.map( (item) => {
              return (
                <li key={item.id} className='review'>
                  <p>{item.text}</p> 
                  <span>created by: {item.author.name}</span>
                </li>
              ) 
            })}
          </ul>
          { isAuthenticated ? (
            <form className="reviewForm" autoComplete="off" onSubmit={ (e) => submitReview(e)}>
            <div>
              <label htmlFor="reviewInput">Write your review for {movie?.title}: </label>
            </div>
            <br/>
            <div>
              <textarea type='text' id="reviewInput" name="reviewInput" rows='10'
              required value={draft} onChange={ (e) => setDraft(e.target.value)}
              aria-label="Write your review for this movie"
              > </textarea>
            </div>
            <div>
              <input type="submit" value="Post" />
            </div>
          </form>
          ) : (
            <p className='reviewHeader'> Sign up or log in to write a review for this movie! 🤩</p>
          )} 
        </div>
      </div>       
		</div>
  );
}