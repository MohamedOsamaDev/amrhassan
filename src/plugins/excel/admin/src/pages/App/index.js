// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import {
  BaseHeaderLayout,
  Box,
  Breadcrumbs,
  ContentLayout,
  Flex,
  Layout,
  Typography,
  DatePicker,
  Button,
  Alert,
} from "@strapi/design-system";
import { ArrowLeft, ArrowRight, Download } from "@strapi/icons";
import { useFetchClient } from "@strapi/helper-plugin";

const HomePage = () => {
  const { get, post, put, del } = useFetchClient();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setloading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [date, setDate] = useState({
    from: null,
    to: null,
  });
  const [response, setresponse] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      let isauthorized = user?.roles.find(
        (role) => role.name === "Super Admin" || role.name !== "admin"
      );
      if (isauthorized) {
        setAuth(true);
      }
    }
    setloading(false);
  }, []);
  const handleChooseFile = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };
  const handlechangeTime = (name, value) => {
    setDate({ ...date, [name]: value });
  };
  const handleExport = async () => {
    try {
      const res = await post("/excel-sheet/export", date);
      console.log("🚀 ~ handleExport ~ res:", res);
    } catch (error) {
      console.log("🚀 ~ handleExport ~ error:", error);
    }
  };
  const handleimport = async () => {
    try {
      // handle form data
      const formdata = new FormData();
      formdata.append("file", file);
      const { data } = await post("/excel-sheet/import", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setresponse({
        data: `تم تحصيل ${data?.count || ""} من اصل ${data?.total || ""}`,
        error: null,
      });
    } catch (error) {
      console.log("🚀 ~ handleimport ~ error:", error?.response?.data?.error);
      setresponse({
        error: error?.response?.data?.error?.message,
      });
    } finally {
      setFile(null);
      fileInputRef.current.value = null;
      setTimeout(() => {
        setresponse(null);
      }, 3000);
    }
  };

  if (loading) {
    return "loading";
  }
  if (!auth) {
    return <div></div>;
  }
  return (
    <Layout>
      <BaseHeaderLayout
        title="اكسل شيت"
        subtitle={<Breadcrumbs label="folders"></Breadcrumbs>}
        as="h2"
      />
      {response?.data && (
        <Alert
          style={{
            position: "fixed",
            left: "50%",
            transform: "translate(-50%, 0)",
            top: "20px",
            width: " max-content",
            maxWidth: " 90%",
          }}
          closeLabel="Close"
          title=""
          variant="success"
        >
          {response?.data}
        </Alert>
      )}
      {response?.error && (
        <Alert
          closeLabel="Close"
          style={{
            position: "fixed",
            left: "50%",
            transform: "translate(-50%, 0)",
            top: "20px",
            width: " max-content",
            maxWidth: " 90%",
          }}
          variant="danger"
        >
          {response?.error}
        </Alert>
      )}
      <ContentLayout>
        <Flex>
          <Box
            background="neutral0"
            hiddenXS
            borderStyle="solid"
            borderColor="neutral150"
            borderWidth="2px"
            style={{
              width: "550px",
              height: "460px",
              marginRight: 20,
              borderRadius: 10,
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "30px",
            }} // Setting width and height here
          >
            <Typography
              style={{
                width: "max-content",
                display: "flex",
                borderRadius: 10,
                textAlign: "center",
                alignItems: "center",
                gap: "10px",
                fontSize: 20,
                justifyContent: "center",
                fontWeight: "bold",
                padding: "5px 0px",
              }}
              textColor="neutral800"
            >
              <ArrowLeft
                className="custom-icon"
                style={{
                  fontSize: 30,
                  margin: "5px",
                  width: "20px",
                  height: "20px",
                }}
              />{" "}
              ادخل ملف اكسل
            </Typography>
            <Box
              style={{
                width: "100%",
                display: "flex",
                gap: "30px",
              }}
            >
              <Box
                style={{
                  width: "max-content",
                  display: "flex",
                  borderRadius: 5,
                  textAlign: "center",
                  alignItems: "center",
                  gap: "0",
                  fontSize: 15,
                  justifyContent: "center",
                  padding: "0",
                  border: "1px solid white",
                }}
                onClick={handleChooseFile}
              >
                {" "}
                <Button
                  style={{
                    padding: "15px 20px",
                    transtions: "04s",
                    cursor: "pointer",
                  }}
                >
                  {file ? `اخترت` : "اختار ملف"}
                </Button>
                <Typography
                  style={{
                    padding: file ? "0 10px" : "0",
                    fontSize: "12px",
                    letterSpacing: "0.5px",
                  }}
                >
                  {file?.name || ""}
                </Typography>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </Box>
              <Button
                onClick={handleimport}
                style={{
                  padding: "15px 20px",
                  transtions: "04s",
                  opacity: file ? "1" : "0",
                }}
              >
                تحصيل
              </Button>
            </Box>
            <Typography
              style={{
                width: "max-content",
                display: "flex",
                borderRadius: 10,
                textAlign: "center",
                alignItems: "center",
                gap: "10px",
                fontSize: 20,
                justifyContent: "center",
                fontWeight: "bold",
                padding: "5px 0px",
              }}
              textColor="neutral800"
            >
              <ArrowRight
                style={{
                  fontSize: 30,
                  margin: "5px",
                  width: "20px",
                  height: "20px",
                }}
              />{" "}
              اخراج تقرير
            </Typography>
            <DatePicker
              onChange={(val) => handlechangeTime("from", val)}
              selectedDate={date?.from}
              onClear={() => setDate({ ...date, from: null })}
              label="من"
              error={false}
              disabled={false}
            />
            <DatePicker
              onChange={(val) => handlechangeTime("to", val)}
              selectedDate={date?.to}
              onClear={() => setDate({ ...date, to: null })}
              label="الي"
              error={false}
              disabled={false}
            />
            <Button
              disabled={date.from === null || date.to === null}
              fullWidth
              onClick={handleExport}
              startIcon={<Download />}
            >
              اخراج ملف اكسل
            </Button>
          </Box>
        </Flex>
      </ContentLayout>
    </Layout>
  );
};

export default HomePage;
