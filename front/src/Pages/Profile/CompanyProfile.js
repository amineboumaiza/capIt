import React, { useState, useEffect } from 'react';
import { FaGlobe} from "react-icons/fa";
import { ImPencil } from "react-icons/im";
import './CompanyProfile.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import img1 from '../../images/En.jpg'

const CompanyProfile = () => {
  const [info, setInfo] = useState({});
  const { username } = useParams();

  function getCompanyProfile(){
    axios.get(`http://localhost:3001/users/getCompanyProfile/${username}`).then(response => {
          console.log(response);
          setInfo(response.data.user);
          console.log(info);
      });
  }

  useEffect(() => {
    getCompanyProfile();

  }, []);

  return (
    <div className="company-profile-container">
      {/* Background cover */}
      <div className="background-cover">
        {/* Add icon for modifying background cover */}
        <a href="/" className="background-cover-icon">
          <ImPencil />
        </a>
        <img src={img1} alt="Company background cover" />
      </div>
      {/* Profile photo */}
      <div className="profile-photo-container">
        <img src={info.picture} alt="Company profile" className="profile-photo" />
      </div>
      {/* Company name */}
      <h1 className="company-name">{info.entrepriseName}</h1>
      {/* Company bio */}
      <p className="company-bio">
        {info.bio}
      </p>
      {/* Company website */}
      <div className="company-website">
        <FaGlobe className="website-icon" />
        <a href="https://www.example.com" target="_blank" rel="noopener noreferrer">
          {info.website}
        </a>
      </div>
    </div>
  );
};

export default CompanyProfile;
