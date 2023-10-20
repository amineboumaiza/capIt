import React from "react";
import SecOne from "./sections/SecOne";
import SecTwo from "./sections/SecTwo";
import "./home.css";
import SecFive from "./sections/SecFive";
import SecFoor from "./sections/SecFoor";
import SecThree from "./sections/secThree";
import Footer from "../../Components/Footer/Footer";
function Home() {
  return (
    <div className="homeMain">
      <div className="s1">
        <SecOne />
      </div>
      <div className="s2">
        <SecTwo />
      </div>
      <div>
        <SecThree />
      </div>
      <div>
        <SecFoor />
      </div>
      <div>
        <SecFive />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
