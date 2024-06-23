// @ts-nocheck
"use strict";

const convrtCustomExcel = require("../utils/convrtCustomExcel");

const { findEmployee } = require("../utils/findEmpolyees");
const handleDuplicateArrayOfObject = require("../utils/handleDuplicateArrayOfObject");
module.exports = ({ strapi }) => ({
  export(ctx) {
    try {
      console.log("🚀 ~ export ~ ctx:", ctx.request.body);

      return ctx.send({
        message: "Hello",
      });
    } catch (error) {
      return ctx.badRequest(error);
    }
  },
  import: async (ctx) => {
    let massage = "حدث خطا او الملف تالف";
    try {
      let headers = {
        موقع: "location",
        حالة: "job_postion",
        العنوان: "address",
        الوردية: "shift",
        "رقم قومى": "id_national",
        موبايل: "phone",
        الاسم: "name",
        م: "_id",
      };
      let { data, errors } = await convrtCustomExcel(
        ctx?.request?.files?.file?.path,
        headers
      );
      if (data && !errors) {
        let dataAfterhandleDuplicates = handleDuplicateArrayOfObject(
          data,
          "id_national"
        );
        // handle check if the id_national not already present in the database
        const employees = await findEmployee(
          data?.map((val) => val?.id_national)
        );
        const cleanData = [];
        dataAfterhandleDuplicates.forEach((value) => {
          if (
            !employees?.find(
              (value2) => +value2?.id_national === +value?.id_national
            )
          ) {
            cleanData.push(value);
          }
        });

        if (cleanData?.length > 0) {
          let newEmployees = await strapi.db
            .query("api::employee.employee")
            .createMany({
              data: cleanData,
            });
          return ctx.send({
            message: "success",
            count: newEmployees?.count,
            total: data?.length,
          });
        }
        massage = "ليس هناك اي عامل جديد لي اضافته";
      }
      return ctx.badRequest(massage, { errors });
    } catch (errors) {
      console.log("🚀 ~ import: ~ errors:", errors);
      return ctx.badRequest(massage, { errors });
    }
  },
});
