
const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const showAllMovies = () => knex("movies").select("*");

const showAllShowingMovies = () =>
  knex("movies_theaters as mt")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .select("*")
    .where({ is_showing: true })
    .then((moviesBeingShown) => {
      return moviesBeingShown.filter((element, index, arr) => {
        return (
          index ===
          arr.findIndex((selected) => selected.movie_id === element.movie_id)
        );
      });
    });

const getMovie = (id) =>
  knex("movies")
    .select("*")
    .where({ movie_id: id })
    .then((movies) => movies[0]);

const getTheaters = (id) =>
  knex("movies_theaters as mt")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("*")
    .where({ movie_id: id, is_showing: true });

const formatCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

const getReviews = (id) =>
  knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ movie_id: id })
    .then((data) => {
      return Promise.all(data.map(formatCritic));
    });

module.exports = {
  showAllMovies,
  showAllShowingMovies,
  getMovie,
  getTheaters,
  getReviews,
};