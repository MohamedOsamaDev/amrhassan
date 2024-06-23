'use strict';

/**
 * daily-attendance service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::daily-attendance.daily-attendance');
