import React from "react";
import SecTwoBackground from "./services-left-dec.png";
import "./sectwo.css";
import Partenaire from "../../../Components/Partenaire/Partenaire";
import "./SecFour.css";

function SecTwo() {
  return (
    <>
      <div
        className="SecTwoMain"
        id="secFour"
        style={{
          backgroundImage: `url(${SecTwoBackground})`,
          height: "80%",
          backgroundRepeat: "no-repeat",
          marginTop: "10%",
        }}
      >
        <div className="SecTwoTitle" id="secFourTitle">
          <div id="SecTwoTitleBlue">
            <h1>Partenaire</h1>
          </div>
        </div>
      </div>

      <div className="cards">
        <Partenaire />
      </div>
    </>
  );
}

export default SecTwo;
