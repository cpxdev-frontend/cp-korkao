import React from "react";
import {
  Card,
  CardContent,
  Fade,
  CardHeader,
  Button,
  Box,
  Typography,
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

const ResponsiveHeroSection = ({
  align = "center",
  image,
  title,
  history,
  subtitle,
  setMenu,
}) => {
  // สำหรับ Flexbox ของ Bootstrap 4 ต้องแปลง left/right เป็น start/end
  const flexAlignClass =
    align === "left" ? "start" : align === "right" ? "end" : align;

  // สำหรับ Text Alignment ของ Bootstrap 4 ใช้ left/right/center ได้ตรงๆ เลย
  const textAlignClass =
    align === "start" ? "left" : align === "end" ? "right" : align;

  return (
    <div
      className="container-fluid d-flex align-items-center" // เอา justify-content ออกจากตรงนี้ ให้ row จัดการแทน
      style={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        paddingTop: "60px",
        paddingBottom: "60px",
      }}
    >
      <div className="container">
        {/* Row จะเป็นตัวดึงก้อนคอลัมน์ไปซ้าย (start) หรือขวา (end) */}
        <div
          className={`row justify-content-center justify-content-md-${flexAlignClass}`}
        >
          {/* ปรับขนาดให้เล็กลงในจอใหญ่ เพื่อให้เห็นการชิดซ้าย-ขวาชัดเจนขึ้น */}
          <div className="col-12 col-md-10">
            <Box
              // จัดข้อความให้ชิดตามฝั่งที่ต้องการ
              className={`text-center text-md-${textAlignClass}`}
              sx={{
                animation: "fadeIn 1s ease-in-out",
                px: { xs: 2, md: 0 },
              }}
            >
              <Typography
                data-aos="fade-up"
                data-aos-delay="200"
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  mb: 2,
                  // Responsive Font Size: มือถือเล็กหน่อย จอใหญ่จัดเต็ม
                  fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
                  textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                }}
              >
                {title}
              </Typography>

              <Typography
                data-aos="fade-up"
                data-aos-delay="400"
                variant="body2"
                sx={{
                  color: "#e0e0e0",
                  mb: 4,
                  fontSize: { xs: "1rem", md: "1.6rem" }, // ปรับขนาด sub-title
                }}
              >
                {subtitle}
              </Typography>
              <Box data-aos="fade-up" data-aos-delay="600">
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
              </Box>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    "https://xcdn.cpxdev.workers.dev/G0z0GUnboAA-SPV?format=jpg&name=large";
  const mobileTheme =
    "https://xcdn.cpxdev.workers.dev/G1DH_VsaQAAHGJq?format=jpg&name=large";

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
    <Fade in={true} timeout={800}>
      <div>
        <ResponsiveHeroSection
          align="left"
          image={pcTheme}
          history={history}
          setMenu={setMenu}
          title=" Welcome to Kaofrang Space"
          subtitle={
            lang == "th"
              ? 'เว็บไซต์ที่จะทำให้คุณรู้จัก "น้องข้าวฟ่าง" มากขึ้น มาร่วมโดนตก (หลุมรัก) ข้าวฟ่างไปด้วยกัน'
              : "This is your space for Kaofrang Yanisa fans. Come to enjoy with us!"
          }
        />
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
