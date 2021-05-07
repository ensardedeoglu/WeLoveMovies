const service = require("./movies.services");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(request, response, next) {
  const is_showing = request.query.is_showing;

  let movieList;

  if (!is_showing) {
    movieList = await service.showAllMovies();
  }
  if (is_showing === "true") {
    movieList = await service.showAllShowingMovies();
  }
  response.json({ data: movieList });
}

async function movieExists(request, response, next) {
  const { movieId } = request.params;
  const movie = await service.getMovie(movieId);
  if (movie) {
    response.locals.movie = movie;
    return next();
  }
  return next({ status: 404, message: `Movie cannot be found.` });
}

async function readMovie(request, response, next) {
  let movie = response.locals.movie;
  response.json({ data: movie });
}

async function readTheaters(request, response, next) {
  const { movieId } = request.params;
  let theaters = await service.getTheaters(movieId);
  response.json({ data: theaters });
}

async function readReviews(request, response, next){
  const { movieId } = request.params;
  let reviews = await service.getReviews(movieId);
  response.json({data: reviews})
}

module.exports = {
  list: asyncErrorBoundary(list),
  readMovie: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readMovie)],
  readTheaters: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readTheaters),
  ],
  readReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readReviews)],
};