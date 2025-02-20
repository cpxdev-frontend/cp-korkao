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

  React.useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const analyzeFrame = () => {
      if (video.paused || video.ended) return;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = context.getImageData(0, 0, canvas.width, canvas.height);
      const length = frame.data.length;
      let totalLuminance = 0;
      for (let i = 0; i < length; i += 4) {
        const r = frame.data[i];
        const g = frame.data[i + 1];
        const b = frame.data[i + 2];
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        totalLuminance += luminance;
      }

      const averageLuminance = totalLuminance / (length / 4);
      const luminanceThreshold = 128;
      setIsDark(averageLuminance < luminanceThreshold);

      requestAnimationFrame(analyzeFrame);
    };

    video.addEventListener("play", () => {
      analyzeFrame();
    });

    return () => {
      video.removeEventListener("play", analyzeFrame);
    };
  }, []);

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
              className="d-block d-lg-none img"
              style={{
                filter: "brightness(80%)",
                backgroundImage:
                  "url(https://d3hhrps04devi8.cloudfront.net/kf/kaofrang.webp)",
              }}
            ></div>
            <video
              crossOrigin="anonymous"
              className="d-none d-lg-block vdo overflow-hidden"
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
              muted
              autoPlay
              style={{
                pointerEvents: "none",
                scrollbarWidth: "none",
                top: "50%",
                left: "50%",
                minWidth: "100%",
                minHeight: "100%",
                width: "auto",
                height: "auto",
                transform: "translate(-50%,-50%)",
              }}
              ref={videoRef}
              loop
              playsInline
            >
              <source
                src="https://d3hhrps04devi8.cloudfront.net/kf/vdo.webm"
                type="video/webm"
              />
              Your browser does not support the video tag.
            </video>
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
        </Fade>
        <Card className="text-container">
          <CardContent className="p-2">
            <CardHeader
              title={
                <h3
                  style={{
                    color: "#fb61ee",
                    textShadow: "2px 2px 2px #fae6f9",
                  }}
                >
                  Welcome to KorKao FanSite
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
