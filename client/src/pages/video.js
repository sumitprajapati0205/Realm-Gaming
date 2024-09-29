import React, { useEffect,useState } from "react";
import styled from "styled-components";
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import Comments from "../components/comments";
import Card from "../components/card";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { fetchFailure,fetchSuccess,fetchStart,like,dislike } from "../redux/videoSlice";
import { subscription, watchHistory} from "../redux/userSlice";
import { format } from "timeago.js";
import Recommendation from "../components/Recommendation";


const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;


const Account = styled.div`
  display: flex;
  justify-content: space-between;
`;

const AccDetails = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Follow = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;
const VideoFrame = styled.video`
  max-height: 420px;
  width: 100%;
  object-fit: cover;
`

const Video = () => {
  const {currentUser} = useSelector(state=>state.user);
  const {currentVideo} = useSelector((state)=>state.video);
  const dispatch = useDispatch();

  const path = useLocation().pathname.split("/")[2];
  //we won't use usestate here as on liking etc. changes will be shown after refreshing the page
  //to do it dynamically we will use videoSlice.
  //const [video,setVideo] = useState({});
  const [channel,setChannel] = useState({});
  
  useEffect(()=>{
    const fetchData = async ()=>{
      try {
        const videoRes = await axios.get(`/videos/find/${path}`);
        const channelRes = await axios.get(`/users/find/${videoRes.data.userId}`);
        //setVideo(videoRes.data);
        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
        
      } catch (err) {
       
      }
    }
    fetchData();
  },[path,dispatch])

  const handleHistory = async ()=>{
    await axios.put(`/users/history/${currentVideo._id}`);
    dispatch(watchHistory(currentUser._id));
  }

  const handleLike = async ()=>{
    await axios.put(`/users/like/${currentVideo._id}`)
    dispatch(like(currentUser._id));
  };

  const handleDislike = async () => {
    await axios.put(`/users/dislike/${currentVideo._id}`);
    dispatch(dislike(currentUser._id));
  };

  const handleSubscribe = async()=>{
    currentUser.subscribedUsers.includes(channel._id)
    ? await axios.put(`/users/unsub/${channel._id}`)
    : await axios.put(`/users/sub/${channel._id}`);
    dispatch(subscription(channel._id));
  }
  
  return (
    <Container onLoad={handleHistory} >
      <Content>
        <VideoWrapper>
          <VideoFrame src={currentVideo && currentVideo.videoUrl} controls />
        </VideoWrapper>
        <Title>{currentVideo && currentVideo.title}</Title>
        <Details>
          <Info>
            {currentVideo && currentVideo.views} views •{" "}
            {format(currentVideo && currentVideo.createdAt)}
          </Info>
          {currentUser?<>
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo &&
              currentVideo.likes?.includes(currentUser?._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}{" "}
              {currentVideo && currentVideo.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
              {currentVideo &&
              currentVideo.dislikes?.includes(currentUser?._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}{" "}
              Dislike
            </Button>
            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
          </>
          :<></>
          }
        </Details>
        <Hr />
        <Account>
          <AccDetails>
            <Image src={channel.img} />
            <ChannelDetail>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>{channel.subscribers} followers</ChannelCounter>
              <Description>{currentVideo && currentVideo.desc}</Description>
            </ChannelDetail>
          </AccDetails>

          {currentUser ? (
            <>
              <Follow onClick={handleSubscribe}>
                {currentUser.subscribedUsers?.includes(channel._id)
                  ? "Followed"
                  : "Follow"}
              </Follow>
            </>
          ) : (
            <></>
          )}
        </Account>
        <Hr />
        {/* <Comments videoId={currentVideo && currentVideo._id} /> */}
      </Content>
      <Recommendation tags={currentVideo && currentVideo.tags}></Recommendation>
    </Container>
  );
};

export default Video;