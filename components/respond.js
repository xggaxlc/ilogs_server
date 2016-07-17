exports.respondWithResult = function(res, statusCode = 200) {
  return entity => {
    return entity ? res.status(statusCode).json({
      data: entity
    }) : res.status(statusCode).end();
  }
}

exports.respondWithCountAndResult = function(res, statusCode = 200) {
  return (count, entity) => {
    res.status(statusCode).json({
      count: count,
      data: entity
    });
  }
}

exports.saveUpdate = function(updates) {
  delete updates._id;
  updates.update_at = new Date();
  return entity => {
    entity.set(updates);
    return entity.save();
  }
}

exports.removeEntity = function() {
  return entity => {
    return entity.remove();
  }
}

exports.handleEntityNotFound = function(res) {
  return entity => {
    return entity ? entity : res.status(404).end();
  }
}

exports.handleError = function(res) {
  return err => {
    let statusCode = err.statusCode || (err.name === 'ValidationError' ? 400 : 500);
    res.status(statusCode).json(err);
  }
}