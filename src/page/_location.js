import React from "react";
import { Skeleton } from "@mui/material";
import Swal from "sweetalert2";

const LocationLoad = ({ coodinate, lang, i }) => {
  const [place, setplace] = React.useState(null);
  React.useEffect(() => {
    setTimeout(() => {
      fetch(
        "https://nominatim.openstreetmap.org/reverse?format=json&lat=" +
          coodinate[0] +
          "&lon=" +
          coodinate[1] +
          "&accept-language=" +
          lang
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.address.country_code !== "th") {
            Swal.fire({
              title:
                lang == "th"
                  ? "กิจกรรมนี้จัดขึ้นที่ต่างประเทศ"
                  : "This event is located in abroad.",
              text:
                lang == "th"
                  ? "กิจกรรมนี้อาจมีค่าใช้จ่ายด้านการเดินทางเพิ่มเติมรวมทั้งสภาพอากาศที่แตกต่างกัน กรุณาตรวจสอบและเผื่อเวลาล่วงหน้าก่อนเดินทาง"
                  : "This event may involve additional travel expenses and weather conditions. Please check and allow time in advance before joining.",
              icon: "warning",
            });
          }
          setplace(result.display_name.split(", ")[0]);
        })
        .catch((error) => console.log("error", error));
    }, 800);
  }, [lang]);
  if (place == null) {
    return (
      <Skeleton className="mt-3" variant="text" sx={{ fontSize: "1.2rem" }} />
    );
  }
  return (
    <p className="mt-3">
      {lang == "th" ? "สถานที่จัดกิจกรรม: " : "Event Location: "} <b>{place}</b>
    </p>
  );
};

export default LocationLoad;
