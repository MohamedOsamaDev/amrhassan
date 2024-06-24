// @ts-nocheck
const findEmployee = async (list) => {
  const data = await strapi.entityService.findMany("api::employee.employee", {
    filters: {
      id_national: { $contains: list },
    },
  });
  return data || [];
};
const findloctionsID = async (list=[]) => {
  if (!list.length) return [];
  const data = await strapi.entityService.findMany("api::location.location", {
    filters: {
      name: { $contains: list },
    },
  });
  return data || [];
};
module.exports = {
  findEmployee,
  findloctionsID,
};
