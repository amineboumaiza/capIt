import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

import "./SearchBar.css";

export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");
  const [isHidden, setIsHidden] = useState(false);

  const fetchData = (value) => {
    fetch("http://127.0.0.1:3001/users/search")
      .then((response) => response.json())
      .then((json) => {
        const results = json.filter((user) => {
          console.log(user);
          console.log(value);
          console.log(input);
          return (
            value.toLowerCase() &&
            user &&
            user.entrepriseName.toLowerCase() &&
            user.entrepriseName
              .toLowerCase()
              .includes(value.toLowerCase())
          );
        });
        console.log(results);
        setResults(results);
      });
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 0) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`input-wrapper ${isHidden ? "hidden" : ""}`}
    >
      <FaSearch id="search-icon" />
      <input
        className="inputSearch"
        placeholder="Que voulez-vous rechercher ?"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};
