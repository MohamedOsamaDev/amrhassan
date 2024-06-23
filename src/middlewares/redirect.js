module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const condition = ["/", "/dashboard/", "/dashboard"].find((path) => path === ctx.request.url);
    if (condition) {
      return ctx.redirect("/dashboard/content-manager");
    }
    return await next();
  };
};
