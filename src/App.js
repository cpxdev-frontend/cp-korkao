import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as TooltipM,
  Legend,
} from "chart.js";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Fade,
  Card,
  Container,
  Divider,
  Avatar,
  Button,
  MenuItem,
  Slide,
  Tooltip,
  TextField,
  LinearProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Drawer,
  Switch,
  Skeleton,
  ToggleButtonGroup,
  CardActions,
  CardContent,
  Menu,
  ToggleButton,
  Backdrop,
  CircularProgress,
  Grow,
  CardMedia,
  Badge,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CakeIcon from "@mui/icons-material/Cake";
import GoogleIcon from "@mui/icons-material/Google";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import Confetti from "react-confetti";
import MenuIcon from "@mui/icons-material/Menu";
import AOS from "aos";
import {
  Route,
  Link,
  Switch as BasicSwitch,
  useHistory,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { connect } from "react-redux";
import {
  setLoad,
  setLang,
  setDarkMode,
  setPage,
  setLaunch,
  setZone,
  setLogin,
  switchTutor,
} from "./redux/action";
import "moment/locale/th"; // without this line it didn't work
import "mapbox-gl/dist/mapbox-gl.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import moment from "moment";
import { detectIncognito } from "detectincognitojs";
import ReactGA from "react-ga4";
import "sweetalert2/dist/sweetalert2.min.css";
import Swal from "sweetalert2";

import Home from "./page/home";
import About from "./page/about";
import Disco from "./page/port";
import Game from "./page/game";
import PopFrangGame from "./page/popfranggame";
import GameD from "./page/gamedash";
import Donate from "./page/donate";
import Follow from "./page/follow";
import Err from "./page/error";

import {
  GoogleAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  signOut,
  OAuthProvider,
  deleteUser,
  getAuth,
  getIdToken,
} from "firebase/auth";
import auth from "./fbindex";

ChartJS.register(ArcElement, TooltipM, Legend);

const DrawerBg = "rgba(220, 209, 215, 0.75)";

let livestat = false;

const pageSec = ["", "aboutkf", "discography", "_game", "follow", "donation"];
const pagesEn = [
  "Home",
  "About Kaofrang",
  "Discography",
  "Games",
  "Follow",
  "Donate",
];
const pagesTh = [
  "หน้าหลัก",
  "เกี่ยวกับข้าวฟ่าง",
  "ผลงาน",
  "มินิเกมส์",
  "ช่องทางการติดตาม",
  "โดเนท",
];

const langList = [
  {
    value: "th",
    label: "ไทย",
  },
  {
    value: "en",
    label: "ENG",
  },
];
let scrollmot = false;

function isInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

let adm = 0;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />;
});

const isSupported = () =>
  "Notification" in window &&
  "serviceWorker" in navigator &&
  "PushManager" in window;

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: livestat ? "red" : "transparent",
    color: livestat ? "red" : "transparent",
    marginTop: -5,
    marginRight: -5,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

function App({
  currentPage,
  lang,
  setLang,
  setLaunch,
  setZone,
  launch,
  game,
  guide,
  login,
  setLogin,
  switchTutor,
}) {
  const [betabypass, setBetaMode] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [transit, setTran] = React.useState(false);
  const [mainten, setOnMaintain] = React.useState(false);

  const [news, setNews] = React.useState(null);
  const [newse, setNewse] = React.useState(false);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [tab, setTab] = React.useState("");
  const [birthdayEff, setBirthdayEff] = React.useState(false);
  const [launchredis, setLaunchd] = React.useState(launch);
  const [noti, setNoti] = React.useState(0);
  const [locklang, setLockLang] = React.useState(false);
  const [incong, setIncong] = React.useState(false);
  const [load, setLoad] = React.useState(false);
  const [loadPre, setLoadPre] = React.useState(false);
  const [loadads, setLoadads] = React.useState(false);
  const [lockads, setLockads] = React.useState(true);
  const [justLogin, setLoginsess] = React.useState(false);

  const location = useLocation();
  const [loginDialog, setloginDialog] = React.useState(false);
  const [opacity, setOpacity] = React.useState(1); // เริ่มต้น opacity เต็ม
  const scrollRef = React.useRef(null); // เก็บ reference ของ element ที่ scroll
  const history = useHistory();
  const [point, setDonatePoint] = React.useState(false);
  const [drop, setDroptab] = React.useState("");

  const targetTime = 1730448000;

  React.useEffect(() => {
    if (noti == 0 && isSupported()) {
      Notification.requestPermission()
        .then((permission) => {
          if (permission == "denied") {
            setNoti(2);
          } else {
            setNoti(1);
          }
        })
        .catch((error) => {
          setNoti(0);
        });
    }
  }, [noti]);

  // React.useEffect(() => {
  //   setLoad(true);
  //   if (sessionStorage.getItem("auth0") != null && isAuthenticated) {
  //     history.push(sessionStorage.getItem("auth0"));
  //     setLoad(false);
  //     sessionStorage.removeItem("auth0");
  //   } else {
  //     setLoad(false);
  //   }
  // }, [isAuthenticated, isLoading]);

  const getLogin = (action) => {
    //sessionStorage.setItem("auth0", location.pathname);
    setTimeout(() => {
      //loginWithRedirect();
      let provider = null;
      setloginDialog(false);
      switch (action) {
        case 1:
          provider = new GoogleAuthProvider();
          provider.addScope("email");
          break;
        case 2:
          provider = new OAuthProvider("microsoft.com");
          provider.addScope("email");
          break;
        default:
          return;
      }
      setLoad(true);
      signInWithPopup(auth, provider)
        .then((result) => {
          setLoad(false);
          setLoginsess(true);
          if (action == 1) {
            setLogin(result);
            localStorage.setItem("loged", JSON.stringify(result));
            return;
          }
          fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
            headers: {
              Authorization: `Bearer ${result._tokenResponse.oauthAccessToken}`,
              "Content-Type": "image/jpg",
            },
          })
            .then(async function (response) {
              return await response.blob();
            })
            .then(function (blob) {
              var reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = function () {
                var base64data = reader.result;
                result.user.photoURL = base64data;
                setLogin(result);
                localStorage.setItem("loged", JSON.stringify(result));
              };
            })
            .catch((e) => console.log("error injecting photo"));
        })
        .catch((error) => {
          // Handle error.
          setloginDialog(true);
          setLoad(false);
        });
    }, 500);
  };

  React.useEffect(() => {
    if (isSupported()) {
      Notification.requestPermission()
        .then((permission) => {
          if (permission == "denied") {
            setNoti(2);
          } else {
            setNoti(1);
          }
        })
        .catch((error) => {
          setNoti(0);
        });
    }
    detectIncognito().then((result) => {
      if (result.isPrivate) {
        document.title = "InPrivate is not support | Kaofrang Space";
      }
      setIncong(result.isPrivate);
    });
    console.log(navigator.connection);
  }, []);

  function calculateTimeLeft() {
    const difference = moment.unix(targetTime) - moment.unix(launchredis + adm);
    let duration = moment.duration(difference);
    return {
      months: duration.months(),
      days: duration.days(),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    };
  }

  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft());

  React.useEffect(() => {
    if (moment.unix(targetTime) - moment.unix(launchredis + adm) <= 0) {
      return;
    }
    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      if (moment.unix(targetTime) - moment.unix(launchredis + adm) <= 0) {
        clearInterval(interval);
        window.location.reload();
      } else {
        adm += 1;
        setTimeLeft(calculateTimeLeft());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [launchredis]);

  function debounce(func, wait) {
    let timeout;
    return function () {
      if (window.innerWidth < 800) {
        scrollmot = true;
        setOpacity(0.3); // ตั้งค่า opacity ต่ำเมื่อ scroll

        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(context, args);
        }, wait);
      }
    };
  }

  const setNotiStatus = () => {
    if (lang == "th") {
      return noti == 2
        ? "ถูกปฏิเสธการเข้าถึง"
        : noti == 1
        ? "เปิดใช้งานแล้ว"
        : "ยังไม่ได้เปิดใช้งาน";
    } else {
      return noti == 2 ? "Blocked" : noti == 1 ? "Ready" : "Disabled";
    }
  };

  const fetchtime = () => {
    fetch(
      (Math.floor(Math.random() * 10) + 1 < 4
        ? process.env.REACT_APP_APIE
        : process.env.REACT_APP_APIE_2) + "/kfsite/gettime",
      {}
    )
      .then((response) => response.text())
      .then((result) => {
        setLaunch(parseInt(result));
      })
      .catch((error) => console.log("error", error));
  };

  const handleScroll = () => {
    scrollmot = false;
    setTimeout(() => {
      if (scrollmot == false) {
        setOpacity(1); // แสดงปุ่มปกติหลัง 5 วินาที
      }
    }, 3000);
  };

  React.useEffect(() => {
    ReactGA.initialize("G-HGFSHDZZMC");
    if (
      localStorage.getItem("yuser") !== null &&
      localStorage.getItem("loged") == null
    ) {
      localStorage.removeItem("yuser");
      alert("Login session changed. please login again.");
      window.localStorage.reload();
    }
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    window.addEventListener("scroll", debounce(handleScroll, 200));
    fetch(process.env.REACT_APP_APIE + "/home/status", {})
      .then((response) => response.text())
      .then((result) => {
        setInterval(() => {
          fetchtime();
        }, 10000);
      })
      .catch((error) => {
        document.title = "System Maintenance | Kaofrang Space";
        setOnMaintain(true);
      });
    setTimeout(() => {
      fetch(
        (Math.floor(Math.random() * 10) + 1 < 5
          ? process.env.REACT_APP_APIE
          : process.env.REACT_APP_APIE_2) + "/kfsite/getkfliveinapp",
        { method: "POST" }
      )
        .then((response) => response.text())
        .then((result) => {
          if (result.status == true) {
            livestat = result.isLive;
          }
        })
        .catch((error) => console.log("error", error));
    }, 5000);
    setInterval(() => {
      fetch(
        (Math.floor(Math.random() * 10) + 1 < 5
          ? process.env.REACT_APP_APIE
          : process.env.REACT_APP_APIE_2) + "/kfsite/getkfliveinapp",
        { method: "POST" }
      )
        .then((response) => response.text())
        .then((result) => {
          if (result.status == true) {
            livestat = result.isLive;
          }
        })
        .catch((error) => console.log("error", error));
    }, 60000);
  }, []);

  React.useEffect(() => {
    if (location.pathname == window.location.pathname) {
      setTran(true);
    } else {
      setTran(false);
    }
    setTimeout(() => {
      setTran(true);
    }, 50);
  }, [location]);

  const BirthdayEffect = () => {
    setBirthdayEff(true);
    setTimeout(() => {
      setBirthdayEff(false);
    }, 5000);
    setInterval(
      () => {
        setBirthdayEff(true);
        setTimeout(() => {
          setBirthdayEff(false);
        }, 5000);
      },
      location.pathname !== "/birthday" ? 60000 : 180000
    );
  };

  const [unlock, setUnlock] = React.useState(null);

  React.useEffect(() => {
    AOS.init({ duration: 800, once: true });
    setLaunch(moment().unix());
    setLaunchd(moment().unix());
    fetch(process.env.REACT_APP_APIE_2 + "/kfsite/birthdayStatus", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.response) {
          BirthdayEffect();
          setDonatePoint(true);
        }
      })
      .catch((error) => console.log("error", error));
    setUnlock(true);
  }, []);

  React.useEffect(() => {
    if (
      sessionStorage.getItem("ads") == null &&
      loadads == false &&
      login !== false
    ) {
      var requestOptions = {
        method: "POST",
      };
      setLoadads(true);
      fetch(process.env.REACT_APP_APIE_2 + "/kfsite/getevent", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setLoadads(false);
          if (result.length > 0) {
            if (login !== null && localStorage.getItem("loged") !== null) {
              setTimeout(() => {
                setLockads(false);
              }, 1100);
            } else {
              setTimeout(() => {
                setLockads(false);
              }, 4000);
            }
            sessionStorage.setItem("ads", true);
            setNewse(true);
            setNews(result[0]);
          }
        })
        .catch((error) => console.log("error", error));
    }
  }, [login]);

  const [pages, setPage] = React.useState(lang == "th" ? pagesTh : pagesEn);
  const [appbarx, setApp] = React.useState(false);

  React.useEffect(() => {
    if (currentPage.includes("404 Not Found")) {
      setApp(false);
    } else {
      setApp(location.pathname != "/" && unlock && !game ? true : false);
    }
  }, [currentPage, location.pathname, unlock, game]);

  React.useEffect(() => {
    if (localStorage.getItem("kflang") == null) {
      localStorage.setItem("kflang", "th");
    } else {
      setPage(lang == "th" ? pagesTh : pagesEn);
      localStorage.setItem("kflang", lang);
    }
    setLockLang(true);
    setTimeout(() => {
      setLockLang(false);
    }, 2000);
  }, [lang]);

  React.useEffect(() => {
    fetch("https://speed.cloudflare.com/meta")
      .then((response) => response.json())
      .then((data) => setZone(data.country));
  }, []);

  React.useEffect(() => {
    document.title = currentPage + " | Kaofrang Space";
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleOpenNavMenu = (event) => {
    setOpacity(1);
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (e = null, session = null) => {
    // if (localStorage.getItem("yuser") == null) {
    //   return;
    // }
    if (e != null) {
      setAnchorEl(e.currentTarget);
    }
    setAnchorElNav(null);
  };
  const handleClose = (m = null) => {
    setAnchorEl(null);
    setTab("");
    if (m == null) {
      setAnchorElNav(null);
    }
  };

  React.useEffect(() => {
    if (location.pathname == undefined) {
      return;
    }
    if (tab != "") {
      setDroptab(tab.split("_")[1]);
    }
    if (
      !location.pathname.includes("game") &&
      !location.pathname.includes("gallery") &&
      drop != ""
    ) {
      setDroptab("");
      setAnchorEl(null);
      setTab("");
    }
  }, [tab]);
  React.useEffect(() => {
    if (location.pathname == undefined) {
      return;
    }
    if (location.pathname.includes("game") && drop == "") {
      setDroptab("game");
    }
    if (location.pathname.includes("gallery") && drop == "") {
      setDroptab("gallery");
    }
  }, []);

  if (isInIframe()) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
        className="text-center"
      >
        {lang == "th"
          ? "เว็บไซต์นี้ไม่รองรับการแสดงแบบฝังบนเว็บไซต์อื่น"
          : "This site is not support on iframe tag"}
      </Backdrop>
    );
  }

  if (mainten) {
    return (
      <div
        className="d-flex justify-content-center align-items-center text-center row"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="col-12">
          <img
            src="https://niceillustrations.com/wp-content/uploads/2021/07/Connection-Lost-color-800px.png"
            width={300}
          />
        </div>
        <div className="col-12">
          <h5>
            {lang == "th"
              ? "อยู่ระหว่างการปรับปรุงระบบ ขออภัยในความไม่สะดวก"
              : "Our Web Server is under maintenance. Sorry for inconvenience."}
          </h5>
        </div>
      </div>
    );
  }

  if (incong) {
    return (
      <div
        className="d-flex justify-content-center align-items-center text-center row"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="col-12">
          <img
            src="https://niceillustrations.com/wp-content/uploads/2022/03/Police.png"
            width={300}
          />
        </div>
        <div className="col-12">
          <h5>Please move out from Incognito Browser (InPrivate Browser)</h5>
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollRef}>
      {/* --- ส่วนเอฟเฟกต์และแจ้งเตือน (คงเดิม) --- */}
      <Confetti
        numberOfPieces={birthdayEff ? 400 : 0}
        initialVelocityY={2500}
        style={{ position: "fixed" }}
      />

      <div
        id="blockwhenland"
        className="d-flex justify-content-center align-items-center text-center"
      >
        <h5>
          <img
            src="https://cdn-icons-png.flaticon.com/512/6737/6737502.png"
            width={150}
            alt="rotate"
          />
          <br />
          {lang == "th"
            ? "เว็บไซต์ไม่รองรับขนาดหน้าจอนี้ กรุณาหมุนจอเป็นแนวตั้งหรือทางทิศที่เหมาะสม"
            : "This screen size is not support on this device. Please rotate your device screen."}
        </h5>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 1200, marginTop: 10 }}
        open={point}
      >
        <Alert
          onClick={() => setDonatePoint(false)}
          icon={<CakeIcon />}
          severity="primary"
          variant="filled"
          sx={{ width: "100%", color: "#fff", cursor: "pointer" }}
        >
          {lang == "th"
            ? "ร่วมอวยพรวันเกิดข้าวฟ่างในวัย " +
              (new Date().getFullYear() - 2002) +
              " ปีไปด้วยกัน"
            : "Happy Birthday to Kaofrang Yanisa in today."}
        </Alert>
      </Snackbar>

      {/* --- UNIFIED APPBAR (ส่วนหัวเว็บ รวมร่าง Mobile + PC) --- */}
      <Slide direction="down" in={appbarx}>
        <AppBar
          position="fixed"
          className={
            window.innerWidth < 900 ? "newmobileAppbar" : "newpcAppbar"
          }
          sx={{
            display:
              unlock &&
              location.pathname != "/" &&
              !game &&
              !currentPage.includes("404 Not Found")
                ? "block"
                : "none",
          }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                <Typography
                  variant="h6"
                  noWrap
                  className="webheadfont"
                  component="a"
                  href="/"
                  sx={{
                    mr: 2,
                    display: "flex",
                    color: "inherit",
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontSize: { xs: "1.2rem", md: "1.25rem" },
                  }}
                >
                  Kaofrang Space
                </Typography>
              </Box>

              {/* 2. PC Menu Links (ซ่อนบน Mobile) */}
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {pages.map((page, i) => (
                  <Button
                    key={page}
                    component={pageSec[i].includes("_") ? null : Link}
                    to={pageSec[i].includes("_") ? null : "/" + pageSec[i]}
                    onClick={(e) => {
                      if (pageSec[i].includes("_")) setTab("pc" + pageSec[i]);
                      handleCloseNavMenu(
                        e,
                        pageSec[i].includes("_") ? "ok" : null
                      );
                    }}
                    sx={{
                      my: 2,
                      color:
                        (location.pathname.includes("game") &&
                          pageSec[i] == "_game" &&
                          drop == "game") ||
                        location.pathname == "/" + pageSec[i]
                          ? "#b802a8" // Active color (ปรับให้เหมือน Mobile เดิม หรือใช้ #fff ตาม PC เดิม)
                          : "#fff", // PC เดิมใช้สีขาว
                      display: "block",
                      fontSize: lang == "th" ? 14 : 12,
                    }}
                  >
                    {page}
                  </Button>
                ))}

                {/* Dropdown Menu สำหรับ Game (PC) */}
                <Menu
                  id="basic-menu-pc"
                  anchorEl={anchorEl}
                  open={tab == "pc_game"}
                  onClose={handleClose}
                  MenuListProps={{ "aria-labelledby": "basic-button" }}
                >
                  <MenuItem
                    onClick={handleClose}
                    component={Link}
                    to="/quizgame"
                  >
                    {lang == "th" ? "กอข้าวควิชเกมส์" : "Quiz Game"}
                  </MenuItem>
                  <MenuItem
                    onClick={handleClose}
                    component={Link}
                    to="/popfranggame"
                  >
                    {lang == "th" ? "ป็อปฟ่าง" : "PopFrang"}
                  </MenuItem>
                </Menu>
              </Box>

              {/* 3. Right Side Icons (User / Hamburger) */}
              <Box
                sx={{
                  flexGrow: 0,
                  display: "flex",
                  alignItems: "center",
                  ml: "auto",
                }}
              >
                {/* PC User Setting Icon */}
                <Box sx={{ display: { xs: "none", md: "flex" } }}>
                  <Tooltip title="Open settings">
                    <IconButton
                      onClick={() => setAnchorElUser(true)}
                      sx={{ p: 0 }}
                    >
                      <Avatar
                        sx={{ width: 30, height: 30 }}
                        variant="rounded"
                        alt="lang"
                        src={
                          "https://pub-8132af7faa6a48298af6aaa68af91b48.r2.dev/" +
                          (lang == "th" ? "th.png" : "us.png")
                        }
                      />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Mobile Hamburger Icon */}
                <Box sx={{ display: { xs: "flex", md: "none" } }}>
                  {/* User Icon เล็กๆ ข้าง Hamburger (ถ้าต้องการ) */}
                  <IconButton
                    onClick={() => setAnchorElUser(true)}
                    sx={{ display: { xs: "none", sm: "flex" }, mr: 1 }}
                  >
                    {" "}
                    {/* ปรับ xs เป็น flex ถ้าอยากให้โชว์ User Icon บนมือถือด้วย */}
                    <Avatar
                      sx={{ width: 25, height: 25 }}
                      variant="rounded"
                      src={
                        "https://pub-8132af7faa6a48298af6aaa68af91b48.r2.dev/" +
                        (lang == "th" ? "th.png" : "us.png")
                      }
                    />
                  </IconButton>
                  <IconButton
                    size="large"
                    aria-label="menu"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Slide>

      {/* --- DRAWER (เมนูข้างสำหรับ Mobile) --- */}
      <Drawer
        anchor="right"
        PaperProps={{
          sx: {
            backdropFilter: "blur(5px)",
            background: DrawerBg,
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
          },
        }}
        open={anchorElNav}
        onClose={handleCloseNavMenu}
      >
        {" "}
        {/* สำรองไว้กันโผล่ใน PC */}
        <DialogTitle>
          {lang == "th" ? "เมนูหลักและการตั้งค่า" : "Main Menu and Settings"}
        </DialogTitle>
        <DialogContent
          sx={{
            width: {
              xs: login !== null && login !== false ? "75vw" : "100%",
              sm: 340,
            },
          }}
        >
          {pages.map((page, i) => (
            <MenuItem
              key={page}
              component={pageSec[i].includes("_") ? null : Link}
              to={pageSec[i].includes("_") ? null : "/" + pageSec[i]}
              onClick={(e) => {
                if (pageSec[i].includes("_")) setTab("mob" + pageSec[i]);
                handleCloseNavMenu(e, pageSec[i].includes("_") ? "ok" : null);
              }}
            >
              <Typography
                textAlign="center"
                className={
                  (location.pathname.includes("game") &&
                    pageSec[i] == "_game" &&
                    drop == "game") ||
                  location.pathname == "/" + pageSec[i]
                    ? "text-bold"
                    : ""
                }
                sx={{
                  color:
                    (location.pathname.includes("game") &&
                      pageSec[i] == "_game" &&
                      drop == "game") ||
                    location.pathname == "/" + pageSec[i]
                      ? "#b802a8"
                      : "#000",
                }}
              >
                {page}
              </Typography>
            </MenuItem>
          ))}

          {/* Dropdown Menu สำหรับ Game (Mobile Drawer) */}
          <Menu
            id="basic-menu-mob"
            anchorEl={anchorEl}
            open={tab == "mob_game"}
            onClose={() => handleClose("ok")}
            MenuListProps={{ "aria-labelledby": "basic-button" }}
          >
            <MenuItem
              onClick={() => handleClose()}
              component={Link}
              to="/quizgame"
            >
              {lang == "th" ? "กอข้าวควิชเกมส์" : "Quiz Game"}
            </MenuItem>
            <MenuItem
              onClick={() => handleClose()}
              component={Link}
              to="/popfranggame"
            >
              {lang == "th" ? "ป็อปฟ่าง" : "PopFrang"}
            </MenuItem>
          </Menu>

          <Divider sx={{ my: 2 }} />

          {/* User Profile Card (Mobile Drawer) */}
          {!load ? (
            <Card className="mb-3">
              {login !== null && login !== false && (
                <CardContent>
                  <Typography>
                    {lang == "th" ? "ยินดีต้อนรับคุณ " : "Welcome back, "}
                    {JSON.parse(localStorage.getItem("loged")).user.displayName}
                  </Typography>
                </CardContent>
              )}
            </Card>
          ) : (
            <Skeleton
              variant="rounded"
              className="bg-m mb-3"
              sx={{ height: 80, width: "100%" }}
            />
          )}

          {/* Language & Guide Settings (Mobile Drawer) */}
          <Box>
            <Typography>Change Language</Typography>
            <ToggleButtonGroup
              color="primary"
              className="mt-1 muiLang"
              value={lang}
              disabled={locklang}
              exclusive
              onChange={(e) =>
                e.target.value != lang && setLang(e.target.value)
              }
            >
              {langList.map((option) => (
                <ToggleButton
                  sx={{ borderRadius: 1 }}
                  value={option.value}
                  key={option.value}
                >
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <br />
            <FormControlLabel
              control={
                <Switch checked={guide} onChange={() => switchTutor()} />
              }
              label={lang == "th" ? "คำอธิบายการใช้งาน" : "Tutorial Guide"}
            />
          </Box>
        </DialogContent>
      </Drawer>

      {/* --- SETTINGS DIALOG (Popup ตั้งค่าสำหรับ PC) --- */}
      <Dialog
        open={anchorElUser}
        TransitionComponent={Transition}
        transitionDuration={400}
        onClose={() => setAnchorElUser(false)}
        maxWidth="xl"
      >
        <DialogTitle>{lang == "th" ? "การตั้งค่า" : "Setting"}</DialogTitle>
        <DialogContent>
          <Typography>Change Language</Typography>
          <ToggleButtonGroup
            color="primary"
            className="mt-1"
            value={lang}
            disabled={locklang}
            exclusive
            onChange={(e) => e.target.value != lang && setLang(e.target.value)}
          >
            {langList.map((option) => (
              <ToggleButton
                sx={{ borderRadius: 1 }}
                value={option.value}
                key={option.value}
              >
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <br />
          <FormControlLabel
            control={<Switch checked={guide} onChange={() => switchTutor()} />}
            label={lang == "th" ? "คำอธิบายการใช้งาน" : "Tutorial Guide"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAnchorElUser(false)}>
            {lang == "th" ? "ปิด" : "Close"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- CONTENT BODY (ส่วนเนื้อหาและ Routing) --- */}
      <Fade in={transit} timeout={!transit ? 0 : 700}>
        <Box
          sx={{
            marginTop: {
              xs:
                unlock &&
                location.pathname != "/" &&
                !currentPage.includes("404 Not Found")
                  ? 10
                  : 0,
              md: location.pathname != "/" ? 12 : 0, // ปรับระยะห่างสำหรับ PC Header
            },
          }}
        >
          <BasicSwitch>
            <Route
              exact
              path="/"
              render={() => (
                <Home
                  data-aos="fade-in"
                  timeready={targetTime}
                  quickmode={betabypass}
                  setMenu={(v) => setAnchorElNav(v)}
                  setLangMod={() => setAnchorElUser(true)}
                />
              )}
            />
            <Route
              data-aos="fade-in"
              path="/aboutkf"
              render={() => <About />}
            />
            <Route
              data-aos="fade-in"
              path="/discography"
              render={() => <Disco />}
            />
            <Route
              data-aos="fade-in"
              path="/quizgame"
              render={() => <Game />}
            />
            <Route
              data-aos="fade-in"
              path="/popfranggame"
              render={() => <PopFrangGame />}
            />
            <Route
              data-aos="fade-in"
              path="/quizgameresult/:c"
              render={() => <GameD />}
            />
            <Route
              data-aos="fade-in"
              path="/follow"
              render={() => <Follow />}
            />
            <Route
              data-aos="fade-in"
              path="/donation"
              render={() => <Donate />}
            />
            <Route
              exact
              data-aos="fade-in"
              render={() => (
                <Err
                  setMenu={(v) => setAnchorElNav(v)}
                  setLangMod={() => setAnchorElUser(true)}
                />
              )}
            />
          </BasicSwitch>
        </Box>
      </Fade>

      {/* --- FOOTER (ส่วนท้าย) --- */}
      <footer className="fixed-bottom bg-secondary text-center">
        <Card
          className="p-2 foot"
          style={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            fontSize: 14,
            lineHeight: 1.2,
          }}
        >
          &copy; Copyright {new Date().getFullYear()}, CPXDevStudio
          <br />
          <small style={{ fontSize: 10 }}>
            All images and media contents displayed on this site are the
            exclusive property of their respective copyright owners. This
            website is created solely for the purpose of supporting Kaofrang
            Yanisa.
          </small>
        </Card>
      </footer>

      {/* --- LOADERS (ส่วนโหลด) --- */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={load}
      >
        <CircularProgress />
      </Backdrop>

      <Fade
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          top: 0,
          position: "fixed",
        }}
        in={loadPre}
      >
        <LinearProgress
          sx={{ height: 100, borderColor: "#b802a8" }}
          className="w-100"
        />
      </Fade>

      <Fade
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          top: 0,
          position: "fixed",
        }}
        in={loadads}
      >
        <LinearProgress
          sx={{ height: 100, borderColor: "#b802a8" }}
          className="w-100"
        />
      </Fade>
    </div>
  );
}

const mapStateToProps = (state) => ({
  load: state.load,
  dark: state.dark,
  lang: state.lang,
  launch: state.launch,
  currentPage: state.currentPage,
  game: state.game,
  login: state.login,
  guide: state.guide,
});
const mapDispatchToProps = (dispatch) => ({
  setLoad: (val) => dispatch(setLoad(val)),
  setDark: (val) => dispatch(setDarkMode(val)),
  setLang: (val) => dispatch(setLang(val)),
  setLaunch: (val) => dispatch(setLaunch(val)),
  setPage: (val) => dispatch(setPage(val)),
  setZone: (val) => dispatch(setZone(val)),
  switchTutor: (val) => dispatch(switchTutor(val)),
  setLogin: (val) => dispatch(setLogin(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
