import React, { useState, useContext } from "react";
import toast ,{ Toaster } from "react-hot-toast";
import Footer from "../../Components/Footer/Footer";

import './style.css'
import UserService from "../../Services/UserService";
import { useNavigate } from "react-router-dom";
import {Context, AppContext} from '../../Context';
import Capit from '../../images/1.png'
const Connexion = () =>
{ 
  const navigate=useNavigate();
  const [username,setUsername] =useState('')
  const [password,setPassword]=useState('')
  const [erros,setError] = useState(
    {
      username:'',
      password:'',
    }
  )
  const refresh = () => window.location.reload(true);
  let context = useContext(AppContext);
  
  const formValidation=()=>{

    let status=true;
    let localError ={...erros}

    if(username===""){
      localError.email='email obligatoir';
      status=false;
    }
    if(password===""){
      localError.password="password obligatoir et minimum 8 caratére";

      status=false;
    }
    setError(localError)
    //console.log(localError)
    return status;
  }
  const login =async(e)=>{
    e.preventDefault();
  console.log("form data : ",username,password)
    
      if (formValidation()){

        const data ={
          username:username,
          password:password, 
        }

        try{
          const response = await UserService.login(data);
            console.log( "response == >" ,response);
            //save user data localstorage
            localStorage.setItem("user_data", JSON.stringify(response.data.user) );
            localStorage.setItem('token',response.data.token)


            toast.success("compte entreprise validé ");
            setUsername('')
            setPassword('')
            //rederiction :
            context.setConfig({...context.config, isConnected:true});
            refresh();
            
            navigate('/profile',{replace:true});
        } catch(err){
          console.log(err)
          toast.error(err.response.data.message)
        }

      }else{
        console.log('login invalid')
      }

  }
        return (
            <>
            <div className='photo'>
                  </div>
              <div className="connexion">

              <Toaster />
              
                <div className="connexion-content">
                  <div className="title">
                  <img src={Capit} alt="CAPITALL" style={{height:'20%',width:'15%',marginBottom:'-15%'}} />
                    </div>
                    <div className="form-container-connexion">
                        <form onSubmit={login} >
                          <label htmlFor="username">Nom d'utilisateur:</label>
                          <input type="text" id="username" name="username" placeholder="Nom d'utilisateur" 
                            value={username}
                             onChange={(e)=>setUsername(e.target.value)}
                         />
                         {
                      erros.email !=''? 
                      <div style={{textAlign:"left",color:"orangered"}}>
                        {erros.email}
                      </div>:''
                    }
                              <label htmlFor="password">Mot de passe:</label>
                              <input type="password" id="password" name="password" placeholder="Mot de passe"
                              value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                            />
                            {
                      erros.password !=''? 
                      <div style={{textAlign:"left",color:"orangered"}}>
                        {erros.password}
                      </div>:''
                    }
                          <br />
                            <h3 className="compte">Vous n'avez pas encore de compte ? <a href="/inscription" style={{textDecoration:"none"}}> inscription </a></h3> 
                          <button type="submit">Connexion</button>
                        </form>
                        </div>
                      </div>
                      <div className="connexion-cover">
                  </div>
                  </div> 
                  <Footer />
              </>
    )
}
export default Connexion;