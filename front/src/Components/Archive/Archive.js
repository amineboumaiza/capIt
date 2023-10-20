import React, { useEffect, useState } from "react";
import axios from "axios";
import Cards from "../../Components/Cards/Cards";
import "./Archive.css";

function Offers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    getMyOffers();
  }, []);

  function getMyOffers() {
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };
    axios
      .get("http://localhost:3001/offres/getMyOffers", headers)
      .then((response) => {
        const fetchedOffers = response.data.offers;
        console.log(fetchedOffers);
        setOffers(fetchedOffers);
      })
      .catch((error) => {
        console.log("Error fetching offers:", error);
      });
  }

  return (
    <div className="archive-container">
      <div id="arch">
        <h1
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "3%",
            color: "#0D6EFD",
          }}
        >
          Archive
        </h1>
      </div>
      <div className="card-container" id="ArchiveCard">
        {offers.map((offer) => (
          <Cards key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
}

export default Offers;
