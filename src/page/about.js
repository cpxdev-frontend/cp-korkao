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
  IconButton,
  ListItemAvatar,
  ListItemText,
  Skeleton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AOS from "aos";
import { useHistory } from "react-router-dom";
import { setLoad, setLang, setDarkMode, setPage } from "../redux/action";
import getAge from "get-age";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
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
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const toggleVisibility = () => {
      // ถ้าเลื่อนลงมาเกิน 50% ของความสูงหน้าจอ ให้ตั้งเป็น false (ซ่อน)
      if (window.scrollY > window.innerHeight / 2) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    // เพิ่ม Event Listener ตอน component โหลด
    window.addEventListener("scroll", toggleVisibility);

    // Cleanup function ลบ Listener ออกเมื่อไม่ได้ใช้
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const [width, setWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    // 2. สร้างฟังก์ชันที่จะทำงานเมื่อหน้าจอถูกยืดหรือหด
    const handleResize = () => {
      setWidth(window.innerWidth); // อัปเดตค่าความกว้างล่าสุดลงไปใน State
    };

    // 3. สั่งให้เบราว์เซอร์คอยเฝ้าฟัง (Listen) ว่ามีการ 'resize' เกิดขึ้นไหม
    window.addEventListener("resize", handleResize);

    // 4. Cleanup: ถอดการเฝ้าฟังออกเมื่อไม่ได้ใช้หน้านี้แล้ว (ป้องกันบั๊กกินแรม)
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        setData(result.response);
      })
      .catch((error) => console.log("error", error));
  }, []);

  return (
    <Fade in={open} timeout={300}>
      <Box>
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
                  <Grid
                    item
                    className="d-flex align-items-center"
                    lg={5}
                    xs={12}
                  >
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
                    <Grid
                      xs={12}
                      data-aos="zoom-in-right"
                      data-tour="profile-1"
                    >
                      <CardHeader
                        className="pl-0"
                        title={
                          <h3>
                            {lang == "th" ? "ชื่อจริง" : "Fullname"}:{" "}
                            {lang == "th"
                              ? data.fullnameTh[0]
                              : data.fullnameEn[0]}{" "}
                            {lang == "th"
                              ? data.fullnameTh[1]
                              : data.fullnameEn[1]}
                          </h3>
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
                          moment(data.birthday, "YYYY-M-DD").format(
                            "YYYY-MM-DD",
                          ),
                        ) + (lang == "th" ? " ปี" : " year(s) old")}
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // ใส่ padding หรือ margin เพิ่มได้ตามตำแหน่งที่จะวาง
            mt: 4,
          }}
        >
          <Fade in={isVisible}>
            <IconButton
              sx={{
                color: "text.secondary", // เปลี่ยนสีได้ตามตีมเว็บ
                animation: "bounce 2s infinite", // เรียกใช้แอนิเมชัน bounce วนลูปไปเรื่อยๆ
                // สร้าง Keyframes แอนิเมชันเด้งขึ้นลงตรงนี้เลย
                "@keyframes bounce": {
                  "0%, 20%, 50%, 80%, 100%": {
                    transform: "translateY(0)",
                  },
                  "40%": {
                    transform: "translateY(-15px)", // เด้งขึ้น 15px
                  },
                  "60%": {
                    transform: "translateY(-7px)", // เด้งขึ้นนิดนึง จังหวะลง
                  },
                },
                "&:hover": {
                  color: "primary.main", // ฮูเวอร์แล้วเปลี่ยนสีนิดนึง
                  bgcolor: "transparent", // ไม่เอาพื้นหลังวงกลมตอนโฮเวอร์
                },
              }}
              aria-label="scroll down"
            >
              <KeyboardArrowDownIcon sx={{ fontSize: 40 }} />
            </IconButton>
          </Fade>
        </Box>
        <Box sx={{ marginTop: { xs: 0, md: 10 }, marginBottom: 15 }}>
          <div className="text-center">
            <CardHeader
              title={<h3>Artist Journey</h3>}
              subheader={
                lang == "th"
                  ? "การเดินทางในฐานะศิลปินของข้าวฟ่าง"
                  : "Footstep of Kaofrang as artist."
              }
            />
          </div>
          <div className="container mt-3">
            {data != null ? (
              <div data-aos="fade-in">
                <Grid container className="container">
                  <Timeline
                    data-aos="fade-down"
                    position={width < 700 ? "right" : "alternate-reverse"}
                    sx={{
                      ...(width < 700 && {
                        [`& .${timelineItemClasses.root}:before`]: {
                          flex: 0,
                          padding: 0,
                        },
                      }),
                    }}
                  >
                    {/* Item 1 */}
                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineDot sx={{ background: "#fb61ee" }}>
                          <Avatar
                            src={
                              "https://cdn.cpxdev.workers.dev/kf/kffree.jpeg"
                            }
                          />
                        </TimelineDot>
                        {/* บังคับ minHeight และ bgcolor เพื่อให้เส้นปรากฏเสมอ */}
                        <TimelineConnector
                          sx={{
                            minHeight: "40px",
                            width: "2px",
                            bgcolor: "grey.400",
                          }}
                        />
                      </TimelineSeparator>
                      <TimelineContent
                        data-aos-delay="600"
                        data-aos="fade-right"
                      >
                        <Typography variant="h6" component="div">
                          {lang == "th" ? "ศิลปินอิสระ" : "Freelance Artist"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {lang == "th"
                            ? "เมษายน 2569 - ปัจจุบัน"
                            : "APR 2026 - PRESENT"}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>

                    {/* Item 2 */}
                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineDot sx={{ background: "#fb61ee" }}>
                          <Avatar src="https://cdn.cpxdev.workers.dev/kf/kfbnk.jpg" />
                        </TimelineDot>
                        {/* บังคับ minHeight และ bgcolor */}
                        <TimelineConnector
                          sx={{
                            minHeight: "40px",
                            width: "2px",
                            bgcolor: "grey.400",
                          }}
                        />
                      </TimelineSeparator>
                      <TimelineContent
                        data-aos-delay="600"
                        data-aos="fade-right"
                      >
                        <Typography variant="h6" component="div">
                          {lang == "th"
                            ? "สมาชิกวงบีเอ็นเคโฟตี้เอต รุ่นที่ 3"
                            : "BNK48 3rd Generation"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {lang == "th"
                            ? "สิงหาคม 2563 - มีนาคม 2569"
                            : "AUG 2020 - MAR 2026"}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>

                    {/* Item 3 */}
                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineDot sx={{ background: "#fb61ee" }}>
                          <Avatar src="https://cdn.cpxdev.workers.dev/kf/kfir.jpeg" />
                        </TimelineDot>
                        {/* Item สุดท้ายไม่ต้องมี TimelineConnector */}
                      </TimelineSeparator>
                      <TimelineContent
                        data-aos-delay="600"
                        data-aos="fade-right"
                      >
                        <Typography variant="h6" component="div">
                          {lang == "th"
                            ? "สมาชิกอินดี้แคมป์ ฤดูกาลที่ 2"
                            : "Indy Camp Project Season 2"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {lang == "th"
                            ? "มิถุนายน 2566 - เมษายน 2567"
                            : "JUN 2023 - APR 2024"}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  </Timeline>
                </Grid>
              </div>
            ) : (
              <Grid container spacing={5}>
                <Grid item xs={12}>
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
                </Grid>
              </Grid>
            )}
          </div>
        </Box>
        {/* <Box sx={{ marginTop: { xs: 0, md: 10 }, marginBottom: 15 }}>
          <div className="text-center">
            <CardHeader
              title={<h3>The Following artists & Social Creators</h3>}
              subheader={
                lang == "th"
                  ? "การเดินทางในฐานะศิลปินของข้าวฟ่าง"
                  : "Footstep of Kaofrang as artist."
              }
            />
          </div>
          
        </Box> */}
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
