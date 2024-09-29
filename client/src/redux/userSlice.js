
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    loading: false,
    error:false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) =>{
        state.loading = true;
    },
    loginSuccess: (state,action) =>{
        state.loading = false;
        //updating the user.
        state.currentUser = action.payload;
    },
    loginFailure: (state) =>{
        state.loading = false;
        state.error = true;
    },
    logout: (state)=>{
        state.currentUser = null;
        state.loading = false;
        state.error = false;
    },
    subscription:(state,action)=>{
        if(state.currentUser.subscribedUsers.includes(action.payload)){
            state.currentUser.subscribedUsers.splice(
                state.currentUser.subscribedUsers.findIndex(
                    (channelId)=> channelId === action.payload
                ),
                1
            );
        }else{
            state.currentUser.subscribedUsers.push(action.payload);
        }
    },
    watchHistory:(state, action)=>{
        console.log(action.payload);
        if(!state.currentUser.watchedVideos.includes(action.payload)){
            state.currentUser.watchedVideos.push(action.payload);   
        }

        // if(state.currentUser.watchedVideos.includes(action.payload)){
        //     state.currentUser.watchedVideos.splice(
        //         state.currentUser.watchedVideos.findIndex(
        //             (channelId)=> channelId === action.payload
        //         ),
        //         1
        //     );
        // }else{
        //     state.currentUser.subscribedUsers.push(action.payload);
        // }
    }
  },
});

export const {loginStart,loginFailure,loginSuccess,logout, subscription, watchHistory} = userSlice.actions;

export default userSlice.reducer;
