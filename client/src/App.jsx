import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import RequiredAuth from './components/Auth/requiredAuth';

// Lazy-load routes that are not wrapped by RequiredAuth
const Home = React.lazy(() => import('./pages/Home'));
const AboutUs = React.lazy(() => import('./pages/AboutUs'));
const SignUp = React.lazy(() => import('./pages/signupPage'));
const Login = React.lazy(() => import('./pages/LoginPage'));
const CourseList = React.lazy(() => import('./pages/Courses/CourseList'));
const Contact = React.lazy(() => import('./pages/contactus'));
const CourseDescription = React.lazy(() => import('./pages/Courses/CourseDescription'));
const Denied = React.lazy(() => import('./pages/Denied'));
const ProfilePage = React.lazy(() => import('./pages/profilePage'));
const EditProfile = React.lazy(() => import('./pages/EditProfile'));
const CheckoutSuccess = React.lazy(() => import('./pages/payment/CheckoutSuccess'));
const CheckoutFailure = React.lazy(() => import('./pages/payment/CheckoutFailure'));
const Checkout = React.lazy(() => import('./pages/payment/checkout'));
const DisplayLectures = React.lazy(() => import('./pages/Dashboard/showAllLectures'));
const AddLectures = React.lazy(() => import('./pages/Dashboard/Addlectures'));
const AdminDashboard = React.lazy(() => import('./pages/Dashboard/AdminDashboard'));
const CreateCourse = React.lazy(() => import('./pages/Courses/CourseCreate'));

// Fallback UI component

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Routes not protected by RequiredAuth */}
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<AboutUs />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/courses' element={<CourseList />} />
          <Route path='/course/description' element={<CourseDescription />} />
          <Route path='/denied' element={<Denied />} />
          <Route path='/contact' element={<Contact />} />

          {/* Protected routes */}
          <Route element={<RequiredAuth allowedRoles={["ADMIN"]} />}>
            <Route path="/course/create" element={<CreateCourse />} />
            <Route path='/course/addLectures' element={<AddLectures />} />
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
          </Route>

          <Route element={<RequiredAuth allowedRoles={["ADMIN", "USER"]} />}>
            <Route path="/user/profile" element={<ProfilePage />} />
            <Route path="/user/editProfile" element={<EditProfile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/fail" element={<CheckoutFailure />} />
            <Route path='/course/showLectures' element={<DisplayLectures />} />
          </Route>
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}

export default App;
