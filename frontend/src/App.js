import React from 'react';
import './App.css';
import Header from './component/layout/Header/Header.js'
import {BrowserRouter as Router} from 'react-router-dom';
import WebfortLoader from 'webfontloader';
import Footer from './component/layout/Footer/Footer';



function App() {
  
  React.useEffect(()=>{
    WebfortLoader.load({
      google : {
        families : ["Roboto","Droid Sans","Chilanka"]
      }
    });
  },[]);
  
  return (
    <Router>
      <Header/>
      <Footer/>
    </Router>
  );
}

export default App;
