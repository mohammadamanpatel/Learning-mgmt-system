import logo from './logo.svg';
import './App.css';
import Footer from './components/Footer';
import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { AboutUs } from './pages/AboutUs'
import Notfound from './pages/NotFoundPage'
import { SignUp } from './pages/signupPage'
import { Login } from './pages/LoginPage';
import CourseList from './pages/Courses/CourseList';
import Contact from './pages/contactus';
import { CourseDescription } from './pages/Courses/CourseDescription';
import RequiredAuth from './components/Auth/requiredAuth'
import CreateCourse from './pages/Courses/CourseCreate'
import Denied from './pages/Denied';
import ProfilePage from './pages/profilePage'
import EditProfile from './pages/EditProfile';
import  CheckoutSuccess  from './pages/payment/CheckoutSuccess';
import  CheckoutFailure  from './pages/payment/CheckoutFailure';
import Checkout from './pages/payment/checkout';
import  DisplayLectures  from './pages/Dashboard/showAllLectures';
import Addlectures  from './pages/Dashboard/Addlectures';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home></Home>} />
        <Route path='/about' element={<AboutUs></AboutUs>} />
        <Route path='*' element={<Notfound></Notfound>} />
        <Route path='/signup' element={<SignUp></SignUp>}></Route>
        <Route path='/login' element={<Login />} />
        <Route path='/courses' element={<CourseList />} />
        <Route path="/course/description" element={<CourseDescription />} />
        <Route element={<RequiredAuth allowedRoles={["ADMIN"]} />}>
          <Route path="/course/create" element={<CreateCourse />} />
          <Route path='/course/AddLectures' element={<Addlectures/>}/>
          <Route path='/Admin/Dashboard' element={<AdminDashboard/>}/>
        </Route>
        <Route element={<RequiredAuth allowedRoles={["ADMIN", "USER"]} />}>
          <Route path="/user/profile" element={<ProfilePage />} />
          <Route path="/user/EditProfile" element={<EditProfile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/fail" element={<CheckoutFailure />} />
          <Route path='/course/showLectures' element={<DisplayLectures/>}/>
        </Route>
        <Route path='/denied' element={<Denied />} />
        <Route path='/contact' element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
