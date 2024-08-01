import React from 'react';
import { Link } from 'react-router-dom';
import { HomeLayout } from '../layouts/HomeLayout';
import homePageMainImage from '../Assests/Images/homePageMainImage.png';

const Home = () => {
    return (
        <HomeLayout>
            <div className="pt-10 text-white flex flex-col md:flex-row items-center justify-center gap-10 mx-6 md:mx-16 h-[90vh]">
            <div className="w-full md:w-1/2 flex items-center justify-center">
                    <img src={homePageMainImage} alt="home page" className="max-w-full h-auto" />
                </div>
                <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-semibold">
                        Find out the best <span className="text-yellow-500 font-bold">Online courses</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200">
                        We have a large library of courses taught by highly skilled and qualified faculties at a very affordable cost.
                    </p>
                    <div className="space-y-4 md:space-x-6 md:space-y-0 flex flex-col md:flex-row">
                        <Link to="/courses">
                            <button className="bg-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300 w-full md:w-auto">
                                Explore courses
                            </button>
                        </Link>
                        <Link to="/contact">
                            <button className="border border-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300 w-full md:w-auto">
                                Contact Us
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
};

export default Home;
