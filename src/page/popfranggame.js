import React from "react";
import {
  Card,
  CardContent,
  Fade,
  CardHeader,
  Button,
  Grid,
  CardActions,
  Box,
  Backdrop,
  Tab,
  Typography,
  ListItemButton,
  List,
  ListItem,
  CircularProgress,
  Skeleton,
  Fab,
  LinearProgress,
  DialogContent,
  Avatar,
  Dialog,
  DialogActions,
  Grow,
  DialogTitle,
  ListItemText,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import Swal from "sweetalert2";
import { InfoOutlined } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CancelIcon from "@mui/icons-material/Cancel";
import { connect } from "react-redux";
import {
  setLoad,
  setLang,
  setDarkMode,
  setPage,
  setInGame,
} from "../redux/action";
import { useHistory } from "react-router-dom";
import ReactGA from "react-ga4";
import { useAuth0 } from "@auth0/auth0-react";

import Joyride from "react-joyride";
import stepEn from "../stepGuide/en/quiz";
import stepTh from "../stepGuide/th/quiz";
import moment from "moment";

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />;
});

let timerInterval;
let gamein = false;

function secondsToMinSec(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return { minutes, seconds };
}

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Typography
          sx={{ color: props.labeldata <= 10 ? "red" : "text.primary" }}>
          {`${Math.round(props.labeldata)}`}
        </Typography>
      </Box>
    </Box>
  );
}

const GameApp = ({
  currentPage,
  lang,
  launch,
  currentCountry,
  setPage,
  setInGame,
  login,
  guide,
  game,
}) => {
  const [gamemeet, setGame] = React.useState(0);
  const [correct, setCorrect] = React.useState(0);
  const [timeremain, setTimeRemain] = React.useState(0);
  const [startLoad, setLoad] = React.useState(false);
  const [pop, setPop] = React.useState(-1);
  const [airLoad, setLoadAir] = React.useState(false);
  const [ip, setIP] = React.useState("");
  const [session, setSession] = React.useState("");
  const his = useHistory();
  const {
    loginWithPopup,
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    logout,
  } = useAuth0();

  const [time, setTime] = React.useState(0);

  // state to check stopwatch running or not
  const [isRunning, setIsRunning] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [gamehis, setGameHistory] = React.useState(false);
  const [hisgame, setHis] = React.useState(null);
  React.useState(() => {
    setTimeout(() => {
      setOpen(true);
    }, 50);
  }, [currentPage]);

  React.useEffect(() => {
    let intervalId;
    if (isRunning) {
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
      intervalId = setInterval(() => setTime(time + 1), 9);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  const [aver, setAver] = React.useState(null);

  React.useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (gamein == false) {
        return;
      }
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  React.useEffect(() => {
    gamein = game;
  }, [game]);

  React.useEffect(() => {
    setPage(lang == "th" ? "มินิเกมส์" : "Quiz Game");
    fetch("https://speed.cloudflare.com/meta")
      .then((response) => response.json())
      .then((data) => setIP(data.clientIp));
  }, []);

  React.useEffect(() => {
    if (gamehis == true && login) {
      var requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: login._tokenResponse.email,
          token: login._tokenResponse.idToken,
        }),
      };

      fetch(
        process.env.REACT_APP_APIE + "/kfsite/kfgameHistory",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            setHis(result.resp);
          }
        })
        .catch((error) => console.log("error", error));
    } else {
      setTimeout(() => {
        setHis(null);
      }, 1000);
    }
  }, [gamehis]);

  const StartGame = () => {
    if (ip == "") {
      return;
    }
    setAver(null);
    setGame(0);
    setCorrect(0);
    setTimeRemain(30);
    setTime(0);
    setInGame(true);
    setLoad(true);
    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quizIP: ip,
        quizCountry: currentCountry,
      }),
    };

    fetch(process.env.REACT_APP_APIE_2 + "/kfsite/kffetchpop", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          if (!isIOS()) {
            navigator.vibrate([
              100, 900, 100, 900, 100, 900, 100, 900, 100, 900, 800,
            ]);
          }
          ReactGA.event({
            category: "User",
            action: "Game Ready",
          });
          Swal.fire({
            title: "Game will be started",
            html:
              lang == "th"
                ? "เกมส์กำลังจะเริ่มในอีก <b></b> วินาที"
                : "Please wait in <b></b> seconds.",
            timer: 6000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              const timer = Swal.getPopup().querySelector("b");
              timer.textContent = `5`;
              timerInterval = setInterval(() => {
                timer.textContent = `${Math.floor(Swal.getTimerLeft() / 1000)}`;
              }, 1000);
            },
            allowOutsideClick: () => !Swal.isLoading(),
            willClose: () => {
              clearInterval(timerInterval);
            },
          }).then((r) => {
            /* Read more about handling dismissals below */
            if (r.dismiss === Swal.DismissReason.timer) {
              setSession(result.sessionId);
              ReactGA.event({
                category: "User",
                action: "Game Start",
              });
              setGame(1);
              setLoad(false);
              setIsRunning(false);
            }
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  const [hearts, setHearts] = React.useState([]);

  const SelectGame = (e) => {
    if (timeremain == 0) {
      return;
    }
    const x = e.clientX;
    const y = e.clientY;
    const newHeart = {
      id: Date.now(),
      x,
      y,
    };

    setHearts((prev) => [...prev, newHeart]);

    setTimeout(() => {
      setHearts((prev) => prev.filter((heart) => heart.id !== newHeart.id));
    }, 1000);
    setPop(Math.floor(Math.random() * 4) + 1);
    setCorrect(correct + 1);
  };

  React.useEffect(() => {
    if (hearts.length == 0 && pop > -1) {
      setTimeout(() => {
        setPop(-1);
      }, 300);
    }
  }, [hearts]);

  React.useEffect(() => {
    if (gamemeet == 1) {
      if (timeremain == 5) {
        if (!isIOS()) {
          navigator.vibrate([
            100, 900, 100, 900, 100, 900, 100, 900, 100, 900, 800,
          ]);
        }
      }
      if (timeremain == 0) {
        GameDone();
      } else {
        setTimeout(() => {
          setTimeRemain(timeremain - 1);
        }, 1000);
      }
    }
  }, [gamemeet, timeremain]);

  const GameDone = () => {
    // Game timeout
    ReactGA.event({
      category: "User",
      action: "Game Over",
    });
    setLoadAir(true);
    fetch(process.env.REACT_APP_APIE + "/kfsite/kfkeeppop", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quesText: "",
        quizScore: correct,
        quizFrom: 0,
        quizDuration: Math.floor((time % 6000) / 100),
        sessionId: session,
        token: login._tokenResponse.idToken,
        notiId: localStorage.getItem("osigIdPush")
          ? atob(localStorage.getItem("osigIdPush"))
          : null,
        userId:
          login !== null && login !== false ? login._tokenResponse.email : null,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status == true) {
          ReactGA.event({
            category: "User",
            action: "Result Ready",
          });
          setAver(result);
          setLoadAir(false);
          setGame(2);
          setInGame(false);
        }
      })
      .catch((error) => console.log("error", error));
  };

  if (gamemeet == 0) {
    return (
      <Fade in={open} timeout={300}>
        <div
          data-aos="fade-in"
          className="d-flex justify-content-center"
          style={{ marginBottom: 200 }}>
          <Card
            data-tour="quiz"
            sx={{
              marginTop: { xs: 3, md: "15vh" },
              width: { xs: "90%", md: "70%" },
            }}>
            <CardContent>
              <CardHeader
                title="PopFrang Game"
                subheader={
                  lang == "th"
                    ? "เกมพิสูจน์ความรักที่มีต่อข้าวฟ่างในเวลาที่จำกัด"
                    : "The 30 seconds to make love to Kaofrang Yanisa"
                }
              />
              <List>
                <ListItem>
                  <ListItemText
                    primary={
                      lang == "th"
                        ? "1. คุณมีเวลา 30 วินาทีในการกดที่รูปหน้าข้าวฟ่างรัวๆ เพื่อสะสมคะแนนความรักที่มีต่อข้าวฟ่าง"
                        : "1. Please tap on Kaofrang's face avatar repeatly to earn scores and enhance your chance to earn more KorKao Points in 30 second!"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      lang == "th"
                        ? "2. ทุก 20 คะแนนคุณจะได้รับ 1 KorKao Points โดยคะแนนส่วนเกินที่ไม่เกิน 20 คะแนนจะไม่ถูกคำนวน (คุณต้องเข้าสู่ระบบ KorKao ID ก่อนเล่น)"
                        : "2. Get every 20 scores to earn 1 KorKao points. The excess points are less than 20 points will not be affected. (KorKao ID login required)"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      lang == "th"
                        ? "3. หากคะแนนรวมตลอดทั้งเกมคุณได้อย่างน้อย 1 คะแนน แต่ไม่เกิน 20 คะแนน จะได้รับ 1 KorKao Points (คุณต้องเข้าสู่ระบบ KorKao ID ก่อนเล่น)"
                        : "3. Get at least 1 score but less than 20 scores on a game will earn 1 KorKao Points. (KorKao ID login required)"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      lang == "th"
                        ? "4. หากไม่ได้เป็นสมาชิก KorKao ID คุณก็สามารถเล่นเกมนี้ได้เช่นกัน แต่คุณจะไม่ได้รับคะแนน KorKao Points เพื่อเข้าร่วมกิจกรรมต่างๆที่จะเกิดขึ้นอนาคต"
                        : "4. You will earn 1 point when answer correct."
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      lang == "th"
                        ? "5. สำหรับผู้ใช้งาน Android ทางผู้พัฒนาได้พัฒนาระบบคำสั่งสั่นที่ตัวอุปกรณ์เพื่อเพิ่มอรรถรสในการเล่น"
                        : "5. We use vibration on your device for Android device to increase the enjoyment of playing the game."
                    }
                  />
                </ListItem>
              </List>
              <Button
                className="mt-3"
                variant="contained"
                disabled={startLoad}
                onClick={() => StartGame()}>
                {lang == "th" ? "เริ่มเกมส์" : "Play!"}
              </Button>
              <br />
              {login && (
                <Button
                  className="mt-2"
                  variant="outlined"
                  disabled={startLoad}
                  onClick={() => setGameHistory(true)}>
                  {lang == "th" ? "ดูคะแนนย้อนหลัง" : "View previous Play"}
                </Button>
              )}
            </CardContent>
          </Card>
          {open && (
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
          )}
          <Dialog
            open={gamehis}
            TransitionComponent={Transition}
            transitionDuration={400}
            onClose={() => {}}
            maxWidth="md">
            {hisgame != null ? (
              <>
                <DialogTitle>
                  {lang == "th" ? "ประวัติการเล่น" : "Quiz Game History"}
                </DialogTitle>
                <TableContainer component={Paper} className="mb-5">
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          {lang == "th"
                            ? "วันเวลาที่เล่น"
                            : "Quiz Play Timestamp"}
                        </TableCell>
                        <TableCell align="right">
                          {lang == "th" ? "สถานที่เข้าถึง" : "Access Country"}
                        </TableCell>
                        <TableCell align="right">
                          {lang == "th" ? "คะแนนที่ได้" : "Scores"}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {hisgame.map((item) => (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}>
                          <TableCell component="th" scope="row">
                            {moment(item.created)
                              .lang(lang)
                              .local()
                              .format("DD MMMM YYYY HH:mm")}
                          </TableCell>
                          <TableCell component="th" scope="row" align="right">
                            {item.country}
                          </TableCell>
                          <TableCell component="th" scope="row" align="right">
                            {item.score}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <TableContainer component={Paper} className="mb-5">
                <Table sx={{ minWidth: 650 }}>
                  <TableBody>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}>
                      <TableCell colSpan={3}>
                        <Skeleton
                          variant="rounded"
                          className="bg-m mt-3 mb-3"
                          sx={{ height: 80 }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <DialogActions>
              <Button
                disabled={hisgame == null}
                onClick={() => setGameHistory(false)}>
                {lang == "th" ? "ปิด" : "Close"}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Fade>
    );
  }
  if (gamemeet == 2) {
    return (
      <div
        className="d-flex justify-content-center"
        style={{ marginBottom: 100 }}>
        <Card
          sx={{
            marginTop: { xs: 3, md: "15vh" },
            width: { xs: "90%", md: "70%" },
          }}>
          <CardContent>
            <CardHeader
              title="Result"
              data-aos="fade-right"
              subheader={
                lang == "th"
                  ? "คุณได้แสดงความรักไปกับน้องข้าวฟ่างถึง " +
                    correct +
                    " ครั้ง"
                  : "You got a love to Kaofrang in " + correct + " time(s)!"
              }
            />
            {login != null && login != undefined && (
              <Typography className="ml-3 mb-4">
                {lang == "th"
                  ? "คะแนนที่ได้รับ " + aver.pointearn + " KorKao Points"
                  : "You earned " + aver.pointearn + " KorKao Points."}
              </Typography>
            )}
            <Button
              className="mt-1"
              variant="contained"
              disabled={startLoad}
              onClick={() => setGame(0)}>
              {lang == "th" ? "เล่นอีกครั้ง" : "Play again"}
            </Button>
          </CardContent>
        </Card>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={airLoad}>
          <CircularProgress />
        </Backdrop>
      </div>
    );
  }
  return (
    <div
      data-aos="fade-in"
      className="d-flex justify-content-center"
      style={{ marginBottom: 130 }}>
      <Card sx={{ marginTop: "5vh", width: { xs: "90%", md: "70%" } }}>
        <div className="pr-0 row container mt-2">
          <div
            className="col-6"
            style={{ color: timeremain <= 10 ? "red" : "" }}>
            <CircularProgressWithLabel
              variant="determinate"
              value={(timeremain / 30) * 100}
              labeldata={timeremain}
            />
          </div>
          <div className="col-6 p-0 text-right">
            {correct} {lang == "th" ? "ครั้ง" : "time(s)"}
          </div>
        </div>
        <CardContent>
          <div
            className="d-flex justify-content-center"
            style={{ marginBottom: 7 }}>
            <Avatar
              onClick={(e) => SelectGame(e)}
              src={
                pop == -1
                  ? "https://d3hhrps04devi8.cloudfront.net/kf/kfprofile.webp"
                  : "https://d3hhrps04devi8.cloudfront.net/kf/pop" +
                    pop +
                    ".jpg"
              }
              sx={{
                marginTop: 7,
                display: "block",
                width: { md: "280px", xs: "60%" },
                height: { md: "280px", xs: "60%" },
              }}
            />
            {hearts.map((heart) => (
              <div
                key={heart.id}
                className="heart"
                style={{ left: heart.x, top: heart.y }}>
                ❤️
              </div>
            ))}
          </div>

          <CardHeader
            className="text-center"
            title={
              lang == "th"
                ? "แสดงความรักต่อข้าวฟ่างด้วยกดที่รูปเลย!"
                : "Are you waiting for? Let's show your heart!"
            }
          />
        </CardContent>
      </Card>{" "}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={airLoad}>
        <CircularProgress />
      </Backdrop>
    </div>
  );
};

const mapStateToProps = (state) => ({
  load: state.load,
  dark: state.dark,
  lang: state.lang,
  launch: state.launch,
  currentPage: state.currentPage,
  game: state.game,
  guide: state.guide,
  login: state.login,
  currentCountry: state.currentCountry,
});
const mapDispatchToProps = (dispatch) => ({
  setLoad: (val) => dispatch(setLoad(val)),
  setDark: (val) => dispatch(setDarkMode(val)),
  setLang: (val) => dispatch(setLang(val)),
  setPage: (val) => dispatch(setPage(val)),
  setInGame: (val) => dispatch(setInGame(val)),
});
export default connect(mapStateToProps, mapDispatchToProps)(GameApp);
