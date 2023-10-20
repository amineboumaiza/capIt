import React, { useState } from 'react';
import './Slider.css';

const Slider = ({ images }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const nextSlide = () => {
    const newIndex = currentLineIndex + 1;
    setCurrentLineIndex(newIndex >= Math.ceil(images.length / getNumSlidesPerLine()) ? 0 : newIndex);
  };

  const prevSlide = () => {
    const newIndex = currentLineIndex - 1;
    setCurrentLineIndex(newIndex < 0 ? Math.ceil(images.length / getNumSlidesPerLine()) - 1 : newIndex);
  };

  const renderImages = () => {
    const renderedImages = [];
    const startIndex = currentLineIndex * getNumSlidesPerLine();

    for (let i = startIndex; i < startIndex + getNumSlidesPerLine(); i++) {
      if (i < images.length) {
        renderedImages.push(<img key={i} src={images[i]} alt="" />);
      }
    }

    return renderedImages;
  };

  const renderSlideLines = () => {
    const slideLines = [];
    const numSlideLines = Math.ceil(images.length / getNumSlidesPerLine());

    for (let i = 0; i < numSlideLines; i++) {
      slideLines.push(
        <div className="slide-line" key={i} style={{ display: i === currentLineIndex ? 'flex' : 'none', justifyContent:'space-around' }}>
          {renderImages()}
        </div>
      );
    }

    return slideLines;
  };

  const getNumSlidesPerLine = () => {
    return window.innerWidth < 769 ? 1 : 3;
  };

  return (
    <div className="SSHome">
      {renderSlideLines()}
      <button className='btprevslider' onClick={prevSlide} disabled={currentLineIndex === 0} style={{ backgroundColor: '#AF07E6', color: 'white' }}>
        Prev
      </button>
      <button className='btnextslider' onClick={nextSlide} disabled={currentLineIndex >= Math.ceil(images.length / getNumSlidesPerLine()) - 1} style={{ backgroundColor: '#AF07E6', color: 'white' }}>
        Next
      </button>
    </div>
  );
};

export default Slider;
