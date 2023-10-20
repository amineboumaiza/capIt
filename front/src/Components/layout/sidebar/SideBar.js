import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { BsArchiveSidebar } from 'react-icons/bs';
import { BsPerson } from "react-icons/bs";
import { BsFillHouseDoorFill } from "react-icons/bs";
import { BsBoxArrowRight } from "react-icons/bs";
import { BsWindowSidebar } from "react-icons/bs";
import {BsFileEarmarkPost} from "react-icons/bs";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {Context, AppContext} from '../../../Context';
import Brand from '../../../images/1.png'
function SideBar(){
  const refresh = () => window.location.reload(true);
  const navigate=useNavigate();
  let context = useContext(AppContext);
    return (
      <div className="sidebarMain">
        <Offcanvas show={true} backdrop={false} enforceFocus={false} style={{width: '325px', marginTop: "5.2%", borderRadius: "0px", background: "#e1e1e1", boxShadow:  "20px 20px 60px #bfbfbf,-20px -20px 60px #ffffff"}}>
          <div className="sidebarHeader">
            <Offcanvas.Header>
              <a href="/home"><img src={Brand} alt="CAPITALL" width={100} height={100} style={{marginLeft:"90%"}} /> </a>
            </Offcanvas.Header>
          </div>
          <div className="sidebarBody">
          <Offcanvas.Body>
            <div className='sideBarButtonsGroup'>
                <Button variant="light" className="w-100 button" ><BsFillHouseDoorFill /> DashBoard</Button>
                <Link style={{textDecoration: 'none'}} to="/profile">
                    <Button variant="light" className="w-100 button" ><BsPerson /> Profile</Button>
                </Link>
                <Button variant="light" className="w-100 button" ><BsFileEarmarkPost /> Offers</Button>
                <Button variant="light" className="w-100 button" ><BsWindowSidebar/> CRM</Button>
                <Button variant="light" className="w-100 button"><BsArchiveSidebar /> Archive</Button>
                <Button variant="light" className="w-100 button" onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user_data');
                            context.setConfig({ ...context.config, isConnected: false });
                            refresh();
                            navigate("/home", { replace: true });}}><BsBoxArrowRight /> Déconnexion</Button>
            </div>
            
          </Offcanvas.Body>
          </div>
        </Offcanvas>
      </div>
    );
}

export default SideBar ;