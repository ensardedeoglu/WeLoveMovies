const service = require("./theaters.services");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(request, response, next) {
  const theaters = await service.listAllTheaters();

  for (let theater of theaters) {
    const movieList = await service.addMovieList(theater.theater_id);
    theater["movies"] = movieList;
  }
  response.json({ data: theaters });
}

module.exports = {
  list: asyncErrorBoundary(list),
};