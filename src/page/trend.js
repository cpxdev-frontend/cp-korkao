import React from "react";
import { connect } from "react-redux";
import { XEmbed } from "react-social-media-embed";
import {
  Card,
  CardContent,
  Fade,
  CardHeader,
  Button,
  Grid,
  CardActions,
  Box,
  Chip,
  Tab,
  Typography,
  CardMedia,
  List,
  Dialog,
  ListItem,
  Pagination,
  Slide,
  Skeleton,
  AppBar,
  Toolbar,
  IconButton,
  CardActionArea,
  Divider,
  DialogContent,
} from "@mui/material";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import "../iframenormal.css";
import CloseIcon from "@mui/icons-material/Close";
import { setLoad, setLang, setDarkMode, setPage } from "../redux/action";
import moment from "moment";
import { Carousel as MobileCarousel } from "react-responsive-carousel";
import usePagination from "../pagination";
import Swal from "sweetalert2";

const LazyTweet = ({ item }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px",
  });

  return (
    <div
      ref={ref}
      className="mb-3 w-100 d-flex justify-content-center"
      style={{ minHeight: "300px" }}
    >
      {inView ? (
        <XEmbed
          className="tweetx"
          style={{ width: "100%", maxWidth: "550px" }}
          url={`https://x.com/${item.screen_name}/status/${item.tweet_id}`}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function convertUrlsAndHashtagsToLinks(text) {
  // Regular expressions to match URLs and hashtags
  const urlRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/g;
  const hashtagRegex = /#([A-Zกa-z\u0E00-\u0E7F\w0-9_]+)/g;

  // Replace URLs with clickable links
  text = text.replace(urlRegex, function (match) {
    return (
      '<a class="App-link" href="' +
      match +
      '" target="_blank">' +
      match +
      "</a>"
    );
  });

  // Replace hashtags with clickable links
  text = text.replace(hashtagRegex, function (match, hashtag) {
    return (
      '<a class="App-link" href="https://x.com/hashtag/' +
      hashtag +
      '?src=hashtag_click&f=live" target="_blank">' +
      match +
      "</a>"
    );
  });

  return text;
}

const TrendUp = ({ currentPage, lang, setLang, setPage, guide }) => {
  const [width, setRealwidth] = React.useState(window.innerWidth);
  const [data, setData] = React.useState(null);
  const [sam, setSam] = React.useState([]);
  const [pageset1, setPagin1] = React.useState(1);

  const music = React.useRef(null);
  const PER_PAGE = 8;

  let count1 = Math.ceil(sam.length / PER_PAGE);
  let _DATA1 = usePagination(sam, PER_PAGE);

  const handleChange1 = (e, p) => {
    if (music.current) {
      music.current.scrollIntoView({ behavior: "smooth" });
    }
    setPagin1(p);
    _DATA1.jump(p);
  };

  const [open, setOpen] = React.useState(false);
  React.useState(() => {
    setTimeout(() => {
      setOpen(true);
    }, 50);
  }, [currentPage]);

  React.useEffect(() => {
    var requestOptions = {
      method: "POST",
    };
    function handleWindowResize() {
      setRealwidth(window.innerWidth);
    }

    window.addEventListener("resize", handleWindowResize);
    setData(null);
    fetch(process.env.REACT_APP_APIE_2 + "/kfsite/gettrend", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setData(
          result.timeline.filter((item) => item.screen_name !== "cpxdevspace"),
        );
        setSam(
          result.timeline.filter((item) => item.screen_name !== "cpxdevspace"),
        );
      })
      .catch((error) => console.log("error", error));
  }, []);

  return (
    <Fade in={open} timeout={300}>
      <Box sx={{ marginTop: { xs: 0, md: 15 }, marginBottom: 15 }} ref={music}>
        <CardHeader
          title={<h3>Trend Update of Kaofrang</h3>}
          data-tour="disco-1"
          subheader={
            lang == "th"
              ? 'เทรนใหม่มาแรง "#KaofrangYanisa"'
              : 'Trend update of "#KaofrangYanisa"'
          }
        />
        <div className="container">
          {data != null ? (
            <Grid container spacing={2} data-tour="t" className="ml-1 w-100">
              {data.length > PER_PAGE && (
                <div className="col-md-12 d-flex justify-content-center mb-3">
                  <Pagination
                    count={count1}
                    size="large"
                    page={pageset1}
                    onChange={handleChange1}
                  />
                </div>
              )}
              {data.length > 0 &&
                _DATA1.currentData().map((item, i) => (
                  <Grid key={"home-" + item.tweet_id} item md={6} xs={12}>
                    <CardContent
                      data-tempid={item.tweet_id}
                      sx={{ backgroundColor: "transperent" }}
                    >
                      <LazyTweet key={item.id} item={item} />
                    </CardContent>
                  </Grid>
                ))}
              {data.length > PER_PAGE && (
                <div className="col-md-12 d-flex justify-content-center mb-3">
                  <Pagination
                    count={count1}
                    size="large"
                    page={pageset1}
                    onChange={handleChange1}
                  />
                </div>
              )}
            </Grid>
          ) : (
            <Card>
              <CardContent>
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "2rem" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "1rem" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "1rem" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "1rem" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "1rem" }}
                />
                <Skeleton
                  variant="text"
                  className="bg-m"
                  sx={{ fontSize: "1rem" }}
                />
              </CardContent>
            </Card>
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
export default connect(mapStateToProps, mapDispatchToProps)(TrendUp);
