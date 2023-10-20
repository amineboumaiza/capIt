import React from 'react';
import Button from 'react-bootstrap/Button';
import './Annuaire.css';

function Annuaire() {
  return (
    <div className="Butt" >
      <div className="N1" data-aos="fade-up">
        <div>
          <Button className="button" variant="outline-primary">
          Graphisme & Design
          </Button>
        </div>
        <div>
          <Button className="button" variant="outline-danger">
          Programmation & Tech
          </Button>
        </div>
        <div>
          <Button className="button" variant="outline-primary">
          Data
          </Button>
        </div>
      </div>
      <div className="N2">
        <div>
          <Button className="button" variant="outline-danger">
          Rédaction & Traduction
          </Button>
        </div>
        <div>
          <Button className="button" variant="outline-primary">
          Vidéo & Animation          </Button>
        </div>
        <div>
          <Button className="button" variant="outline-danger">
          Musique & Audio
          </Button>
        </div>
      </div>
      <div className="N3">
        <div>
          <Button className="button" variant="outline-primary">
          Photographie
          </Button>
        </div>
        <div>
          <Button className="button" variant="outline-danger">
          Loisirs
          </Button>
        </div>
        <div>
          <Button className="button" variant="outline-primary">
            Sponsoring
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Annuaire;
