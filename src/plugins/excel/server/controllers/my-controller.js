// @ts-nocheck
"use strict";

const { findEmployee, findloctionsID } = require("../utils/handlefind");
const handleDuplicateArrayOfObject = require("../utils/handleDuplicateArrayOfObject");
const { convrtExcelToJson, createExcel } = require("../utils/ExcelHandler");
const { parseISO, startOfDay, endOfDay } = require("date-fns");

module.exports = ({ strapi }) => ({
  export: async (ctx) => {
    try {
      const start = parseISO(ctx.request.body.from);
      const end = parseISO(ctx.request.body.to);
      const employees = await strapi.db
        .query("api::employee.employee")
        .findMany({
          where: {
            createdAt: {
              $gte: startOfDay(start),
              $lte: endOfDay(end),
            },
          },
          populate: { location: true },
        });
      employees.forEach((val) => {
        val.location = val.location?.name || "";
      });
      console.log("🚀 ~ employees.forEach ~ employees:", employees)
      let headers = [
        { header: "id", key: "id", width: 10 },
        { header: "الاسم", key: "name", width: 20 },
        { header: "رقم قومى", key: "id_national", width: 20 },
        { header: "حالة", key: "job_postion", width: 20 },
        { header: "العنوان", key: "address", width: 20 },
        { header: "موبايل", key: "phone", width: 20 },
        { header: "موقع", key: "location", width: 20 },
      ];
      const fileBuffer = await createExcel(employees,headers)
      ctx.set('Content-Disposition', 'attachment; filename="users.xlsx"');
      ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      return ctx.send(fileBuffer);
    } catch (error) {
      return ctx.badRequest(error);
    }
  },
  import: async (ctx) => {
    let massage = "حدث خطا او الملف تالف";
    try {
      // handle headers fro excel sheet
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
      // handle data fro excel sheet
      let { data, errors } = await convrtExcelToJson(
        ctx?.request?.files?.file?.path,
        headers
      );
      // check is date is not empty
      if (data && !errors) {
        // handel dublicate id_national
        let dataAfterhandleDuplicates = handleDuplicateArrayOfObject(
          data,
          "id_national"
        )
        const employees = await findEmployee(
          data?.map((val) => val?.id_national?.trim())
        );
        const newEmployees = [];
        dataAfterhandleDuplicates.forEach((value) => {
          if (
            !employees?.find(
              (value2) =>
                value2?.id_national.toString().trim() ===
                value?.id_national.toString().trim()
            )
          ) {
            newEmployees.push(value);
          }
        });
        if (!!newEmployees?.length) {
          // handle find Loctions
          let targetLoctions = [
            ...new Set(newEmployees?.map((val) => val?.location?.trim())),
          ].filter(Boolean);
          let loactions = await findloctionsID(targetLoctions);
          newEmployees.forEach((value) => {
            value.location = loactions.find((val) => val?.name.trim() === value?.location?.trim())?.id || null;
          });
          // handle create new employees
          newEmployees.map(async (val) => {
            try {
              return await strapi.db
                .query("api::employee.employee")
                .create({data:val});
            } catch (error) {
              console.log("🚀 ~ newEmployees.map ~ error:", error);
            }
          });
          return ctx.send({
            message: "success",
            count: newEmployees?.count || 0,
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
