module.exports = {
  classNameSlug: process.env.NODE_ENV === 'development' ? '[title]' : '[hash]'
};
