import React,{useState,useEffect} from "react";
import styled from "styled-components";
import Comment from "./comment";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { commentSuccess } from "../redux/commentSlice";
import { useDispatch } from "react-redux";



const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const Comments = ({videoId}) => {
  const dispatch = useDispatch();
  const { currentComment } = useSelector((state)=>state.comment);
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const path = useLocation().pathname.split("/")[2];
  const [inputValue, setInputValue] = useState("");

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/comments/${videoId}`);

      setComments(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const handleUserInput = (e) => {
    setInputValue(e.target.value);
  };
  
  const handleAddComment= async(text)=>{
     try {
       const resc = await axios.post("/comments",{
        videoId:path,
        desc: text
      });
      dispatch(commentSuccess(resc.data));
      //console.log({text});
      setInputValue("");
     } catch (err) {
       console.log(err);
     }
  }
  
  return (
    <Container>
      {currentUser ? (
        <>
          <NewComment>
            <Avatar src={currentUser.img} />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const com = e.target[0].value;
                handleAddComment(com);
                fetchComments();
              }}
            >
              <Input
                value={inputValue}
                onChange={handleUserInput}
                placeholder="Add a comment..."
              />
            </form>
          </NewComment>
          {currentComment && currentComment.videoId === path ? (
            <Comment key={currentComment._id} comment={currentComment} />
          ) : (
            <></>
          )}
          {comments.map((comment) =>
            currentComment && currentComment._id === comment._id ? (
              <></>
            ) : (
              <Comment key={comment._id} comment={comment} />
            )
          )}
        </>
      ) : (
        <></>
      )}
    </Container>
  );
};

export default Comments;