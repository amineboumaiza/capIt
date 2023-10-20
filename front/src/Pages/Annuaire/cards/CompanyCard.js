import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTypography,
} from "mdb-react-ui-kit";
export default function ProfileStatistics(props) {
  const { company } = props;
  console.log(company);
  return (
    <div
      className="vh-100 d-flex justify-content-center align-items-center"
      data-aos="fade-up"
      style={{
        scale: "1.2",
        width: "200%",
        marginLeft: "-40%",
        marginBottom: "2px",
      }}
    >
      <MDBContainer className="py-5 cardPost-container">
        <MDBRow className="row-cols-1 row-cols-md-3 g-4">
          <MDBCol
            md="12"
            xl="4 "
            className="d-flex flex-column justify-content-center align-items-center mt-4"
          >
            <MDBCard
              className="d-flex flex-column justify-content-center align-items-center"
              style={{
                borderRadius: "15px",

                width: "100%",
                height: "100%",
                background: "rgba( 188, 161, 217, 0.05 )",
                boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
                backdropFilter: "blur( 20px )",
                WebkitBackdropFilter: "blur( 20px )",
                borderRadius: "10px",
                border: "1px solid rgba( 255, 255, 255, 0.18) ",
              }}
            >
              <MDBCardBody className="text-center">
                <div className="mt-3 mb-4">
                  <MDBCardImage
                    src={company.picture}
                    className="rounded-circle"
                    fluid
                    style={{ width: "100px" }}
                  />
                </div>
                <MDBTypography tag="h4">{company.entrepriseName}</MDBTypography>

                <MDBCardText className="text-muted mb-4 text-center">
                  {company.bio}
                </MDBCardText>

                <MDBBtn rounded size="lg">
                  Voir plus
                </MDBBtn>
                <Link to={`/chat/`} state={{ creator: company._id }}>
                  <MDBBtn rounded size="lg">
                    <FontAwesomeIcon icon={faMessage} />
                  </MDBBtn>
                </Link>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
