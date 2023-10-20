import React, { useState, useEffect, useRef } from "react";
import SecTwoBackground from "./services-left-dec.png";
import "./sectwo.css";
import Cards from "../../../Components/Cards/Cards";
import axios from "axios";

function SecTwo() {
  const offers = useRef(null);
  const [card, setCard] = useState(null);

  function getOffers() {
    axios.get("http://localhost:3001/offres/get3Offers").then((response) => {
      offers.current = response.data.offers;
      console.log(response.data.offers);
      if (offers.current.length !== 0) {
        console.log(offers.current);
        setCard(
          Array.from(offers.current).map((offer) => (
            <Cards key={offer.id} offer={offer} />
          ))
        );
      }
    });
  }

  useEffect(() => {
    getOffers();
  }, []);

  return (
    <>
      <div
        className="SecTwoMain"
        style={{
          backgroundImage: `url(${SecTwoBackground})`,
          height: "100%",
          backgroundRepeat: "no-repeat",
          marginTop: "3%",
        }}
      >
        <div className="SecTwoTitle" id="secTwoTitle">
          <div id="SecTwoTitleBlue">
            <h1>Offers</h1>
          </div>
        </div>
      </div>
      <div className="cards">{card}</div>
    </>
  );
}

export default SecTwo;
