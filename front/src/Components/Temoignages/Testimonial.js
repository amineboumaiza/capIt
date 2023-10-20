import React, { useEffect, useState, useRef } from "react";
import Swiper from "swiper";
import "swiper/swiper-bundle.min.css";
import "boxicons/css/boxicons.min.css";
import "./TestimonialCarousel.css";
import tm1 from "../../images/Mr Mahdi.jpg";
import tm2 from "../../images/t1.jpg";
import tm3 from "../../images/t2.jpg";

function TestimonialSlider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef([]);
  useEffect(() => {
    const newSwiper = new Swiper(".mySwiper", {
      slidesPerView: 1,
      grabCursor: true,
      loop: true,
      autoplay: {
        delay: 2000,
        disableOnInteraction: true,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        prevEl: ".swiper-button-prev",
        nextEl: ".swiper-button-next",
      },
    });

    swiperRef.current.push(newSwiper);

    // Update active slide index
    newSwiper.on("slideChange", () => {
      setActiveSlide(newSwiper.realIndex);
    });

    return () => {
      newSwiper.destroy();
      swiperRef.current = swiperRef.current.filter(
        (swiper) => swiper !== newSwiper
      );
    };
  }, []);

  const slideNext = () => {
    swiperRef.current.forEach((swiper) => {
      swiper.slideNext();
    });
  };

  const slidePrev = () => {
    swiperRef.current.forEach((swiper) => {
      swiper.slidePrev();
    });
  };

  return (
    <section className="Contenttm">
      <div className="testimonial mySwiper">
        <div className="testi-content swiper-wrapper">
          <div className="slide swiper-slide" id="test">
            <img src={tm1} alt="" className="image" id="im" />
            <p>
              Je peinais à promouvoir ma petite entreprise sur les réseaux
              sociaux jusqu'à ce que je découvre cette incroyable plateforme de
              mise en réseau ! Elle est incroyablement conviviale et la
              communauté est si solidaire et engagée. Grâce à ce site web, mon
              entreprise a gagné énormément de nouveaux abonnés et clients. Je
              le recommande vivement !
            </p>
            <i className="bx bxs-quote-alt-left quote-icon"></i>
            <div className="details">
              <span className="name">Fathallah Med Mahdi</span>
              <span className="job">Directeur CAPIT</span>
            </div>
          </div>
          <div className="slide swiper-slide">
            <img src={tm2} alt="" className="image" id="im" />
            <p>
              En tant que novice dans le domaine du marketing sur les réseaux
              sociaux, je ne saurais trop recommander cette plateforme. Elle m'a
              aidé à me connecter avec d'autres propriétaires de petites
              entreprises et à apprendre de leurs expériences. Les ressources et
              les outils fournis se sont révélés inestimables pour m'aider à
              développer la présence en ligne de mon entreprise. Merci !
            </p>
            <i className="bx bxs-quote-alt-left quote-icon"></i>
            <div className="details">
              <span className="name">Madison Hughes</span>
              <span className="job">Directrice Starlight Enterprises</span>
            </div>
          </div>
          <div className="slide swiper-slide">
            <img src={tm3} alt="" className="image" id="im" />
            <p>
              Ce site de mise en réseau sur les réseaux sociaux a été une
              véritable révolution pour mon entreprise. La possibilité de se
              connecter avec d'autres propriétaires de petites entreprises et de
              collaborer sur des projets a été incroyable. De plus, l'équipe
              d'assistance clientèle est incroyablement réactive et serviable.
              Je ne sais pas comment j'ai pu me débrouiller sans ce site !
            </p>
            <i className="bx bxs-quote-alt-left quote-icon"></i>
            <div className="details">
              <span className="name">Amelia Cooper</span>
              <span className="job">Directeur Horizon Technologies</span>
            </div>
          </div>
        </div>
        <div
          className="swiper-button-next swiper-button-next-white"
          onClick={slideNext}
        ></div>
        <div
          className="swiper-button-prev swiper-button-prev-white"
          onClick={slidePrev}
        ></div>
        <div className="swiper-pagination"></div>
      </div>
    </section>
  );
}

export default TestimonialSlider;
