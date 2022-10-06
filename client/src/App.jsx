import React, { useState, useEffect, useRef } from "react";
import Header from "./widgets/Header";
import Footer from "./widgets/Footer";
import UploadPage from './pages/UploadPage';
import MultiBtn from './components/MultiBtn';
import EditWord from './components/EditWord';
import Layout from './components/Layout';

import {Route, Routes} from "react-router-dom";
import SetcsPage from './pages/SetcsPage';
import WordPage from './pages/WordPage';

// import ReduxTest from './components/ReduxTest'

const App = () => {

  return (
    
      <Routes>
        {/* <Route path={"/"} element={<HomePage/>}/> */}
        <Route path={"/"} element={<Layout><WordPage /></Layout>} /> 
        <Route path={"/Word"}  element={<Layout><WordPage /></Layout>}/>
        <Route path={"/Setcs"} element={<Layout><SetcsPage /></Layout>} />
        <Route path={"/Radio"} element={<Layout><WordPage /></Layout>}/>
        <Route path={"/Set"} element={<Layout><WordPage /></Layout>}/>
        <Route path={"/upload"} element={ <UploadPage /> } />
        {/* <Route path={"auth-form"} element={<AuthPage/>}/>
        <Route path={"forminfo"} element={<NeedAuth><ProfilePage/></NeedAuth>}/> */}
      </Routes>
      // {/* <Header /> */}
      // {/* <ReactQueryTest /> */}
      // {/* <ReduxTest /> */}
      // {/* <ReactQuery /> */}
      // {/* <Main /> */}

      // {/* <EditWord /> */}
      // {/* <Footer /> */}
    
  );
}

export default App;