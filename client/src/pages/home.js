import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Card from "../components/card";
import axios from "axios"

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

//usestate gives the initial state, videos and setVideos are state variables.
//here videos have the initial empty array, setVideos will have the updated one.
const Home = ({type}) => {
  const [videos, setVideos] = useState([]);
  //whenever we refresh the page, useeffect function is run, it runs only once.
  //here useeffect take second parameter, whenever the parameter 'type' changes useeffect function is called.  
  useEffect(()=>{
    const fetchVideos = async ()=>{
      //axios,common method to communicate with the database and backend in React.
      const res = await axios.get(`/videos/${type}`);
      
      //here setVideos is updated.
      setVideos(res.data);
    }
    fetchVideos() 
  },[type]);

  return (
    <Container>
    {
      //when we use map, give a unique key
      videos.map((video)=>(
      <Card key={video._id} video={video}/>
      ))
    }
    </Container>
  );
};

export default Home;