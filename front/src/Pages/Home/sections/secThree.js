import React from "react";
import SecTwoBackground from "./services-left-dec.png";
import "./sectwo.css";
import Annuaire from "../../../Components/Annuaire/Annuaire";
import "./SecThree.css";
import img1 from "../../../images/Nouveau dossier/Design.jpg";
import img2 from "../../../images/Nouveau dossier/Tech.jpg";
import img3 from "../../../images/Nouveau dossier/Traduction.jpg";
import img4 from "../../../images/Nouveau dossier/Photographie.jpg";
import img5 from "../../../images/Nouveau dossier/Video.jpg";
import img6 from "../../../images/Nouveau dossier/Marketing.jpg";
import img7 from "../../../images/Nouveau dossier/Ai.jpg";
import img8 from "../../../images/Nouveau dossier/Sponsoring.jpg";
import img9 from "../../../images/Nouveau dossier/Musique.jpg";
import Slider from "./Slider";
const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9];
function SecTwo() {
  return (
    <>
      <div
        className="SecTwoMain"
        id="secThree"
        style={{
          backgroundImage: `url(${SecTwoBackground})`,
          height: "40%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="SecTwoTitle">
          <div id="SecTwoTitleBlue">
            <h1>Annuaire</h1>
          </div>
        </div>
      </div>

      <div className="Annuaire">
        <Slider images={images} />;
      </div>
    </>
  );
}

export default SecTwo;
