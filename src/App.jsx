import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './Pages/Home.jsx';
import SuperAdmin from './Pages/SuperAdmin/SuperAdmin.jsx';
import SuperAdminPortal from './Pages/SuperAdmin/SuperAdminPortal.jsx';
import StudentLogin from './Pages/Student/StudentLogin.jsx';
import AdminLogin from './Pages/Admin/AdminLogin.jsx';
import StudentRegister from './Pages/Student/StudentRegister.jsx';


function App() {
 return(
  <BrowserRouter>
  <Routes>
    <Route path='/' element={<Home/>}/>  {/*home page navigation*/} 
    <Route path='/superadmin' element={<SuperAdmin/>}/>    {/*superadmin login page navigation*/}
    <Route path='/superadmin/portal' element={<SuperAdminPortal/>}/> {/*superadmin portal page navigation*/}
    <Route path='/student/Studentlogin' element={<StudentLogin/>}/> {/*student login page navigation*/}
    <Route path='/admin/Adminlogin' element={<AdminLogin/>}/> {/*admin login page navigation*/}
    <Route path='/student/register' element={<StudentRegister/>}/> {/*student registration page navigation*/}
   
  </Routes>
  </BrowserRouter>
 )
}

export default App
