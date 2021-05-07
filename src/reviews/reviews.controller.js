const service = require("./reviews.services");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(request, response, next) {
    const {reviewId} = request.params;
    const review = await service.read(reviewId);

    if(review) {
        response.locals.review = review;
        return next();
    }

    next({
        status: 404, 
        message: "Review cannot be found"
    })
}
  
  async function update (request, response, next) {
    const updatedReview = {
      ...response.locals.review,
      ...request.body.data,
      review_id: response.locals.review.review_id,
    };
    
    await service.update(updatedReview);
    updatedReview.critic = await service.listCritics(updatedReview.critic_id)
    response.json({ data: updatedReview});
  }
  
  async function destroy (request, response, next) {
    await service.destroy(
      response.locals.review.review_id
    );
    response.sendStatus(204);
  }

  module.exports = {
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)]
  }