import React from "react";
import { connect } from "react-redux";
import { styled } from "@mui/material/styles";
import { Tweet } from "react-tweet";
import { Doughnut } from "react-chartjs-2";

import {
  Card,
  CardContent,
  LinearProgress,
  CardActions,
  CardHeader,
  Button,
  Grid,
  Avatar,
  Fade,
  Box,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  DialogActions,
  Fab,
  DialogContent,
  Dialog,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  CardMedia,
  Backdrop,
  MenuItem,
  Stack,
  Chip,
} from "@mui/material";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import Swal from "sweetalert2";
import {
  setLoad,
  setLang,
  setDarkMode,
  setPage,
  setLaunch,
} from "../redux/action";
import moment from "moment";
import CountUp from "react-countup";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Grow,
  Slider,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useHistory } from "react-router-dom";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RecommendIcon from "@mui/icons-material/Recommend";
import Draggable from "react-draggable";
import { v4 as uuidv4 } from "uuid";
import { Resizable } from "re-resizable";
import * as htmlToImage from "html-to-image";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import { SketchPicker } from "react-color";
import ReactGA from "react-ga4";

import { QRCode } from "react-qrcode-logo";
import ScheduleIcon from "@mui/icons-material/Schedule";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import PollIcon from "@mui/icons-material/Poll";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import { use } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />;
});

const generatePayload = require("promptpay-qr");
let mem = false;
const moneyCurren = [
  {
    val: "khr",
    lab: "Cambodia Riel (KHR)",
  },
  {
    val: "hkd",
    lab: "Hong Kong Dollar (HKD)",
  },
  {
    val: "idr",
    lab: "Indonesian Rupiah (IDR)",
  },
  {
    val: "lak",
    lab: "Lao PDR Kip (LAK)",
  },
  {
    val: "myr",
    lab: "Malaysia Ringgit (MYR)",
  },
  {
    val: "sgd",
    lab: "Singapore Dollar (SGD)",
  },
  {
    val: "vnd",
    lab: "Vietnamese Dong (VND)",
  },
];

const pp = [
  "1905485000382038409",
  "1905288713321730277",
  "1899324405676675232",
  "1898629346958721503",
  "1897497368603263369",
  "1892882124812013942",
  "1892876997673587108",
  "1889661044085178474",
  "1888090381193015677",
  "1887727996083077573",
  "1887003216451154071",
  "1885553666683290061",
  "1883104527345418554",
  "1882775360976134475",
  "1879030684255146040",
  "1868559133781463192",
];

function compareTimestamps(timestamp1, timestamp2) {
  // Get the difference in milliseconds
  const difference = timestamp2 * 1000 - timestamp1 * 1000;

  // Calculate days
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  // Get remaining milliseconds after removing days
  const remainingMillisecondsAfterDays = difference % (1000 * 60 * 60 * 24);

  // Calculate hours
  const hours = Math.floor(remainingMillisecondsAfterDays / (1000 * 60 * 60));

  // Get remaining milliseconds after removing hours
  const remainingMillisecondsAfterHours =
    remainingMillisecondsAfterDays % (1000 * 60 * 60);

  // Calculate minutes
  const minutes = Math.floor(remainingMillisecondsAfterHours / (1000 * 60));

  // Get remaining milliseconds after removing minutes
  const remainingMillisecondsAfterMinutes =
    remainingMillisecondsAfterHours % (1000 * 60);

  // Calculate seconds
  const seconds = Math.floor(remainingMillisecondsAfterMinutes / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

const Ge = ({
  currentPage,
  lang,
  setLang,
  setLaunch,
  setPage,
  launch,
  leftmode,
  opacity,
  guide,
}) => {
  const history = useHistory();
  const [ge5, setGe5Result] = React.useState(null);
  const [h, setH] = React.useState(window.innerHeight);
  const [sizes, setSizescreennotmatch] = React.useState(
    window.innerWidth < 900
  );
  const [sizezoom, setSizeZoom] = React.useState(0);
  const [qrCode, setqrCode] = React.useState(
    generatePayload("004999199434118", {})
  );
  const cardsuccess = React.useRef(null);
  const [num, setNum] = React.useState(100);
  const [rate, setRate] = React.useState(0);
  const [lock, setLockcache] = React.useState(false);
  const [change, setLockchange] = React.useState(false);
  const [print, setPrint] = React.useState(false);
  const [exc, setExch] = React.useState([]);
  const [excDate, setExchd] = React.useState("");
  const [setexc, setSelctedExc] = React.useState("-");

  const [time, setTime] = React.useState(moment().unix());

  const [text, setAddText] = React.useState([]);

  const [gedonate, setGeDonate] = React.useState(false);
  const [img, setAddImg] = React.useState([]);

  const [load, setLoad] = React.useState(false);
  const [timeline, setCurrentTimeline] = React.useState(0);

  const [votehispromote, setpromote] = React.useState(0);

  function comma(number) {
    const formatter = new Intl.NumberFormat("en-US");
    const formattedNumber = formatter.format(number);
    return formattedNumber;
  }

  React.useEffect(() => {
    if (lang != "th") {
      fetch(
        // "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@" +
        //   moment().format("YYYY.M") +
        //   "/v1/currencies/thb.json?time=" +
        //   moment().unix(),
        "https://latest.currency-api.pages.dev/v1/currencies/thb.json",
        {
          method: "get",
        }
      )
        .then((response) => response.json())
        .then((result) => {
          setExch(result.thb);
          setExchd(result.date);
        })
        .catch((error) => {
          console.log("error", error);
          setExch([]);
          setExchd("");
        });
    }
  }, [lang]);

  React.useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (text.length == 0 && img.length == 0) {
        return;
      }
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [text, img]);

  const RefreshDate = () => {
    setGe5Result({
      rank: 15,
      member: "Kaofrang_BNK48",
      token: 17385.19,
    });
  };

  const [open, setOpen] = React.useState(false);
  React.useState(() => {
    setTimeout(() => {
      setOpen(true);
    }, 50);
  }, [currentPage]);

  React.useEffect(() => {
    RefreshDate();
    if (
      moment.unix(launch) >= moment.unix(1743235200) &&
      moment.unix(launch) <= moment.unix(1743264000)
    ) {
      setInterval(() => {
        RefreshDate();
      }, 10000);
    }
    window.addEventListener(
      "resize",
      function (event) {
        setSizescreennotmatch(window.innerWidth < 900);
        setH(window.innerHeight);
        if (window.innerWidth < 1056) {
          setSizeZoom(
            cardsuccess.current != null
              ? cardsuccess.current.clientWidth / window.innerWidth
              : 0
          );
        } else {
          setSizeZoom(0);
        }
      },
      true
    );
    setPage(
      lang == "th"
        ? "กิจกรรมการเลือกตั้งเซมบัดซึทั่วไปของ BNK48 และ CGM48 ครั้งที่ 5"
        : "BNK48 & CGM48 Senbatsu General Election 2025"
    );
  }, []);

  React.useEffect(() => {
    setTime(moment().unix());
    setTimeout(() => {
      setInterval(() => {
        setpromote((prevVote) => (prevVote == 3 ? 0 : prevVote + 1));
      }, 1500);
    }, 2000);
    fetch(
      (Math.floor(Math.random() * 10) + 1 < 4
        ? process.env.REACT_APP_APIE
        : process.env.REACT_APP_APIE_2) + "/kfsite/gettime",
      {}
    )
      .then((response) => response.text())
      .then((result) => {
        setTime(parseInt(result));
        setInterval(() => {
          setTime((prevCount) => prevCount + 1);
        }, 990);
      })
      .catch((error) => console.log("error", error));
  }, []);

  const ExportQR = () => {
    if (cardsuccess.current === null) {
      return;
    }
    setPrint(true);
    setLoad(true);
    ReactGA.event({
      category: "User",
      action: "Save QR Payment - GE5",
    });
    setTimeout(() => {
      toJpeg(cardsuccess.current, {
        includeQueryParams: true,
        preferredFontFormat:
          "QGZvbnQtZmFjZXtuYW1lOidtaXNhbnMnO3NyYzp1cmwoJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9naC9jcHgyMDE3L21pc2Fuc2ZvbnRAbWFpbi9lbi9NaVNhbnMtTm9ybWFsLndvZmYyJykgZm9ybWF0KCd3b2ZmMicpLHVybCgnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L2doL2NweDIwMTcvbWlzYW5zZm9udEBtYWluL2VuL01pU2Fucy1Ob3JtYWwud29mZicpIGZvcm1hdCgnd29mZicpO2ZvbnQtd2VpZ2h0OjUwMDtmb250LXN0eWxlOm5vcm1hbDtmb250LWRpc3BsYXk6c3dhcH0=",
      })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = "KorKao QR Donate for GE5.jpg";
          link.href = dataUrl;
          link.click();
          setPrint(false);
          setLoad(false);
          if (change == false && mem == false) {
            mem = true;
            setTimeout(() => {
              setRate(0);
            }, 30000);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoad(false);
        });
    }, 200);
  };

  const getsessionactive = (v) => {
    switch (v) {
      case 0: {
        if (
          moment.unix(launch) > moment.unix(1733590800) &&
          moment.unix(launch) <= moment.unix(1734281999)
        ) {
          return true;
        }
        return false;
      }
      case 1: {
        if (
          moment.unix(launch) > moment.unix(1739250000) &&
          moment.unix(launch) <= moment.unix(1743091200)
        ) {
          return true;
        }
        return false;
      }
      case 2: {
        if (
          moment.unix(launch) > moment.unix(1739358000) &&
          moment.unix(launch) <= moment.unix(1739365200)
        ) {
          return true;
        }
        return false;
      }
      case 3: {
        if (
          moment.unix(launch) > moment.unix(1743224400) &&
          moment.unix(launch) <= moment.unix(1743260400)
        ) {
          return true;
        }
        return false;
      }
    }
  };
  const getsessioncomplete = (v) => {
    switch (v) {
      case 0: {
        if (moment.unix(launch) > moment.unix(1734281999)) {
          return true;
        }
        return false;
      }
      case 1: {
        if (moment.unix(launch) > moment.unix(1743091200)) {
          return true;
        }
        return false;
      }
      case 2: {
        if (moment.unix(launch) > moment.unix(1739365200)) {
          return true;
        }
        return false;
      }
      case 3: {
        if (moment.unix(launch) > moment.unix(1743260400)) {
          return true;
        }
        return false;
      }
    }
  };
  function ordinal_suffix_of(i) {
    let j = i % 10,
      k = i % 100;
    if (j === 1 && k !== 11) {
      return i + "st";
    }
    if (j === 2 && k !== 12) {
      return i + "nd";
    }
    if (j === 3 && k !== 13) {
      return i + "rd";
    }
    return i + "th";
  }
  const getGEResulttext = () => {
    if (moment.unix(launch) < moment.unix(1743235200)) {
      return lang == "th"
        ? "<h5>ระบบอยู่ระหว่างการเตรียมความพร้อม</h5>"
        : "<h5>System is preparing</h5>";
    }
    if (ge5 != undefined && ge5 != null) {
      if (ge5.rank == 1) {
        return lang == "th"
          ? "ยินดีด้วย! ข้าวฟ่างได้รับตำแหน่ง<b>เซนเตอร์ในเพลงหลัก</b>ของซิงเกิ้ลที่ 19 ของ BNK48 ด้วยคะแนน <b>" +
              ge5.token +
              " โทเคน</b>"
          : "Congratulations! Kaofrang Yanisa is <b>Center Position of Main song</b> of BNK48 19th Single by <b>" +
              ge5.token +
              " tokens</b>";
      } else if (ge5.rank == 13) {
        return lang == "th"
          ? "ยินดีด้วย! ข้าวฟ่างได้รับตำแหน่งเซนเตอร์ในเพลงรอง (เพลงที่สอง) ของซิงเกิ้ลที่ 19 ของ BNK48 ด้วยคะแนน <b>" +
              ge5.token +
              " โทเคน</b>"
          : "Congratulations! Kaofrang Yanisa is <b>Center Position of Couple song (2nd Song)</b> of BNK48 19th Single by <b>" +
              ge5.token +
              " tokens</b>";
      } else if (ge5.rank == 25) {
        return lang == "th"
          ? "ยินดีด้วย! ข้าวฟ่างได้รับตำแหน่ง<b>เซนเตอร์ในเพลงรอง (เพลงที่สาม)</b> ของซิงเกิ้ลที่ 19 ของ BNK48 ด้วยคะแนน <b>" +
              ge5.token +
              " โทเคน</b>"
          : "Congratulations! Kaofrang Yanisa is <b>Center Position of Couple song (3rd Song)</b> of BNK48 19th Single by <b>" +
              ge5.token +
              " tokens</b>";
      } else {
        return lang == "th"
          ? "ยินดีด้วย! ข้าวฟ่างอยู่ในอันดับที่ <b>" +
              ge5.rank +
              "</b> ด้วยคะแนน <b>" +
              ge5.token +
              " โทเคน</b>"
          : "Congratulations! Kaofrang Yanisa is in <b>" +
              ordinal_suffix_of(ge5.rank) +
              " place</b> of BNK48 & CGM48 Senbatsu General Election 2025 by <b>" +
              ge5.token +
              " tokens</b>";
      }
    }
    return lang == "th"
      ? "<h5>อยู่ระหว่างการประมวลผล</h5>"
      : "<h5>Processing the result</h5>";
  };

  React.useEffect(() => {
    setqrCode(
      generatePayload("004999166938497", {
        amount: num,
      })
    );
  }, [num]);

  return (
    <Fade in={open} timeout={300}>
      <Box sx={{ marginTop: { xs: 0, md: 13 }, marginBottom: 15 }}>
        <CardHeader
          title={<h3>BNK48 & CGM48 Senbatsu General Election 2025</h3>}
          subheader={
            lang == "th"
              ? "การเลือกตั้งเซมบัดสึครั้งสุดท้ายของน้องข้าวฟ่าง"
              : "The last of General Election of Kaofrang"
          }
        />

        {(window.location.origin.includes("beta.korkao.pages.dev") ||
        window.location.origin.includes("localhost")
          ? time < 1743091200
          : time >= 1739250000 && time < 1743091200) && (
          <Box className="d-flex justify-content-center">
            <Card sx={{ width: window.innerWidth < 500 ? "95%" : 550 }}>
              <CardContent className="row text-center">
                <div className="col-12 mb-3">
                  <h5>
                    {lang == "th"
                      ? "นับถอยหลังระยะเวลาคงเหลือในการโหวต"
                      : "Voting Period time remaining"}
                  </h5>
                </div>
                <div
                  className="col-3"
                  style={{
                    color:
                      compareTimestamps(time, 1743091200).days <= 7 &&
                      compareTimestamps(time, 1743091200).days > 0
                        ? "#fc7703"
                        : compareTimestamps(time, 1743091200).days <= 0 &&
                          compareTimestamps(time, 1743091200).hours <= 23
                        ? "red"
                        : "",
                  }}
                >
                  <p>{lang == "th" ? "วัน" : "Day(s)"}</p>
                  <h3>{compareTimestamps(time, 1743091200).days}</h3>
                </div>
                <div
                  className="col-3"
                  style={{
                    color:
                      compareTimestamps(time, 1743091200).days <= 7 &&
                      compareTimestamps(time, 1743091200).days > 0
                        ? "#fc7703"
                        : compareTimestamps(time, 1743091200).days <= 0 &&
                          compareTimestamps(time, 1743091200).hours <= 23
                        ? "red"
                        : "",
                  }}
                >
                  <p>{lang == "th" ? "ชั่วโมง" : "Hour(s)"}</p>
                  <h3>{compareTimestamps(time, 1743091200).hours}</h3>
                </div>
                <div
                  className="col-3"
                  style={{
                    color:
                      compareTimestamps(time, 1743091200).days <= 7 &&
                      compareTimestamps(time, 1743091200).days > 0
                        ? "#fc7703"
                        : compareTimestamps(time, 1743091200).days <= 0 &&
                          compareTimestamps(time, 1743091200).hours <= 23
                        ? "red"
                        : "",
                  }}
                >
                  <p>{lang == "th" ? "นาที" : "Minute(s)"}</p>
                  <h3>{compareTimestamps(time, 1743091200).minutes}</h3>
                </div>
                <div
                  className="col-3"
                  style={{
                    color:
                      compareTimestamps(time, 1743091200).days <= 7 &&
                      compareTimestamps(time, 1743091200).days > 0
                        ? "#fc7703"
                        : compareTimestamps(time, 1743091200).days <= 0 &&
                          compareTimestamps(time, 1743091200).hours <= 23
                        ? "red"
                        : "",
                  }}
                >
                  <p>{lang == "th" ? "วินาที" : "Second(s)"}</p>
                  <h3>{compareTimestamps(time, 1743091200).seconds}</h3>
                </div>
                <div className="container mt-4">
                  {lang == "th"
                    ? "คุณสามารถดูผลการทำรายการโหวตด้วย GE5 Token ผ่านเว็บไซต์ TokenX ได้"
                    : "Check your previous transaction in TokenX Smart Contract "}
                  <a
                    href="https://scan.tokenx.finance/address/0x674Ab311C94780207a1357De9bcdd357d23f459E?tab=token_transfers"
                    target="_blank"
                  >
                    {lang == "th" ? "ที่นี่" : "here"}
                  </a>
                  {lang == "th"
                    ? " - TokenX เป็นบริษัทดูแลแพลตฟอร์มสินทรัพย์ดิจิทัลภายใต้กลุ่มบริษัทเอสซีบี เอกซ์ จํากัด (มหาชน)"
                    : " - TokenX is digital asset platform and management undered of SCB X PCL."}
                </div>
              </CardContent>
            </Card>
          </Box>
        )}

        <Box className="m-3">
          <CardHeader title="Event TimeLine" />
          <Stepper
            orientation={window.innerWidth > 1100 ? "landscape" : "vertical"}
          >
            <Step
              active={getsessionactive(0)}
              completed={getsessioncomplete(0)}
            >
              <StepLabel
                StepIconComponent={ScheduleIcon}
                sx={{ backgroundColor: timeline > 0 ? "#58eb34" : "" }}
              >
                <h6>
                  {lang == "th"
                    ? "เปิดลงทะเบียนการเข้าร่วมกิจกรรม (สำหรับเมมเบอร์ BNK48 และ CGM48)"
                    : "Candidate Acceptance Period (For BNK48 and CGM48 members session)"}
                </h6>
              </StepLabel>
              <StepContent>
                {lang == "th"
                  ? "วันที่ 8 - 15 ธันวาคม 2567"
                  : "December 8-15, 2024"}
              </StepContent>
            </Step>
            <Step
              active={getsessionactive(1)}
              completed={getsessioncomplete(1)}
            >
              <StepLabel
                StepIconComponent={HowToVoteIcon}
                sx={{ backgroundColor: timeline > 1 ? "#58eb34" : "" }}
              >
                <h6>{lang == "th" ? "เปิดการโหวต" : "Voting Period"}</h6>
              </StepLabel>
              <StepContent>
                {lang == "th"
                  ? "วันที่ 11 กุมภาพันธ์ - 27 มีนาคม 2568"
                  : "Feburary 11 - March 27, 2025"}
              </StepContent>
            </Step>
            <Step
              active={getsessionactive(2)}
              completed={getsessioncomplete(2)}
            >
              <StepLabel
                StepIconComponent={PollIcon}
                sx={{ backgroundColor: timeline > 2 ? "#58eb34" : "" }}
              >
                <h6>
                  {lang == "th"
                    ? "ประกาศผลด่วน 24 ชั่วโมงแรก"
                    : "The Preliminary Announcement"}
                </h6>
              </StepLabel>
              <StepContent>
                {lang == "th"
                  ? "วันที่ 12 กุมภาพันธ์ 2568"
                  : "February 12, 2025"}
              </StepContent>
            </Step>
            <Step
              active={getsessionactive(3)}
              completed={getsessioncomplete(3)}
            >
              <StepLabel
                StepIconComponent={LiveTvIcon}
                sx={{ backgroundColor: timeline > 3 ? "#58eb34" : "" }}
              >
                <h6>
                  {lang == "th"
                    ? "ประกาศผลอย่างเป็นทางการ"
                    : "Final Announcement"}
                </h6>
              </StepLabel>
              <StepContent>
                {lang == "th" ? "วันที่ 29 มีนาคม 2568" : "March 29, 2025"}
              </StepContent>
            </Step>
          </Stepper>
        </Box>

        <CardHeader
          title={
            <h4 className="d-flex">
              {moment.unix(launch) >= moment.unix(1743235200) &&
                moment.unix(launch) <= moment.unix(1743264000) && (
                  <div class="red-dot mr-2"></div>
                )}
              General Election Result
            </h4>
          }
          subheader={
            <p
              onClick={() => window.open("//withmywish.com/ge-2025", "_blank")}
              dangerouslySetInnerHTML={{
                __html:
                  getGEResulttext() +
                  "" +
                  (lang == "th"
                    ? '<div class="mt-3">ข้อมูลโดยวิชมายวิช</div>'
                    : '<div class="mt-3">Provided by WithMyWish</div>'),
              }}
            ></p>
          }
          className="m-2 mt-5 border border-pink"
          sx={{ borderRadius: 6 }}
        />
        <Button
          className="mb-5 ml-3"
          variant="contained"
          onClick={() =>
            window.open(
              "https://lookerstudio.google.com/reporting/c8d18911-98e1-4508-afe5-6f3402f95244/page/emWvE",
              "_blank"
            )
          }
        >
          {lang == "th"
            ? "ดูสถิติการโหวตอย่างเป็นทางการ"
            : "View official statistics"}
        </Button>

        <div className="container">
          <div className="row">
            <Card className="col-md-6">
              <CardHeader
                title={
                  lang == "th" ? "ผลการโหวตย้อนหลัง" : "Voting Result History"
                }
              />
              <List
                component={CardContent}
                sx={{
                  width: "100%",
                  bgcolor: "background.paper",
                }}
              >
                <ListItem sx={{ cursor: "pointer" }} onClick={() => {}}>
                  <ListItemAvatar>
                    <Avatar className="iconchoice">
                      <small style={{ fontSize: 15 }}>15th</small>
                    </Avatar>
                  </ListItemAvatar>
                  {lang == "th" ? (
                    <ListItemText
                      primary='ผลอย่างเป็นทางการ | BNK48 19th Couple Song "Chouhatsu no Aozora" (Original by NMB48 Team N)'
                      secondary={
                        "รวมจำนวนเงินในการโหวตทั้งสิ้นโดยประมาณ 1,182,192.92 บาท"
                      }
                    />
                  ) : (
                    <ListItemText
                      primary='Official Result | BNK48 19th Couple Song "Chouhatsu no Aozora" (Original by NMB48 Team N)'
                      secondary={
                        "Estimated total income 1,182,192.92 THB (or about USD 34,844.68 based on exchange rate as of 28 March 2025)"
                      }
                    />
                  )}
                </ListItem>
                <ListItem
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    window.open("//withmywish.com/ge-2025", "_blank")
                  }
                >
                  <ListItemAvatar>
                    <Avatar className="iconchoice">
                      <small style={{ fontSize: 15 }}>31st</small>
                    </Avatar>
                  </ListItemAvatar>
                  {lang == "th" ? (
                    <ListItemText
                      primary="ผลด่วนรอบที่สอง - ผลด่วนรอบนี้จะไม่มีการประกาศยอดโทเคนที่ได้รับ"
                      secondary={
                        "ข้อมูลวันที่ " +
                        moment("2025-03-09").lang(lang).format("DD MMMM YYYY")
                      }
                    />
                  ) : (
                    <ListItemText
                      primary="2nd Preliminary Result - This result will not show tokens"
                      secondary={
                        "Latest result in " +
                        moment("2025-03-09").lang(lang).format("DD MMMM YYYY")
                      }
                    />
                  )}
                </ListItem>
                <ListItem
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    window.open(
                      "//withmywish.com/ge-2025/#1st-pre-result",
                      "_blank"
                    )
                  }
                >
                  <ListItemAvatar>
                    <Avatar className="iconchoice">
                      <small style={{ fontSize: 15 }}>29th</small>
                    </Avatar>
                  </ListItemAvatar>
                  {lang == "th" ? (
                    <ListItemText
                      primary="ผลด่วนรอบแรก - การประกาศผลใน 24 ชั่วโมงหลังเปิดโหวต"
                      secondary={"1,387.46 โทเคน (โดยประมาณ 94,347.28 บาท)"}
                    />
                  ) : (
                    <ListItemText
                      primary="1st Preliminary Result - The first 24 hour voting result"
                      secondary={
                        "1,387.46 tokens (Estimated income 94,347.28 THB)"
                      }
                    />
                  )}
                </ListItem>
              </List>
            </Card>
            <div className="col-1" />
            <Card className="col-md">
              <CardHeader
                title={lang == "th" ? "สรุปยอดการโหวต" : "Voting Summary"}
              />
              <Doughnut
                data={{
                  labels: [
                    "โหวตผ่านช่องทาง อฟช.",
                    "ทางบ้านจัดซื้อโทเคนเอง",
                    "การรับสมทบโทเคนจากผู้อื่น",
                    "จากการโดเนท (ผ่านเลขที่บัญชีของบ้าน)",
                  ],
                  datasets: [
                    {
                      label: "Tokens",
                      data: [15149.19, 1407, 777, 52],
                      backgroundColor: [
                        "#f090fc",
                        "#fb61ee",
                        "#8959f7",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                        "rgba(255, 159, 64, 0.2)",
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </Card>
          </div>
        </div>

        <CardHeader
          title="Mini Statistic"
          subheader={
            lang == "th" ? "ข้อมูลโดยวิชมายวิช" : "Provided by WithMyWish"
          }
          className="mt-5"
        />
        <Box className="container" sx={{ flexGrow: 1 }}>
          <Grid container spacing={5}>
            <Grid item lg={3} md={6} xs={12} className="text-center">
              <Box
                onClick={() =>
                  window.open(
                    "https://withmywish.com/ge-2025/#candidate",
                    "_blank"
                  )
                }
                className="p-3"
                sx={{
                  borderRadius: 5,
                  background:
                    "linear-gradient(180deg, rgba(203,150,194,1) 0%, rgba(73,197,168,1) 100%)",
                }}
              >
                <p>General Election Candidated Members</p>
                <h1>
                  <CountUp end={48} onEnd={() => {}} duration={4} />
                </h1>
              </Box>
            </Grid>
            <Grid item lg={3} md={6} xs={12} className="text-center">
              <Box
                onClick={() =>
                  window.open(
                    "https://withmywish.com/ge-2025/#candidate",
                    "_blank"
                  )
                }
                className="p-3"
                sx={{
                  borderRadius: 5,
                  backgroundColor: "#cb96c2",
                }}
              >
                <p>BNK48 Candidated Members</p>
                <h1>
                  <CountUp end={30} onEnd={() => {}} duration={4} />
                </h1>
              </Box>
            </Grid>
            <Grid item lg={3} md={6} xs={12} className="text-center">
              <Box
                onClick={() =>
                  window.open(
                    "https://withmywish.com/ge-2025/#candidate",
                    "_blank"
                  )
                }
                className="p-3"
                sx={{
                  borderRadius: 5,
                  backgroundColor: "#49c5a8",
                }}
              >
                <p>CGM48 Candidated Members</p>
                <h1>
                  <CountUp end={18} onEnd={() => {}} duration={4} />
                </h1>
              </Box>
            </Grid>
            <Grid item lg={3} md={6} xs={12} className="text-center">
              <Box
                onClick={() =>
                  window.open("//withmywish.com/ge-2025/#candidate", "_blank")
                }
                className="p-3"
                sx={{
                  borderRadius: 5,
                  backgroundColor: "#404040",
                  color: "#fff",
                }}
              >
                <p>Song Selected by Candidated members</p>
                <h1>
                  <CountUp end={70} onEnd={() => {}} duration={4} />
                </h1>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box className="mt-5">
          <CardHeader title="Begining of War" />
          <div className="container" data-aos="fade-right">
            <Card>
              <CardMedia
                sx={{
                  height: "50vh",
                  width: "100%",
                  display: { xs: "block", md: "none" },
                }}
                image="https://pbs.twimg.com/media/Ge0Am9Vb0AE5pVe?format=jpg&name=large"
                title="kfge5begin"
              />
              <CardMedia
                sx={{
                  width: "100%",
                  height: { md: "70vh", xs: "50vh" },
                  position: "initial",
                  display: { xs: "none", md: "block" },
                  left: 0,
                }}
                component="iframe"
                src={"https://youtube.com/embed/FbUgKp7DYWE"}
                alt="kfgepromote"
              />
              <CardContent>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {lang == "th"
                    ? "ข้าวฟ่าง–ญาณิศา เมืองคำ (BNK48 Team NV) ได้ลงสมัคร BNK48 & CGM48 Senbatsu General Election 2025 เมื่อวันที่ 15 ธันวาคม 2024 เวลา 00:25 (ตามเวลาประเทศไทย)"
                    : "Kaofrang Yanisa or Kaofrang BNK48 has applied for joining BNK48 & CGM48 Senbatsu General Election 2025 in December 15, 2024 about 0:50 AM. (Based on Asia/Bangkok Timezone)"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  onClick={() =>
                    window.open(
                      "https://www.facebook.com/bnk48official/posts/pfbid0JXgFZzmA6CLm9wx9cucESrgSZYk1qv8Yw1ZsoPe4EmkxuQJyL4FPLv8XfzoLmGqMl",
                      "_blank"
                    )
                  }
                >
                  {lang == "th" ? "ไปยังลิงก์" : "Go to external link"}
                </Button>
                <Button
                  sx={{ display: { xs: "block", md: "none" } }}
                  onClick={() =>
                    window.open(
                      "https://youtube.com/watch?v=FbUgKp7DYWE",
                      "_blank"
                    )
                  }
                >
                  {lang == "th" ? "ดูคลิปโปรโมท" : "Watch Promote Clip"}
                </Button>
              </CardActions>
            </Card>
          </div>
        </Box>

        <Box className="mt-5">
          <CardHeader
            title="The Songs List of Single (BNK48 19th Single)"
            subheader={
              lang == "th"
                ? "เพลงที่ข้าวฟ่างเลือกเป็นเซ็นเตอร์"
                : "Song list for Center position of Kaofrang"
            }
          />
          <div className="container">
            <Card data-aos="fade-right">
              <CardMedia
                sx={{ height: "50vh", width: "100%" }}
                src="https://youtube.com/embed/CGXwRIcnrJo"
                component="iframe"
              />
              <CardContent>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {lang == "th"
                    ? "เพลงหลัก (อันดับที่ 1) - Saikou ka yo | HKT48"
                    : "Main song (1st Position) - Saikou ka yo | HKT48"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() =>
                    window.open(
                      "https://youtube.com/watch?v=CGXwRIcnrJo",
                      "_blank"
                    )
                  }
                >
                  {lang == "th"
                    ? "รับชมมิวสิควีดีโอต้นฉบับ"
                    : "Watching original Music Video"}
                </Button>
                <Button
                  onClick={() =>
                    window.open(
                      "https://open.spotify.com/track/6wgJfy5bVOhEiKz08YaV64",
                      "_blank"
                    )
                  }
                >
                  {lang == "th" ? "รับฟังบน Spotify" : "Listen it on Spotify!"}
                </Button>
              </CardActions>
            </Card>
            <Card className="mt-3" data-aos="fade-right">
              <CardMedia
                sx={{ height: "50vh", width: "100%" }}
                src="https://youtube.com/embed/0pKfxbCHLoU"
                component="iframe"
              />
              <CardContent>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {lang == "th"
                    ? "เพลงรอง (อันดับที่ 13) - Sustainable | AKB48"
                    : "Couple song (13th Position) - Sustainable | AKB48"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() =>
                    window.open(
                      "https://youtube.com/watch?v=0pKfxbCHLoU",
                      "_blank"
                    )
                  }
                >
                  {lang == "th"
                    ? "รับชมมิวสิควีดีโอต้นฉบับ"
                    : "Watching original Music Video"}
                </Button>
                <Button
                  onClick={() =>
                    window.open(
                      "https://open.spotify.com/track/1Paki9ZUoGAJCDfykNrHV8",
                      "_blank"
                    )
                  }
                >
                  {lang == "th" ? "รับฟังบน Spotify" : "Listen it on Spotify!"}
                </Button>
              </CardActions>
            </Card>
            <Card className="mt-3" data-aos="fade-right">
              <CardMedia
                sx={{ height: "50vh", width: "100%" }}
                src="https://youtube.com/embed/tBFJFAP3GKU"
                component="iframe"
              />
              <CardContent>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {lang == "th"
                    ? "เพลงรอง (อันดับที่ 25) - Idol Nanka Janakattara | AKB48"
                    : "Couple song (25th Position) - Idol Nanka Janakattara | AKB48"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() =>
                    window.open(
                      "https://youtube.com/watch?v=tBFJFAP3GKU",
                      "_blank"
                    )
                  }
                >
                  {lang == "th"
                    ? "รับชมมิวสิควีดีโอต้นฉบับ"
                    : "Watching original Music Video"}
                </Button>
                <Button
                  onClick={() =>
                    window.open(
                      "https://open.spotify.com/track/0svM1S2Msb3aIfpf2Cf0YT",
                      "_blank"
                    )
                  }
                >
                  {lang == "th" ? "รับฟังบน Spotify" : "Listen it on Spotify!"}
                </Button>
              </CardActions>
            </Card>
          </div>
        </Box>

        <Box className="mt-5">
          <CardHeader title="Special Project for Kami 7" />
          <div className="container" data-aos="fade-right">
            <Card>
              <CardMedia
                sx={{ height: "100vh", width: "100%" }}
                image="https://i.scdn.co/image/ab6761610000e5ebcf6dc7909f08fd4c42c59a24"
                title="fhero"
              />
              <CardContent>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {lang == "th"
                    ? "7 เมมเบอร์ที่ได้รับคะแนนโหวตสูงที่สุด จะมีโอกาสได้ทำโปรเจคพิเศษร่วมกับ F.HERO (กอล์ฟ ฟักกลิ้งฮีโร่ หรือณัฐวุฒิ ศรีหมอก)"
                    : "The 7 members that received the highest votes will have the opportunity to do a special project with F.HERO (Nattawut Srimhok)"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() =>
                    window.open("https://youtu.be/1cVvscOjruc", "_blank")
                  }
                >
                  {lang == "th" ? "ไปยังลิงก์" : "Go to external link"}
                </Button>
              </CardActions>
            </Card>
          </div>
        </Box>

        <Box className="mt-5">
          <CardHeader title="More update from BNK48 Official" />
          <div className="d-flex justify-content-center">
            <div>
              {pp.map((it) => (
                <div key={it} data-aos="fade-right">
                  <Tweet id={it} />
                </div>
              ))}
            </div>
          </div>
        </Box>

        <div
          className="col-12 text-center w-100"
          ref={cardsuccess}
          style={{
            backgroundColor: print ? "#fff" : "",
            display: print ? "block" : "none",
          }}
        >
          <div className="col-12 d-flex justify-content-center">
            {print == false ? (
              <QRCode
                value={qrCode}
                logoImage="https://d3hhrps04devi8.cloudfront.net/kf/thqr.webp"
                logoWidth={100}
                logoHeight={100}
                size={300}
                style={{ width: 250, height: 250 }}
                qrStyle="dots"
                crossorigin="anonymous"
              />
            ) : (
              <CardMedia
                sx={{ width: 250, height: 250 }}
                src={
                  "https://quickchart.io/qr?size=300&text=" +
                  qrCode +
                  "&centerImageUrl=https://d3hhrps04devi8.cloudfront.net/kf/thqr.webp"
                }
                component="img"
              />
            )}
          </div>
          {num > 0 && print && (
            <Typography
              className="col-12 mt-3"
              dangerouslySetInnerHTML={{
                __html:
                  lang == "th"
                    ? "ยอดที่โอน " + comma(num) + " บาท"
                    : "Amount " +
                      comma(num) +
                      (setexc == "-"
                        ? " THB<br />Please check your exchange rate on your local mobile banking after scan this QR Code."
                        : " THB<br />(Based on estimated " +
                          comma((num * exc[setexc]).toFixed(2)) +
                          " " +
                          setexc.toUpperCase()) +
                      ")",
              }}
            ></Typography>
          )}
          {print && (
            <>
              <Typography className="col-12 mt-3">
                Biller ID: 004999199434118
                <br />
                {lang == "th"
                  ? "ชื่อบัญชี: นายสุชาติ ลินสวัสดิ์"
                  : "Account Name: Mr.Suchart Sinsawad"}
              </Typography>
              <Typography className="col-12 mt-3">
                {lang != "th" &&
                  "Please make sure that your local mobile banking is support to transfer to international bank via Thai QR payment. You maybe have some fee for transfer abroad. However, this exchange rate maybe different to data from your local mobile banking. Please refer to the exchange rate of the bank you use."}
              </Typography>
            </>
          )}
          {lock && !print && (
            <Typography
              className="col-12 mt-3"
              dangerouslySetInnerHTML={{
                __html:
                  lang == "th"
                    ? "ยอดที่โอน " + comma(num) + " บาท"
                    : "Amount " +
                      comma(num) +
                      " THB<br />Please view exchange rate below.",
              }}
            ></Typography>
          )}
        </div>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={load}
        >
          <CircularProgress />
        </Backdrop>
      </Box>
    </Fade>
  );
};

const mapStateToProps = (state) => ({
  load: state.load,
  dark: state.dark,
  lang: state.lang,
  launch: state.launch,
  country: state.country,
  guide: state.guide,
  currentPage: state.currentPage,
});
const mapDispatchToProps = (dispatch) => ({
  setLoad: (val) => dispatch(setLoad(val)),
  setDark: (val) => dispatch(setDarkMode(val)),
  setLang: (val) => dispatch(setLang(val)),
  setLaunch: (val) => dispatch(setLaunch(val)),
  setPage: (val) => dispatch(setPage(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Ge);
