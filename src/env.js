module.exports.showEnvVars = () => {
  console.log('Environment variables:');

  console.log('ORG:', `"${process.env.ORG}"`);
  console.log('REPO:', `"${process.env.REPO}"`);

  console.log('PRODUCT:', `"${process.env.PRODUCT}"`);
  console.log('PRODUCT_ID', `"${process.env.PRODUCT_ID}"`);

  console.log('BRANCH:', `"${process.env.BRANCH}"`);
  console.log('COMMIT:', `"${process.env.COMMIT}"`);

  console.log('SENTRY_ORG:', `"${process.env.SENTRY_ORG}"`);
  console.log('SENTRY_PROJECT:', `"${process.env.SENTRY_PROJECT}"`);
};
