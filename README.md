# <p style="text-align: center;"> Movie Review App</p>

### <p style="text-align: center;"> created by Mengxian Cai and Bijin Zhang</p>

This is a movie review web application where a user can search a movie by title, view basic details and published reviews of a movie, and write reviews for a movie.

## Available Functionalities

- **visitor**: can search movies, read movie details and reviews published by registered users, and can sign up to become a registered user;
- **registered user**: in addition to the above, can write/edit/delete movie reviews, can search their own reviews, and can change their user profile (user name)

## External Web API

This application used an external movie web API called MoviesDatabase (at <https://rapidapi.com/SAdrian/api/moviesdatabase>), which provides complete and updated data for over 9 million titles (movies, series and episodes).

When a user enters a title and clicks the search button, our web application will acquire search hits from this external API to display for the user's further choice.

## Local Environments

To run this Movie Review App locally, you may need to set your local environment as per the examples below.

## Client .env

```
REACT_APP_API_URL = "http://localhost:8000"
REACT_APP_AUTH0_DOMAIN = "YOUR_AUTH0_DOMAIN"
REACT_APP_AUTH0_CLIENT_ID ="YOUR_AUTH0_CLIENT_ID"
REACT_APP_AUTH0_AUDIENCE = "https://api.moviereviews"
REACT_APP_JWT_NAMESPACE = "https://api.moviereviews"
```

## API .env

The local database querystring is for reference only, please use the user name and password of your own local database.

```
DATABASE_URL = "mysql://root:1234@localhost:1234/moviereviewsdb"
MOVIE_API_URL = "https://moviesdatabase.p.rapidapi.com";
AUTH0_AUDIENCE = "YOUR_AUTH0_AUDIENCE";
AUTH0_ISSUER = "YOUR_AUTH0_ISSUER";
```
