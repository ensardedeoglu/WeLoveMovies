const knex = require("../db/connection");

function listCritics (criticId) { 
    return knex('critics as c')
      .where({'c.critic_id': criticId})
      .then((data) => data[0]);
}

function read (id) {
    return knex("reviews")
      .select("*")
      .where("review_id", id)
      .then((data) => data[0]);
}

function update (newReview) {
    return knex("reviews")
      .select("*")
      .where({ review_id: newReview.review_id })
      .update(newReview, "*");
}

function destroy (reviewId) {
  return knex("reviews").where("review_id", reviewId).del();
}

module.exports = {
    
    read,
    update,
    listCritics,
    destroy
}