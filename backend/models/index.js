// new code
/**
 * Centralized Model Exporter
 * Dynamically loads and exports all models in the directory.
 */
const fs = require('fs');
const path = require('path');

const models = {};

// Auto-load all model files in this directory
fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.js') && file !== 'index.js')
  .forEach(file => {
    const modelName = file.replace('.js', '');
    models[modelName] = require(path.join(__dirname, file));
  });

module.exports = models;




// old code

// /**
//  * Centralized Model Exporter
//  * Helps keep import statements clean and consistent across the project.
//  */

// const Court = require('./Court');
// const Coach = require('./Coach');
// const Equipment = require('./Equipment');
// const Booking = require('./Booking');
// const PricingRule = require('./PricingRule');
// const User = require('./User');

// module.exports = {
//   Court,
//   Coach,
//   Equipment,
//   Booking,
//   PricingRule,
//   User
// };
