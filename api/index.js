import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import fetch from "node-fetch";
import { auth } from "express-oauth2-jwt-bearer";

const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// API endpoints
// Ping page
app.get("/ping", (req, res) => {
  res.json("pong");
});

// verify user status, if not registered in our database we will create it
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        name,
      },
    });

    res.json(newUser);
  }
});

// READ: get movie data with :movieId
app.get("/movie/:movieId", async (req, res) => {
  var movieId = req.params.movieId;

  // If the movie is not yet in database, create the movie entry from external API
  if (
    !(await prisma.movie.findUnique({
      where: {
        imbdId: movieId,
      },
    }))
  ) {
    // Get movie data from external API
    const response = await fetch(
      `${process.env.MOVIE_API_URL}/titles/${movieId}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": process.env.MOVIE_API_KEY,
          "X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com",
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      const imbdId = data.results.id;
      const title = data.results.originalTitleText.text;
      const year = data.results.releaseYear
        ? parseInt(data.results.releaseYear.year)
        : 0;
      const posterURL = data.results.primaryImage
        ? data.results.primaryImage.url
        : "N/A";
      await prisma.movie.create({
        data: {
          imbdId,
          title,
          year,
          posterURL,
        },
      });
    }
  }
  const movieData = await prisma.movie.findUnique({
    where: {
      imbdId: movieId,
    },
    select: {
      imbdId: true,
      title: true,
      year: true,
      posterURL: true,
      reviews: {
        select: {
          id: true,
          text: true,
          author: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (movieData) {
    res.status(200).json(movieData);
  } else {
    res.status(404).send(`Movie id ${movieId} not found`);
  }
});

// CREATE: create a new movie review entry
app.post("/movie/:movieId", requireAuth, async (req, res) => {
  var movieId = req.params.movieId;
  const auth0Id = req.auth.payload.sub;
  const { text } = req.body;

  if (!text) {
    res.status(400).send("text is required to create a review");
  } else {
    await prisma.review.create({
      data: {
        text,
        author: { connect: { auth0Id: auth0Id } },
        movie: { connect: { imbdId: movieId } },
      },
    });
  }

  const newEntry = await prisma.review.findFirst({
    where: {
      author: {
        auth0Id: auth0Id,
      },
    },
    orderBy: {
      id: "desc",
    },
    select: {
      id: true,
      text: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  });
  res.status(201).json(newEntry);
});

// READ: get user data with :id
app.get("/user/profile", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  if (
    !(await prisma.user.findUnique({
      where: {
        auth0Id: auth0Id,
      },
    }))
  ) {
    return null;
  } else {
    const userData = await prisma.user.findUnique({
      where: {
        auth0Id: auth0Id,
      },
      select: {
        email: true,
        name: true,
        auth0Id: true,
        reviews: true,
      },
    });
    if (userData) {
      res.status(200).json(userData);
    } else {
      res.status(404).send(`User id ${auth0Id} not found`);
    }
  }
});

// UPDATE: update a user's username
app.put("/user/changename", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { name } = req.body;

  if (!name) {
    res.status(400).send("Username cannot be empty!");
  } else {
    const user = await prisma.user.update({
      where: {
        auth0Id: auth0Id,
      },
      data: {
        name: name,
      },
    });
    res.json(user);
  }
});

// READ: read all the post reviews
app.get("/review", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const reviews = await prisma.review.findMany({
    where: {
      author: {
        auth0Id: auth0Id,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      text: true,
      author: {
        select: {
          name: true,
        },
      },
      movie: {
        select: {
          title: true,
        },
      },
    },
  });
  res.json(reviews);
});

// UPDATE: update a movie review entry
app.put("/review/:reviewId", requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const { text } = req.body;

  if (!text) {
    res.status(400).send("Review cannot be empty!");
  } else {
    const review = await prisma.review.update({
      where: {
        id: parseInt(reviewId),
      },
      data: {
        text: text,
      },
    });
    res.json(review);
  }
});

// DELETE: delete a movie review entry
app.delete("/review/:reviewId", requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;

  const review = await prisma.review.delete({
    where: {
      id: parseInt(reviewId),
    },
  });
  if (review) {
    res.status(200).json({ message: `Deleted!` });
  } else {
    res.status(404).send(`Cannot delete this review`);
  }
});

//for deployment
const PORT = parseInt(process.env.PORT);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//local version
// app.listen(8000, () => {
//     console.log("Server running on http://localhost:8000");
// })
