import React, { useEffect,useState } from "react";
import styled from "styled-components";
import app from "../firebase"
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  connectStorageEmulator,
} from "firebase/storage";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createNextState } from "@reduxjs/toolkit";


const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  background-color: ${({theme})=> theme.bgLighter};
  color: ${({theme})=>theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 20px;
`

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 15px;
  cursor: pointer;
`
const Title = styled.h1`
  text-align: center;
`

const Input = styled.input`
  border: 1px solid ${({theme})=>theme.soft};
  color: ${({theme})=>theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`
const Desc = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;
const Button = styled.button`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.soft};
  border: none;
  font-weight: 500;
  color: ${({ theme }) => theme.textsoft};
  border-radius: 3px;
  cursor: pointer;
`

const Label = styled.label`
  font-size: 14px;
`

const Upload =({setOpen})=>{
    const [img,setImg] = useState(undefined);
    const [video, setVideo] = useState(undefined);
    const [imgPerc, setImgPerc] = useState(0);
    const [videoPerc, setVideoPerc] = useState(0);
    const [inputs, setInputs] = useState({});
    const [tags, setTags] = useState([]);
    
    const navigate = useNavigate();
    
    const handleChange = (e) =>{
        setInputs((prev)=>{
            //it will take prev desc/title etc and change its value to e.target.value
            return {...prev,[e.target.name]: e.target.value};
        })
    }

    

    const handleTags = (e)=> {
        setTags(e.target.value.split(","));
    }
    const uploadFile = (file, urlType) =>{
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', 
        (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        //progress keeps the percentage of file uploaded. 
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        urlType === "imgUrl" ? setImgPerc(Math.round(progress)):setVideoPerc(Math.round(progress));
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log("Upload is running");
            break;
          default:
            break;
        }
        }, 
        (error) => {},
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          //console.log('File available at', downloadURL);
          setInputs((prev) => {
            return { ...prev, [urlType]: downloadURL };
          });
          });
        }
        )
    };

    useEffect(()=>{
        video && uploadFile(video, "videoUrl")
    },[video]);
    useEffect(() => {
        img && uploadFile(img, "imgUrl")
    }, [img]);

    const handleUpload = async (e) => {
      e.preventDefault();
      try{
        const res = await axios.post("/videos", { ...inputs,tags });
        setOpen(false);

        navigate(`/video/${res.data._id}`);
      }
      catch(error){
        console.log(error.response.data);
      }
      
      
    };

    return (
      <Container>
        <Wrapper>
          <Close onClick={() => setOpen(false)}>X</Close>
          <Title>Upload a new Video</Title>
          {/* this will accept video only */}
          <Label>Video:</Label>
          {videoPerc > 0 ? (
            "Uploading: " + videoPerc+"%"
          ) : (
            <Input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
            ></Input>
          )}
          <Input
            type="text"
            placeholder="Title"
            name="title"
            onChange={handleChange}
          ></Input>
          <Desc
            placeholder="description of the video"
            name="desc"
            rows={8}
            onChange={handleChange}
          ></Desc>
          <Input
            type="text"
            placeholder="Seperate the tags with commas."
            onChange={handleTags}
          ></Input>
          <Label>Image:</Label>
          {imgPerc > 0 ? (
            "Uploading: " + imgPerc+ "%"
          ) : (
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImg(e.target.files[0])}
          ></Input>
          )}
          <Button onClick={handleUpload}>Upload</Button>
        </Wrapper>
      </Container>
    );
}

export default Upload;