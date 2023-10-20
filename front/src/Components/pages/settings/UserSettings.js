import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { BsPencil } from 'react-icons/bs'; // Import the pencil icon
import './Settings.css'
import axios from 'axios';
import UserService from '../../../Services/UserService';
import './UserSettings.css';
function UserSettings() {
  const refresh = () => window.location.reload(true);
  const [validated, setValidated] = useState(false);
  const [info, setInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isInputEnabled, setIsInputEnabled] = useState(false); // Add state for input enable/disable

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  async function applySettings() {
    const token = localStorage.getItem('token');
    const headers = {
      headers:
      {
        'token': token
      }
    };
    console.log(headers);
    const response = await UserService.applyUserSettings(headers, info);
  }

  function getUser() {

    const token = localStorage.getItem('token')
    const headers = {
      headers:
      {
        'token': token
      }
    };

    axios.get("http://localhost:3001/users/getUser", headers).then(response => {
      console.log(response);
      // setInfo(response.data);
      setInfo(response.data);
    });

  }
  useEffect(() => {
    getUser();

  }, []);

  const handleEditClick = () => {
    setIsInputEnabled(!isInputEnabled); // Toggle input enable/disable
  }

  return (
    <>
      <div className="profileMain" id="profile">
        <div className="card" id="updateCard">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <h4 style={{fontSize:'150%'}}>Modifier vos cordonnees de l'authentification :</h4>
              <Row>
                <Form.Group as={Col} md="5" controlId="validationCustomUsername">
                  <Form.Label>Nom d'utilisateur :</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Nom d'utilisateur"
                      aria-describedby="inputGroupPrepend"
                      required
                      value={info.username}
                      onChange={(e) => setInfo({ ...info, username: e.target.value })}
                      disabled={!isInputEnabled} // Set input disabled based on state
                    />
                    {/* Render pencil icon conditionally based on input enabled/disabled state */}
                    <InputGroup.Text onClick={handleEditClick} style={{ cursor: 'pointer' }}>
                      <BsPencil />
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="5" controlId="validationCustomUsername">
                  <Form.Label>Email :</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      aria-describedby="inputGroupPrepend"
                      required
                      value={info.email}
                      onChange={(e) => setInfo({ ...info, email: e.target.value })}
                      disabled={!isInputEnabled} // Set input disabled based on state
                    />
                    <InputGroup.Text onClick={handleEditClick} style={{ cursor: 'pointer' }}>
                    <BsPencil />
                    </InputGroup.Text>
                    </InputGroup>
                    </Form.Group>
                    </Row>
                    </Row>
                    <Row className="mb-3">
                    <Form.Group as={Col} md="5" controlId="validationCustomUsername">
                    <Form.Label>Mot de Passe :</Form.Label>
                    <InputGroup hasValidation>
                    <Form.Control
                    type="password"
                    placeholder="Mot de passe"
                    aria-describedby="inputGroupPrepend"
                    required
                    value={info.password}
                    onChange={(e) => setInfo({ ...info, password: e.target.value })}
                    disabled={!isInputEnabled}
                    />
                    <InputGroup.Text onClick={handleEditClick} style={{ cursor: 'pointer' }}>
                    <BsPencil />
                    </InputGroup.Text>
                    </InputGroup>
                    </Form.Group>
                    </Row>
                    <div className="profileFormButton" style={{marginLeft:'40%'}}>
                          <Button type="submit"  onClick={() =>{
                                applySettings();
                                refresh();
                          } } id="save" style={{backgroundColor:'#5B88D3'}}>Enregistrer</Button>
                      </div>
                    </Form>
              </div>
              </div>
                </>
                );
                }

export default UserSettings;