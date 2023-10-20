import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Image } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import "./navbar.css";
import Brand from "../../images/1.png"



function ColorSchemesExample() {
  return (
    <div>
      <Navbar bg="light" variant="light" className="navMain">
        <Container>
        <a href="/"><Image src={Brand} alt="CAPITALL" width={120} height={120} /> </a>
          <Nav className="ml-auto">
            <Nav.Link href="/Offres" style={{color:"#000"}}>Offres</Nav.Link>
            <Nav.Link href="/Annuaire" style={{color:"#000"}}>Annuaire</Nav.Link>
            <Button href="/connexion" variant="outline-primary" style={{paddingTop:"4.5%"}}>Connexion</Button>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}

export default ColorSchemesExample;