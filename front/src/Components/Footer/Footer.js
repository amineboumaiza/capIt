import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn
} from 'mdb-react-ui-kit';

export default function Footer() {
  return (
    <MDBFooter bgColor='light' className='text-center text-lg-start text-muted'>
      <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
        <div className='me-5 d-none d-lg-block'>
          <span>Connectez-vous avec nous sur les réseaux sociaux : </span>
        </div>

        <div>
          <a href='https://www.facebook.com/capit.agency' className='me-4 text-reset'  target="_blank">
            <MDBIcon fab icon="facebook-f" />
          </a>
          <a href='https://capit.agency/' className='me-4 text-reset'  target="_blank">
            <MDBIcon fab icon="google" />
          </a>
          <a href='https://www.instagram.com/capit.odoo/' className='me-4 text-reset'  target="_blank">
            <MDBIcon fab icon="instagram" />
          </a>
          <a href='https://www.linkedin.com/company/capit_tn/' className='me-4 text-reset' target="_blank">
            <MDBIcon fab icon="linkedin" />
          </a>
        </div>
      </section>

      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
              <h6 className='text fw-bold mb-4'>
                <MDBIcon icon="gem" className="me-3" />
                CapitAll
              </h6>
              <p>
              Boostez votre entreprise avec notre réseau social dédié aux petites entreprises.
              </p>
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Actualités</h6>
              <p>
              <MDBCard>
                <MDBCardBody>
                  <MDBCardTitle>Chatgbt-4</MDBCardTitle>
                  <MDBCardText>Comment utiliser dès maintenant GPT-4, la nouvelle version </MDBCardText>
                  <MDBBtn href='/Blogs'>Voir plus</MDBBtn>
                </MDBCardBody>
              </MDBCard>
              </p>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Liens utiles</h6>
              <p>
                <a href='/Connexion' className='text-reset'>
                  Connexion
                </a>
              </p>
              <p>
                <a href='/inscription' className='text-reset'>
                  Inscription
                </a>
              </p>
              <p>
                <a href='/Offres' className='text-reset'>
                  Offres
                </a>
              </p>
              <p>
                <a href='/Annuaire' className='text-reset'>
                  Annuaire
                </a>
              </p>
              <p>
                <a href='/Contact' className='text-reset'>
                  Contact
                </a>
              </p>
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
              <p>
                <MDBIcon icon="home" className="me-2" />
                
                71 Av. Jean Jaurès 1001 Tunis, Tunisie
              </p>
              <p>
                <MDBIcon icon="envelope" className="me-3" />
                
                   <a href="mailto:contact@capit.agency" style={{textDecoration:"none"}}>contact@capit.agency</a> 
              </p>
              <p>
                <MDBIcon icon="phone" className="me-3" href="tel:+21627452919" /> +216 27 452 919
              </p>
              <iframe width="300" height="200" frameborder="0" scrolling="no" marginHeight="0" marginWidth="0" id="gmap_canvas" src="https://maps.google.com/maps?width=200&amp;height=200&amp;hl=en&amp;q=71%20Av.%20Jean%20Jaur%C3%A8s%201001%20Tunis,%20Tunisie%20Tunis+(Capit)&amp;t=p&amp;z=19&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"></iframe>

            </MDBCol>
            
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2023 Copyright :  
        <a className='text-reset fw-bold' href='https://capit.agency/'>
            Capit Agency
        </a>
      </div>
    </MDBFooter>
  );
}