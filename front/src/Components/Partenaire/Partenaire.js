import React, { useState, useEffect } from "react";
import Capit from "../../images/Capit.jpg";
import google from "../../images/Googlelogo.jpg" ;
import micro from "../../images/MICRO.jpg" ;
import "./Partenaire.css";

const OurPartners = () => {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    setPartners([Capit, google, micro]);
  }, []);

  return (
    <div className="our-partners" data-aos="fade-up">
      <div className="partner-slider">
        {partners.map((partner, index) => (
          <div className="partner-slide" key={index}>
            <img src={partner} alt={`Partner ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurPartners;
