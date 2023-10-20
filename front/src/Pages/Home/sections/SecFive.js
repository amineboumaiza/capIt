import React from "react";
import SecTwoBackground from "./services-left-dec.png";
import "./sectwo.css";
import Testimonial from "../../../Components/Temoignages/Testimonial";
import "./SecFive.css";

function SecTwo() {
  return (
    <>
      <div
        className="SecTwoMain"
        style={{
          backgroundImage: `url(${SecTwoBackground})`,
          height: "90%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="SecTwoTitle" id="secFiveTitle">
          <div id="SecTwoTitleBlue">
            <h1>Temoignages</h1>
          </div>
        </div>
      </div>
      <div className="cards" id="Testimonial">
        <Testimonial />
      </div>
    </>
  );
}

export default SecTwo;
