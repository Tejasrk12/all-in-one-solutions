import {Route, Routes} from 'react-router-dom';
import Navbar from './component/Navbar';
import Home from './pages/Home';
import ConvertText from './pages/Convert-Text';
import WhitespaceRemover from './pages/Whitespace-Remover';
import HTMLFormatter from './pages/HTML-Formatter';
import CssFormatter from './pages/Css-Formatter';
import JsFormatter from './pages/Js-Formatter';
import CompareCode from './pages/Compare-Code';
import CompareText from './pages/Compare-Text';
import ScssFormatter from './pages/Scss-Formatter';
import HeicToJpg from './pages/HeicToJpg';
import CompressImages from './pages/Compress-Images';
import PageNotFound from './pages/Page-Not-Found';
import JpgToWebp from './pages/JpgToWebp';
// import MovToMp4 from './pages/MovToMp4';
import Footer from './component/Footer';

export default function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route exact path='/' element={<Home/>}/>
       
        <Route>
          <Route exact path='/Convert-Text' element={<ConvertText/>}/>
          <Route exact path='/Compare-Text' element={<CompareText/>}/>
        </Route>

        <Route>
          <Route exact path='/HTML-Formatter' element={<HTMLFormatter/>}/>
          <Route exact path='/Css-Formatter' element={<CssFormatter/>}/>
          <Route exact path='/Js-Formatter' element={<JsFormatter/>}/>
          <Route exact path='/Scss-Formatter' element={<ScssFormatter/>}/>
          <Route exact path='/Compare-Code' element={<CompareCode/>}/>
        </Route>

        <Route>
          <Route exact path='/HeicToJpg' element={<HeicToJpg/>}/>
          <Route exact path='/JpgToWebp' element={<JpgToWebp/>}/>
          {/* <Route exact path='/MovToMp4' element={<MovToMp4/>}/> */}
          <Route exact path='/Compress-Images' element={<CompressImages/>}/>
        </Route>
        
        <Route path='*' element={<PageNotFound/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}

