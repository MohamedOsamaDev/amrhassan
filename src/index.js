"use strict";

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */

  async bootstrap(/*{ strapi }*/) {
    const conditions = [
      {
        displayName: "Entity has same name as user",
        name: "same-name-as-user",
        plugin: "name of a plugin if created in a plugin",
        handler: (user) => {
          return {
            "location.createdBy.id":  user?.id
          };
        },
      },
    ];

    await strapi.admin.services.permission.conditionProvider.registerMany(
      conditions
    );
  },
};
