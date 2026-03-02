import React from "react";
import {
  Card,
  CardContent,
  Fade,
  CardHeader,
  Button,
  Zoom,
  Box,
  Typography,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { setLoad, setLang, setDarkMode, setPage } from "../redux/action";

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
                  onClick={() => history.push("/")}
                >
                  Go to Home
                </Button>
              </Box>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

const Err = ({
  currentPage,
  lang,
  setLang,
  setPage,
  setMenu,
  setLangMod,
  launch,
}) => {
  const history = useHistory();
  const [data, setData] = React.useState(false);
  React.useEffect(() => {
    setPage("404 Not Found");
    if (
      launch >= 1730448000 ||
      (localStorage.getItem("1967fe1d511c1de55dc3379b515df6f2") != null &&
        localStorage.getItem("1967fe1d511c1de55dc3379b515df6f2") ==
          "56f006fb7a76776e1e08eac264bd491aa1a066a1")
    ) {
      setData(true);
    } else {
      setData(false);
    }
  }, []);

  return (
    <Fade in={true} timeout={800}>
      <div>
        <ResponsiveHeroSection
          align="left"
          image={
            "https://pbs.twimg.com/media/GTqpfrGb0AAcPAG?format=webp&name=4096x4096"
          }
          history={history}
          title="404 NOT FOUND"
          subtitle={
            lang == "th"
              ? "ไม่พบหน้าที่คุณต้องการ"
              : "We are not found your wish. Please try again."
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
  currentPage: state.currentPage,
});
const mapDispatchToProps = (dispatch) => ({
  setLoad: (val) => dispatch(setLoad(val)),
  setDark: (val) => dispatch(setDarkMode(val)),
  setLang: (val) => dispatch(setLang(val)),
  setPage: (val) => dispatch(setPage(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Err);
