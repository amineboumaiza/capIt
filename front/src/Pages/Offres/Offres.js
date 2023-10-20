import React, { useEffect, useState, useRef } from "react";
import Footer from "../../Components/Footer/Footer";
import axios from "axios";
import Cards from "../../Components/Cards/Cards";
import "./Offres.css";

function Offres() {
  const offers = useRef(null);
  const [card, setCard] = useState(null);

  function getOffers() {
    axios.get("http://localhost:3001/offres/getAllOffers").then((response) => {
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
    <div className="offres-container">
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "3%",
          color: "#0D6EFD",
        }}
      >
        Offres
      </h1>
      <div className="card-container">{card}</div>
      <div style={{ width: "105%" }}>
      <div className="foot">
        <Footer />
        </div>
      </div>
    </div>
  );
}

export default Offres;
