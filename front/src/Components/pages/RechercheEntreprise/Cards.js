import React from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import axios from 'axios';


export default function ProfileStatistics(props) {
  const refresh = () => window.location.reload(true);
  const { company } = props;

  console.log(company);
  console.log(company._id);

  return (
    <div className="vh-100" style={{ width:"200%", marginLeft: '-40%', marginBottom: "2px"}}>
      <MDBContainer className="container py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol md="12" xl="4">
            <MDBCard className='MDBCARD' style={{ borderRadius: '15px' }}>
              <MDBCardBody className="text-center">
                <MDBBtn tag="a" className="float-right" onClick={() => {
                      const token = localStorage.getItem('token')
                      const headers = {
                           headers:
                            {
                               'token': token
                            }
                      };
                  
                      const data = {
                        '_id': company._id
                      }
                      axios.post("http://localhost:3001/users/delUserAdmin", data, headers).then(response => {
                        console.log(response);
                        refresh();
                      })
                }} style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <MDBIcon icon="trash" size="lg" />
                </MDBBtn>
                <div className="mt-3 mb-4">
                  <MDBCardImage src={company.picture}
                    className="rounded-circle" fluid style={{ width: '100px' }} />
                </div>
                <MDBTypography tag="h4">{company.entrepriseName}</MDBTypography>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
