import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { loginFailure, loginSuccess, loginStart } from "../redux/userSlice";
import {auth,provider} from "../firebase.js";
import {signInWithPopup} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content:center;
    flex-direction: column;
    color: ${({theme}) => theme.text};
    height: calc(100vh - 56px);
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
`;

const Title = styled.h1`
font-size: 24px;
`

const Input = styled.input`
    border: 1px solid ${({theme})=>theme.soft};
    border-radius: 3px;
    color: ${({theme}) => theme.text};
    background-color: transparent;
    padding: 10px;
    width: 100%;
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;
//to add forgot password
const SignIn = () =>{
    const navigate = useNavigate();
    const [name,setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    //to use dispatch function from redux-toolkit
    const dispatch = useDispatch();

    const handleLogin = async(e) =>{
        //it prevent refreshing of page on clicking signin button.
        e.preventDefault();
        dispatch(loginStart());

        try {
          //here we are making a request and sending name amd password.
            const res = await axios.post("/auth/signin",{name,password});
            dispatch(loginSuccess(res.data));
            navigate(`/`);
        } catch (err) {
            dispatch(loginFailure());
        }
    }
    const signInWithGoogle = async () => {
    
      dispatch(loginStart());
      signInWithPopup(auth, provider)
        .then((result) => {
           console.log(result);
          axios
            .post("/auth/google", {
              name: result.user.displayName,
              email: result.user.email,
              img: result.user.photoURL,
            }
            )
            .then((res) => {
              dispatch(loginSuccess(res.data));
            });
            navigate(`/`);
        })
        .catch((err) => {
          loginFailure();
        });
    }; 

    const handleSignup = async(e) =>{
      //it prevent refreshing of page on clicking signin button.
      e.preventDefault();
      dispatch(loginStart());

      try {
        //here we are making a request and sending name amd password.
          const res = await axios.post("/auth/signup",{name,email,password});
          dispatch(loginSuccess(res.data));
          navigate(`/`);
      } catch (err) {
          dispatch(loginFailure());
      }
  }

    return (
      <Container>
        <Wrapper>
          <Title>SignIn</Title>
          <Input
            placeholder="username"
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleLogin}>SignIn</Button>
          <Title>or</Title>
          <Button onClick={signInWithGoogle}>SignInwithGoogle</Button>

          <Title>or</Title>
          <Input
            placeholder="username"
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleSignup}>SignUp</Button>
        </Wrapper>
      </Container>
    );
}

export default SignIn;