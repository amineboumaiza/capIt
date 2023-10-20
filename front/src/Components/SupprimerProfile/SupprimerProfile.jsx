import React, { useState } from 'react';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';

export default function App() {
  const [centredModal, setCentredModal] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const toggleShow = () => setCentredModal(!centredModal);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <>
      <MDBBtn onClick={toggleShow}>Vertically centered modal</MDBBtn>

      <MDBModal tabIndex='-1' show={centredModal} setShow={setCentredModal}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Supprimer Mon compte</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <p>
                Veuillez taper "Momo" pour supprimer votre compte.
              </p>
              <input type="text" value={inputValue} onChange={handleInputChange} />
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={toggleShow}>
                Close
              </MDBBtn>
              <MDBBtn>Save changes</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
