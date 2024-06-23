import { request, } from "@strapi/helper-plugin";

const excelRequests = {
  export: async () => {
    return await request("/excel-sheet/", {
      method: "GET",
    });
  },
};

export default excelRequests