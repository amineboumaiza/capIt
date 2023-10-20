import React, { useEffect, useState } from "react";
import "./secone.css";

function SecOne(){
    const [index, setIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % 3);
      }, 3000);
      return () => clearInterval(interval);
    }, []);
  
    const paragraphs = [<p className="secOneLeftParagraphs">Donnez à votre <em className="secOneLeftEm">petite entreprise </em> les ailes <span className="secOneLeftSpan">d'un grand réseau!</span></p>, 
    <p className="secOneLeftParagraphs">Créons des ponts pour permettre aux <em className="secOneLeftEm">petites entreprises </em> d'accéder <span className="secOneLeftSpan">à de grands réseaux!</span></p>, 
    <p className="secOneLeftParagraphs">Donnez à votre <em className="secOneLeftEm">petite entreprise </em> une grande envergure grâce <span className="secOneLeftSpan">à notre réseau!</span></p>];
    return (
        <>
            <div className="secOneMain">
                <div className="secLeft">
                    <div className="secLeftBackground">
                        <img className="secOneFirstbackground" src="./baner-dec-left.png"/>
                    </div>
                    <div className="secLeftParagraphs">
                        <strong><p >{paragraphs[index]}</p></strong>
                    </div>
                </div>
                <img data-aos="fade-up" className="secOneRightImage" src="./two-business-partners-working-in-office.png"/>
            </div>

        </>
    );
}

export default SecOne;