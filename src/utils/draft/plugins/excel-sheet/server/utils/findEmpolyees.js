const findEmployee = async (list) => {
  const data = await strapi.entityService.findMany("api::employee.employee", {
    filters: {
      id_national: { $contains: list },
    },
  });
  return data || [];
};

module.exports = {
  findEmployee,
};
