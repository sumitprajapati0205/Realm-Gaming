import React from "react";
import styled from "styled-components";
import realm from "../img/logo.jpg"
import HomeIcon from '@mui/icons-material/Home'; 
import VideocamIcon from '@mui/icons-material/Videocam';
import LightModeIcon from '@mui/icons-material/LightMode';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import ReportIcon from '@mui/icons-material/Report';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from "react-router-dom";
import { color } from "@mui/system";
import { useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { useDispatch } from "react-redux";


const Container = styled.div`
  flex: 1;
  background-color:${({theme})=>theme.bg};
  height: 100vh;
  color: ${({theme})=>theme.text};
  font-size: 14px;
  position: sticky;  
  top: 0;
`;

const Wrapper = styled.div`
  padding: 18px 26px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
  margin-bottom: 25px;
`;

const Img = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 50%;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 7.5px 0px;
  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Login = styled.div``;
const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Menu = ({ darkMode, setDarkMode }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const handleLogout = async() => {
    //e.preventDefault();
    dispatch(logout());
  };

    return (
      <Container>
        <Wrapper>
          <Logo>
            <Img src={realm} />
            REALM GAMING
          </Logo>

          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Item>
              <HomeIcon />
              HOME
            </Item>
          </Link>
          <Link
            to="trends"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Item>
              <HomeIcon />
              EXPLORE
            </Item>
          </Link>
          <Link
            to="subscriptions"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Item>
              <HomeIcon />
              FOLLOWING
            </Item>
          </Link>
          <Link
            to="myVideos"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Item>
              <VideocamIcon />
              YOUR VIDEOS
            </Item>
          </Link>
          <Hr />

          {!currentUser ? (
            <>
              <Login>
                Sign in to like videos, comment, and subscribe.
                <Link to="signin" style={{ textDecoration: "none" }}>
                  <Button>
                    <AccountCircleIcon />
                    SIGN IN
                  </Button>
                </Link>
              </Login>
              <Hr />
            </>
          ) : (
            <>
              <Button onClick={handleLogout}>
                <AccountCircleIcon />
                Logout
              </Button>
              <Hr />
            </>
          )}

          <Item>
            <LiveTvIcon />
            GO LIVE
          </Item>
          <Link
            to="history"
            style={{ textDecoration: "none", color: "inherit" }}
          >
          <Item>
            <HistoryIcon />
            HISTORY
          </Item>
          </Link>

          <Item>
            <SettingsIcon />
            SETTINGS
          </Item>
          <Hr />

          <Item>
            <ReportIcon />
            REPORT
          </Item>
          <Item onClick={() => setDarkMode(!darkMode)}>
            <LightModeIcon />
            {darkMode ? "LIGHT " : "DARK"}MODE
          </Item>
        </Wrapper>
      </Container>
    );
}

export default Menu;