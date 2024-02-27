import { useEffect, useState } from "react";
import { useAuthToken } from "../AuthTokenContext";

export default function Profile() {

  const [user, setUser] = useState([]);
  const [editUsername, setEditUsername] = useState("");
  const { accessToken } = useAuthToken();


  async function getUserData() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        console.error("Fail to get user data");
      }
      const user = await response.json();
      setUser(user);
    } catch (err) {
      console.log("Error:", err);
    }
  }

  useEffect(() => {
    getUserData();
  }, []);

  async function updateUsername() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/user/changename`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: editUsername,
          }),
        }
      );
      if (response.ok) {
        getUserData();
        cancelEdit();
        console.log("Username updated successfully.");
      } else {
        console.log("Failed to update username.");
      }
    } catch (err) {
      console.log("Error:", err);
    }
  }

  const handleNameEditClick = (newName) => {
    setEditUsername(newName);
  };

  const handleEditUsernameInputChange = (e) => {
    setEditUsername(e.target.value);
  };

  const handleUsernameEditSubmit = () => {
    updateUsername();
    getUserData();
  };

  const cancelEdit = () => {
    setEditUsername("");
  };

  return (
    <div>
      <br />
      <div className="Username" name-id={user.auth0Id}>
        <p>😃 Name: {user.name}</p>
        {editUsername !== "" ? (
          <div>
            <textarea
              value={editUsername}
              onChange={handleEditUsernameInputChange}
              rows={1}
            />
            <button onClick={() => handleUsernameEditSubmit()}>Save</button>
            <button onClick={cancelEdit}>Cancel</button>
          </div>
        ) : (
          <div>
            <button onClick={() => handleNameEditClick(user.name)}>
              Edit
            </button>
          </div>
        )}
      </div>
      <br />
      <div className="Email" name-id={user.auth0Id}>
        <p>📧 Email: {user.email}</p>
      </div>
      <br />
      <div className="ReviewsCount" name-id={user.auth0Id}>
        <p>📜 Total Reviews: {user.reviews?.length}</p>
      </div>
      <br />
      <div className="Auth0Id" name-id={user.auth0Id}>
        <p>🔑 Auth0Id: {user.auth0Id}</p>
      </div>
    </div>
  );
}
