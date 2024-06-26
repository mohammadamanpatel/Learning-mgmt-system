import { BsFacebook, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";

function Footer() {
    const newDate = new Date();
    const year = newDate.getFullYear();

    return (
        <footer className="relative left-0 bottom-0 h-[10vh] py-5 flex flex-col sm:flex-row items-center justify-between sm:px-20 text-white bg-gray-800">
            <section className="text-lg text-center sm:text-left">
                Copyright {year} | All rights reserved
            </section>

            <section className="flex items-center justify-center sm:justify-end mt-4 sm:mt-0 text-2xl text-white">
                <a href="icon" className="hover:text-yellow-500 transition-all ease-in-out duration-300 mx-2">
                    <BsFacebook />
                </a>
                <a href="icon" className="hover:text-yellow-500 transition-all ease-in-out duration-300 mx-2">
                    <BsInstagram />
                </a>
                <a href="icon" className="hover:text-yellow-500 transition-all ease-in-out duration-300 mx-2">
                    <BsLinkedin />
                </a>
                <a href="icon" className="hover:text-yellow-500 transition-all ease-in-out duration-300 mx-2">
                    <BsTwitter />
                </a>
            </section>
        </footer>
    );
}

export default Footer;