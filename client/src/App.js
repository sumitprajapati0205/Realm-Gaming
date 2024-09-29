import styled, { ThemeProvider } from "styled-components";
import Menu from "./components/menu";
import Navbar from "./components/Navbar";
import SignIn from "./pages/SignIn";
import { darkTheme, lightTheme } from "./utils/theme";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Video from "./pages/video";
import Search from "./pages/Search";

const Container=styled.div`
display:flex;
`;
const Main=styled.div`
flex:7;
background-color: ${({ theme }) => theme.bg};
`;

const Wrapper = styled.div`
  padding: 22px 96px;
`;

function App(){
  const [darkMode, setDarkMode] = useState(true);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <BrowserRouter>
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
          <Main>
            <Navbar />
            <Wrapper>
              <Routes>
                <Route path="/">
                  <Route index element={<Home type="random" />} />
                  <Route path="trends" element={<Home type="trend" />} />
                  <Route path="subscriptions" element={<Home type="sub" />} />
                  <Route path="myVideos" element={<Home type="myVideo" />} />
                  <Route path="search" element={<Search />} />
                  <Route path="signin" element={<SignIn />} />
                  <Route path="history" element={<Home type="history" />} />
                  <Route path="video">
                    <Route path=":id" element={<Video />} />
                  </Route>
                </Route>
              </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;