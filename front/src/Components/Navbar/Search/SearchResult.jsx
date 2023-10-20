import "./SearchResult.css";
import { useNavigate } from "react-router-dom";

export const SearchResult = ({ result }) => {
  const refresh = () => window.location.reload(true);
  const navigate = useNavigate();
  console.log(result)

  return (
    <div
      className="search-result"
      onClick={(e) => {
        navigate(`/Profile/${result.username}`,{replace:true});
        refresh();
      }}
    >
      <img src={result.picture} width="7%" height="7%" /> {result.entrepriseName}
    </div>
  );
};
