import React, {useState, useEffect, useRef} from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import UserService from '../../../Services/UserService';
import axios from 'axios';
import Cards from './Cards'
const RechercheEntreprise = () => {
  const [search,setSearch] = useState(
    {
      entrepriseName:'',
    }
  )
  const [admin, setAdmin] = useState(false);
  const companies = useRef(null);
  const [card, setCard] = useState(null);

  const getAdmin = async() => {
    const token = localStorage.getItem('token')
    const headers = {
         headers:
          {
             'token': token
          }
    };
    try{
      const response = await UserService.getAdmin(headers);
      setAdmin(response.data.Admin);
      console.log(response.data);
    } catch(err){
      console.log(err);
    }
  }

  function getCompanies(search) {
    console.log(search)
    const token = localStorage.getItem('token');
    const headers = {
        headers:
        {
            'token': token
        }
    };

    axios.post("http://localhost:3001/users/getCompaniesAdmin", search, headers).then(response => {
      console.log(response);
      companies.current = response.data.users;
      if (companies.current.length !== 0) {
          console.log(companies.current);
          setCard(Array.from(companies.current).map(company =>
              <div key={company._id} className='CardAnu' style={{ flexBasis: '30%', margin: '10px' }}>
                  <Cards company={company} />
              </div>
          ))
      }
  });
}

  useEffect(() => {
    getAdmin();
  }, []);

  if(admin){
    return (
      <div>
        <div className="mx-auto" style={{width:"60%", marginLeft: '40%' }}>
          {/* Center align the search bar */}
          <Form className="d-flex">
            <FormControl type="text" value={search.entrepriseName}
                  onChange={(e) => setSearch({...search, entrepriseName: e.target.value})} 
                  placeholder="Rechercher les entreprises" className="me-2" />
            <Button variant="primary" onClick={() => getCompanies(search)}>
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </Form>
        
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: '-5px',overflowX:'hidden'}}>
          {card}
        </div>
      </div>
    );
  }else{
    return(
      <>
        404 Page Not Found
      </>
    );
  }

};

export default RechercheEntreprise;
