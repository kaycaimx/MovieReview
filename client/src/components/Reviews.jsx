import "../style/reviewList.css";

import { useEffect, useState } from "react";
import { useAuthToken } from "../AuthTokenContext";

export default function Reviews() {
  const [review, setReviews] = useState([]);
  const [editReviewId, setEditReviewId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [editReviewText, setEditReviewText] = useState("");
  const { accessToken } = useAuthToken();
  
  async function getAllReviews() {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/review`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },  
      });
      if (!response.ok) {
        console.error("Fail to get reviews");
      }
      const reviews = await response.json();
      setReviews(reviews);
    } catch (err) {
      console.log("Error:", err);
    }
  }
  useEffect(() => {
    getAllReviews();
  }, []);

  useEffect( () => {
    if (searchInput.length > 0) {
      const hitItems = review.filter( (i) => i.movie.title.toLowerCase().includes(searchInput));
      setReviews(hitItems);
    } else {
      getAllReviews();
    }
  }, [searchInput])


  async function updateReview(id) {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/review/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          text: editReviewText,
        }),
      });
      if (response.ok) {
        setReviews((preReviews) =>
          preReviews.map((review) => 
            review.id === id ? {...review, const: editReviewText } : review
          )
        );
        cancelEdit();
        console.log("Review updated successfully.");
      } else {
        console.log("Failed to update this review.");
      }
    } catch (err) {
      console.log("Error:", err);
    }  
  }

  const handleEditClick = (id, reviewText) => {
    setEditReviewId(id);
    setEditReviewText(reviewText);
  };

  const handleEditInputChange = (e) => {
    setEditReviewText(e.target.value);
  };

  const handleEditSubmit = async (id) => {
    await updateReview(id);
    getAllReviews();
  };

  const cancelEdit = () => {
    setEditReviewId(null);
    setEditReviewText("");
  };
  
  async function deleteReview(id) {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/review/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        setReviews((preReviews) => 
          preReviews.filter((review) => review.id !== id)
        );
        console.log("Review deleted successfully.");
      } else {
        console.log("Failed to delete review");
      }
    } catch (err) {
      console.log("Error:", err);
    }
  }

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure to delete this review?")) {
      await deleteReview(id);
    }
  }
  
  return (
    <div className="review-list">
      <input type="text" id="searchReviewInput" name="searchReviewInpu" placeholder="Search your review by title" required 
      onChange={ (e) => {e.preventDefault(); setSearchInput(e.target.value)} }/>
      <ul className="list">
        {review.map((item) => {
          return (
            <li key={item.id} className="review-item" review-id={item.id}>
              <h4>Movie: {item.movie.title}</h4>
              <p>{item.text}</p>
              <span>Created by: {item.author.name}</span>
              <br/>
              {editReviewId === item.id ? (
                <div>
                  <textarea value={editReviewText} onChange={handleEditInputChange} rows={10} />
                  <button onClick={() => handleEditSubmit(item.id)}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </div>
              ) : (
                <div>
                  <p>{item.content}</p>
                  <button onClick={() => handleEditClick(item.id, item.content)}>Edit</button>
                  <button onClick={() => handleDeleteClick(item.id)}>Delete</button>
                </div>
              )}
            </li>
          )} 
        )}
      </ul>
    </div>
  );
}
