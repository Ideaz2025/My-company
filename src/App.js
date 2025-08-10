import './App.css';

import {

  Routes,
  Route,

} from "react-router-dom";
import ThemeSCignInPage from './component/login';
import DashboardLayoutBasic from './component/Dashboard.js';
import SignUp from './component/Signip';
import Home from './component/home';
import  LinearProgress1  from './component/service.js';
import Contactus from './component/contact.js';
import Aboutus from './component/aboutus.js';
import From from './component/register.js';
import Sitemap from './component/sitemaps.xml';
import PrivacyPolicy from './component/privacy.js';
import TermsOfService from './component/terms.js';
import Cookies from './component/cookies.js';

// 
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<DashboardLayoutBasic/>} />
        <Route path="/dashboard" element={<DashboardLayoutBasic/>} />
        <Route path="/learning" element={<DashboardLayoutBasic/>} />
        <Route path="/daystreak" element={<DashboardLayoutBasic/>} />
        <Route path="/course" element={<DashboardLayoutBasic/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/login" element={<ThemeSCignInPage/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/services" element={<LinearProgress1/>}/>
        <Route path="/contactus" element={<Contactus/>}/>
        <Route path="/aboutus" element={<Aboutus/>}/>
        <Route path="/form" element={<From/>}/>
        <Route path="/sitemap" element={<Sitemap/>}/>
        <Route path="/privacy" element={<PrivacyPolicy/>}/>
        <Route path="/term and service" element={<TermsOfService/>}/>
      </Routes>
      <Cookies/>
    </div>
  );
}

export default App;
