
import React, { useState, useContext } from "react";
import './styles.css'
import Form from 'react-bootstrap/Form';
import UserService from "../../Services/UserService";
import {toast,Toaster} from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {Context, AppContext} from '../../Context';
import Capit from '../../images/1.png'
import Footer from "../../Components/Footer/Footer";
const Register =()=>
{
  
  const [username,setUsername] = useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [number,setNumber]=useState('')
  const [picture,setPicture]=useState('')
  const [erros,setError] = useState(
    {
      username:'',
      email:'',
      password:'',
      number:'',
    }
  )
  const refresh = () => window.location.reload(true);
  let context = useContext(AppContext);
  const navigate=useNavigate();
  const formValidation=()=>{

    let status=true;

    let localError ={...erros}

    if(username===""){
      localError.username='Nom d utilisateur obligatoir'
      status=false;
    }
    if(email===""){
      localError.email='email obligatoir';
      status=false;
    }
    if(password==="" || password.length<8){
      localError.password="password obligatoir et minimum 8 caratére"
      status=false;
    }
    if(number==="") {
      localError.number="numero obligatoir"
      status=false;

    }
    setError(localError);
    return status;

  }
  const inscription=async(e)=>{
    e.preventDefault();
    console.log("form sumbited")
    console.log("form data : ", username,email,password,number)

    if  (formValidation()) {
      const data ={
        username:username,
        email:email,
        password:password,
        number:number,
        picture:picture
      }

      try{
        const responce = await UserService.inscription(data);
          console.log( "responce == >" ,responce);
          toast.success("Entreprise validé ! ");
          setUsername('')
          setEmail('')
          setPassword('')
          setNumber('')
          localStorage.setItem("user_data", JSON.stringify(responce.data.user) );
          localStorage.setItem('token',responce.data.token)
          context.setConfig({...context.config, isConnected:true});
          refresh();
          
          navigate('/profile',{replace:true});
  
      } catch(err){
        console.log(err)
        toast.error("Entrepise non validé")
      }


    } else{
      console.log('inscription non validé')
      console.log(formValidation())
    }

    
    
    
  }

    return (
    <>
    <div className='photo'>
          </div>
      <div className="register">
        <Toaster /> 
          <div className="register-cover">
          </div>
          
        <div className="register-content">
          <div className="title">
               <img src={Capit} alt="CAPITALL" style={{height:'20%',width:'15%' , marginBottom:'3%'}} />
            </div>
            <div className="form-container">
                <form onSubmit={inscription}>
                  <label htmlFor="username">Nom d'utilisateur:</label>
                  <input type="text" id="username" name="username" placeholder="Nom d'utilisateur" 
                  value={username}
                  onChange={(e)=>setUsername(e.target.value)}
                 />
                 {
                  erros.username !==''? 
                  <div style={{textAlign:"left",color:"orangered"}}>
                    {erros.username}
                  </div>:''
                 }
                 

                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" name="email" placeholder="Email"
                    value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  />
                    {
                  erros.email !==''? 
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
                  erros.password !==''? 
                  <div style={{textAlign:"left",color:"orangered"}}>
                    {erros.password}
                  </div>:''
                 }

                  <label htmlFor="numero">Numero de telephone:</label>
                  <input type="text" id="numero" name="numero" placeholder="Numero de telephone"
                  value={number}
                  onChange={(e)=>setNumber(e.target.value)}
                  />
                  

                  <Form.Group controlId="formFileSm" className="mb-3">
                    <Form.Label>Mettez vous votre patente 👇</Form.Label>
                    <Form.Control style={{"paddingTop":"1%","paddingLeft":"20%"}} type="file" size="sm" 
                      value={picture}
                  onChange={(e)=>setPicture(e.target.value)}
                    />
                  </Form.Group>

                  <button type="submit">S'inscrire</button>
                </form>
                </div>
              </div>
          </div> 

      </>
    
     );
}
export default Register;