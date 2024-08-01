import aboutMainPage from '../Assests/Images/aboutMainImage.png';
import apj from "../Assests/Images/apj.png";
import billGates from "../Assests/Images/billGates.png";
import nelsonMandela from "../Assests/Images/nelsonMandela.png";
import steveJobs from "../Assests/Images/steveJobs.png";
import {HomeLayout} from "../layouts/HomeLayout";

const AboutUs = () => {
    return (
        <HomeLayout>
        <div className="flex flex-col text-white pl-4 md:pl-20 pt-10 md:pt-20">
          <div className="flex flex-col md:flex-row items-center gap-5 mx-4 md:mx-10">
            <section className="w-full md:w-1/2 space-y-6">
              <h1 className="text-3xl md:text-5xl text-yellow-500 font-semibold">
                Affordable and Quality Education
              </h1>
              <p className="text-lg md:text-xl text-gray-200">
                Our goal is to provide affordable and quality education to the world. We provide a platform for aspiring teachers and students to share their skills, creativity, and knowledge to empower and contribute to the growth and wellness of mankind.
              </p>
            </section>
            <div className="w-full md:w-1/2">
              <img
                src={aboutMainPage}
                className="w-full h-auto drop-shadow-2xl"
                alt="about main page"
              />
            </div>
          </div>
          <div className="carousel w-full md:w-1/2 my-10 mx-auto overflow-hidden">
            <div id="slide1" className="carousel-item relative w-full">
              <div className='flex flex-col items-center justify-center gap-4 px-4 md:px-[15%]'>
                <img src={apj} className="w-40 md:w-48 rounded-full border-2 border-gray-400" alt="APJ Abdul Kalam" />
                <p className='text-base md:text-xl text-gray-200 text-center px-2'>
                  Teaching is a very noble profession that shapes the character, caliber, and future of an individual.
                </p>
                <h3 className='text-lg md:text-2xl font-semibold text-center'>APJ Abdul Kalam</h3>
                <div className="absolute flex justify-between transform -translate-y-1/2 left-2 md:left-5 right-2 md:right-5 top-2 md:top-1/2">
                  <a href="#slide4" className="btn btn-circle">❮</a>
                  <a href="#slide2" className="btn btn-circle">❯</a>
                </div>
              </div>
            </div>
            <div id="slide2" className="carousel-item relative w-full">
              <div className='flex flex-col items-center justify-center gap-4 px-4 md:px-[15%]'>
                <img src={steveJobs} className="w-40 md:w-48 rounded-full border-2 border-gray-400" alt="Steve Jobs" />
                <p className='text-base md:text-xl text-gray-200 text-center px-2'>
                  We don't get a chance to do that many things, and every one should be really excellent.
                </p>
                <h3 className='text-lg md:text-2xl font-semibold text-center'>Steve Jobs</h3>
                <div className="absolute flex justify-between transform -translate-y-1/2 left-2 md:left-5 right-2 md:right-5 top-2 md:top-1/2">
                  <a href="#slide1" className="btn btn-circle">❮</a>
                  <a href="#slide3" className="btn btn-circle">❯</a>
                </div>
              </div>
            </div>
            <div id="slide3" className="carousel-item relative w-full">
              <div className='flex flex-col items-center justify-center gap-4 px-4 md:px-[15%]'>
                <img src={billGates} className="w-40 md:w-48 rounded-full border-2 border-gray-400" alt="Bill Gates" />
                <p className='text-base md:text-xl text-gray-200 text-center px-2'>
                  Success is a lousy teacher. It seduces smart people into thinking they can't lose.
                </p>
                <h3 className='text-lg md:text-2xl font-semibold text-center'>Bill Gates</h3>
                <div className="absolute flex justify-between transform -translate-y-1/2 left-2 md:left-5 right-2 md:right-5 top-2 md:top-1/2">
                  <a href="#slide2" className="btn btn-circle">❮</a>
                  <a href="#slide4" className="btn btn-circle">❯</a>
                </div>
              </div>
            </div>
            <div id="slide4" className="carousel-item relative w-full">
              <div className='flex flex-col items-center justify-center gap-4 px-4 md:px-[15%]'>
                <img src={nelsonMandela} className="w-40 md:w-48 rounded-full border-2 border-gray-400" alt="Nelson Mandela" />
                <p className='text-base md:text-xl text-gray-200 text-center px-2'>
                  Education is the most powerful tool you can use to change the world.
                </p>
                <h3 className='text-lg md:text-2xl font-semibold text-center'>Nelson Mandela</h3>
                <div className="absolute flex justify-between transform -translate-y-1/2 left-2 md:left-5 right-2 md:right-5 top-2 md:top-1/2">
                  <a href="#slide3" className="btn btn-circle">❮</a>
                  <a href="#slide1" className="btn btn-circle">❯</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HomeLayout>
      );
}
export default AboutUs
