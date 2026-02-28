import React from "react";
import { connect } from "react-redux";
import {
  Card,
  CardContent,
  Fade,
  CardHeader,
  Button,
  Grid,
  Avatar,
  Box,
  Tabs,
  Tab,
  Typography,
  List,
  ListItem,
  ListItemText,
  Skeleton,
} from "@mui/material";
import AOS from "aos";
import { useHistory } from "react-router-dom";
import { setLoad, setLang, setDarkMode, setPage } from "../redux/action";
import getAge from "get-age";
import moment from "moment";

import Joyride from "react-joyride";
import stepEn from "../stepGuide/en/profile";
import stepTh from "../stepGuide/th/profile";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
function a11yProps2(index) {
  return {
    id: `simple-tab2-${index}`,
    "aria-controls": `simple-tabpanel2-${index}`,
  };
}

function compareTimestamps(timestamp1, timestamp2) {
  // Get the difference in milliseconds
  const difference = timestamp2 * 1000 - timestamp1 * 1000;

  // Calculate days
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  // Get remaining milliseconds after removing days
  const remainingMilliseconds = difference % (1000 * 60 * 60 * 24);

  // Calculate hours
  const hours = Math.floor(remainingMilliseconds / (1000 * 60 * 60));

  // Get remaining milliseconds after removing hours
  const remainingMinutes = remainingMilliseconds % (1000 * 60 * 60);

  // Calculate minutes
  const minutes = Math.floor(remainingMinutes / (1000 * 60));

  return {
    days,
    hours,
    minutes,
  };
}

const About = ({ currentPage, lang, setLang, setPage, guide }) => {
  const [data, setData] = React.useState(null);
  const [img, setImg] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  React.useState(() => {
    setTimeout(() => {
      setOpen(true);
    }, 50);
  }, [currentPage]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [value2, setValue2] = React.useState(0);

  const handleChange2 = (event, newValue) => {
    setValue2(newValue);
  };

  React.useEffect(() => {
    var requestOptions = {
      method: "POST",
    };

    setPage(lang == "th" ? "เกี่ยวกับข้าวฟ่าง" : "All About Kaofrang");
    fetch(
      process.env.REACT_APP_APIE + "/kfsite/getkaofranginfo",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setData(result.response);
      })
      .catch((error) => console.log("error", error));
  }, []);

  return (
    <Fade in={open} timeout={300}>
      <Box sx={{ marginTop: { xs: 0, md: 13 }, marginBottom: 15 }}>
        <CardHeader
          title={<h3>All about Kaofrang</h3>}
          subheader={
            lang == "th"
              ? "มารู้จักตัวตนของน้องข้าวฟ่างเบื้องต้นกันเถอะ!"
              : "Let's know about Kaofrang Yanisa on basic step."
          }
        />
        <div className="container mt-3">
          {data != null ? (
            <div data-aos="fade-in">
              <Grid container spacing={5}>
                <Grid item className="d-flex align-items-center" lg={5} xs={12}>
                  <Avatar
                    src={data.img}
                    slotProps={{
                      img: {
                        onLoad: () => setImg(true),
                      },
                    }}
                    sx={{
                      display: img ? "block" : "none",
                      width: { md: "400px", xs: "100%" },
                      height: { md: "400px", xs: "100%" },
                    }}
                  />
                  {!img && (
                    <Skeleton
                      variant="circular"
                      className="bg-m"
                      sx={{
                        width: { md: "400px", xs: window.innerWidth * 0.9 },
                        height: { md: "400px", xs: window.innerWidth * 0.9 },
                      }}
                    />
                  )}
                </Grid>
                <Grid item lg={7} xs={12}>
                  <Grid xs={12} data-aos="zoom-in-right" data-tour="profile-1">
                    <CardHeader
                      className="pl-0"
                      title={
                        <h4>
                          {lang == "th" ? "ชื่อจริง" : "Fullname"}:{" "}
                          {lang == "th"
                            ? data.fullnameTh[0]
                            : data.fullnameEn[0]}{" "}
                          {lang == "th"
                            ? data.fullnameTh[1]
                            : data.fullnameEn[1]}
                        </h4>
                      }
                      subheader={
                        <h6 className="text-muted">
                          {lang == "th" ? "ชื่อเล่น" : "Nickname"}:{" "}
                          {lang == "th" ? data.nameTH : data.name}
                        </h6>
                      }
                    />
                    <p>
                      {lang == "th" ? "ภูมิลำเนา" : "Domicile"}:{" "}
                      {data.province[lang]}
                    </p>
                    <p>
                      {lang == "th" ? "กรุ๊ปเลือด" : "Blood Group"}:{" "}
                      {data.blood[lang]}
                    </p>
                    <p>
                      {lang == "th" ? "วันเกิด" : "Birthday"}:{" "}
                      {moment(data.birthday, "YYYY-M-DD")
                        .lang(lang)
                        .local()
                        .format("DD MMMM YYYY")}
                    </p>
                    <p>
                      {lang == "th" ? "อายุ" : "Age"}:{" "}
                      {getAge(
                        moment(data.birthday, "YYYY-M-DD").format("YYYY-MM-DD")
                      ) + (lang == "th" ? " ปี" : " year(s) old")}
                    </p>
                    <p>
                      {lang == "th" ? "ผลงานด้านศิลปิน" : "Artists Profile"}:{" "}
                      {data.artists.join(", ")}
                    </p>
                    <p>
                      {lang == "th" ? "งานอดิเรก" : "Hobby"}:{" "}
                      {data.hobby[lang].join(", ")}
                    </p>
                    <p>
                      {lang == "th" ? "สิ่งที่ชอบ" : "Favorite"}:{" "}
                      {data.favorite[lang].join(", ")}
                    </p>
                    {/* <p>
                      {lang == "th" ? "สังกัดศิลปิน" : "Music label"}:{" "}
                      {data.musicLabel[lang].join(", ")}
                    </p> */}
                  </Grid>
                  <Button
                    variant="contained"
                    onClick={() => history.push("/follow?contactjob=true")}
                  >
                    {lang == "th" ? "ติดต่องาน" : "Contact for Working"}
                  </Button>
                </Grid>
              </Grid>
              <Joyride
                steps={lang == "th" ? stepTh : stepEn}
                continuous
                run={guide}
                styles={{
                  options: {
                    arrowColor: "#fb61ee",
                    backgroundColor: "#f1cef2",
                    primaryColor: "#f526fc",
                    textColor: "#000",
                  },
                }}
              />
            </div>
          ) : (
            <Grid container spacing={5}>
              <Grid item lg={5} xs={12}>
                <Skeleton
                  variant="circular"
                  className="bg-m"
                  sx={{
                    width: { md: "400px", xs: window.innerWidth * 0.9 },
                    height: { md: "400px", xs: window.innerWidth * 0.9 },
                  }}
                />
              </Grid>
              <Grid item lg={7} xs={12}>
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "4rem" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "2rem" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m mt-2"
                  sx={{ fontSize: "15px" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "15px" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "15px" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "15px" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "15px" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "15px" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "15px" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m mt-4"
                  sx={{ fontSize: "3rem" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "15px" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "15px" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "15px" }}
                />
              </Grid>
            </Grid>
          )}
        </div>
      </Box>
    </Fade>
  );
};

const mapStateToProps = (state) => ({
  load: state.load,
  dark: state.dark,
  lang: state.lang,
  guide: state.guide,
  currentPage: state.currentPage,
});
const mapDispatchToProps = (dispatch) => ({
  setLoad: (val) => dispatch(setLoad(val)),
  setDark: (val) => dispatch(setDarkMode(val)),
  setLang: (val) => dispatch(setLang(val)),
  setPage: (val) => dispatch(setPage(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(About);
