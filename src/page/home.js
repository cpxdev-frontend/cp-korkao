import React from "react";
import {
  Card,
  CardContent,
  Fade,
  CardHeader,
  Button,
  Zoom,
} from "@mui/material";
import moment from "moment";
import momentTz from "moment-timezone";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { setLoad, setLang, setDarkMode, setPage } from "../redux/action";

import Joyride from "react-joyride";
import stepEn from "../stepGuide/en/home";
import stepTh from "../stepGuide/th/home";

const Home = ({
  currentPage,
  quickmode,
  lang,
  timeready,
  setPage,
  setMenu,
  setLangMod,
  launch,
  guide,
}) => {
  const history = useHistory();
  const [data, setData] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const [isDark, setIsDark] = React.useState(true);
  const [isDarkImg, setIsDarkImg] = React.useState(true);
  const pcTheme =
    "https://pbs.twimg.com/media/G0z0GUnboAA-SPV?format=jpg&name=large";
  const mobileTheme =
    "https://pbs.twimg.com/media/G1DH_VsaQAAHGJq?format=jpg&name=large";

  React.useEffect(() => {
    const img = new Image();
    img.src = mobileTheme;
    img.crossOrigin = "Anonymous"; // สำคัญสำหรับการดึงข้อมูลรูป (ถ้าโดเมนต่างกัน)
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let colorSum = 0;
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        // คำนวณค่าเฉลี่ยของ R, G, B
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const avg = (r + g + b) / 3;
        colorSum += avg;
      }

      const brightness = colorSum / (img.width * img.height);
      setIsDarkImg(brightness > 128);
    };
  }, [mobileTheme]);

  React.useState(() => {
    setTimeout(() => {
      setOpen(true);
    }, 50);
    setPage(lang == "th" ? "หน้าหลัก" : "Homepage");
  }, [currentPage]);

  React.useEffect(() => {
    if (launch != null && timeready != null) {
      if (
        launch >= timeready ||
        (localStorage.getItem("1967fe1d511c1de55dc3379b515df6f2") != null &&
          localStorage.getItem("1967fe1d511c1de55dc3379b515df6f2") ==
            "56f006fb7a76776e1e08eac264bd491aa1a066a1")
      ) {
        setData(true);
      } else {
        setData(false);
      }
    } else {
      setData(false);
    }
  }, [launch, timeready]);

  return (
    <Fade in={open} timeout={300}>
      <div>
        <Fade in={open} timeout={1200}>
          <div className="video-container">
            <div
              className="d-none d-md-block img"
              style={{
                filter: "brightness(80%)",
                backgroundImage: "url(" + pcTheme + ")",
              }}
            ></div>
            <div
              className="d-block d-md-none img"
              style={{
                filter: "brightness(80%)",
                backgroundImage: "url(" + mobileTheme + ")",
              }}
            ></div>
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
        </Fade>
        <Card className="text-container">
          <CardContent className="p-2">
            <CardHeader
              className="d-block d-lg-none"
              title={
                <h3
                  style={{
                    color: "#fb61ee",
                    textShadow: "2px 2px 2px #fae6f9",
                  }}
                >
                  Welcome to Kaofrang Space
                </h3>
              }
              subheader={
                <p style={{ color: isDarkImg ? "white" : "black" }}>
                  {lang == "th"
                    ? 'เว็บไซต์ที่จะทำให้คุณรู้จัก "น้องข้าวฟ่าง" มากขึ้น มาร่วมโดนตก (หลุมรัก) ข้าวฟ่างไปด้วยกัน'
                    : "This is your space for Kaofrang Yanisa or Kaofrang BNK48 fans. Come to enjoy with us!"}
                </p>
              }
            />
            <CardHeader
              className="d-none d-lg-block"
              title={
                <h3
                  style={{
                    color: "#fb61ee",
                    textShadow: "2px 2px 2px #fae6f9",
                  }}
                >
                  Welcome to Kaofrang Space
                </h3>
              }
              subheader={
                <p style={{ color: isDark ? "white" : "black" }}>
                  {lang == "th"
                    ? 'เว็บไซต์ที่จะทำให้คุณรู้จัก "น้องข้าวฟ่าง" มากขึ้น มาร่วมโดนตก (หลุมรัก) ข้าวฟ่างไปด้วยกัน'
                    : "This is your space for Kaofrang Yanisa or Kaofrang BNK48 fans. Come to enjoy with us!"}
                </p>
              }
            />
            <Button
              className="ml-2"
              data-tour="home-1"
              variant="contained"
              onClick={() => history.push("/aboutkf")}
            >
              Get Started
            </Button>
            <Button
              className="ml-2"
              data-tour="home-2"
              variant="outlined"
              onClick={() => setMenu(true)}
            >
              Go to Menu
            </Button>
            <br />
            <Button
              className="ml-2 mt-3"
              data-tour="home-3"
              onClick={() => setLangMod(true)}
            >
              Choose Language
            </Button>
          </CardContent>
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
        </Card>
      </div>
    </Fade>
  );
};

const mapStateToProps = (state) => ({
  load: state.load,
  dark: state.dark,
  lang: state.lang,
  launch: state.launch,
  guide: state.guide,
  currentPage: state.currentPage,
});
const mapDispatchToProps = (dispatch) => ({
  setLoad: (val) => dispatch(setLoad(val)),
  setDark: (val) => dispatch(setDarkMode(val)),
  setLang: (val) => dispatch(setLang(val)),
  setPage: (val) => dispatch(setPage(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Home);
