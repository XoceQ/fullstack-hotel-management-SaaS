import Link from 'next/link';
import {BsFillSendFill, BsTelephoneOutbound} from "react-icons/bs";
import {BiMessageDetail} from "react-icons/bi";

const Footer = () => {
    return (
        <footer id="footer" className='mt-16'>
                <div className='container mx-auto px-4'>
                    <Link href='/' className='font-black text-tertiary-dark'>
                        Hotel App
                    </Link>
                    <h4 className='font-semibold text-[40px] py-6 '>Contacto</h4>

                    <div className='flex flex-wrap gap-16 items-center justify-between'>
                        <div className='flex-1'>
                            <p> Tv. 16a #45F-16, Bogotá D.C</p>
                            <div className='flex items-center py-4'>
                                <BsFillSendFill/>
                                <p className="ml-2">Kosecode</p>
                            </div>
                            <div className='flex items-center '>
                                <BsTelephoneOutbound/>
                                <p className="ml-2">315-399-32-02</p>
                            </div>
                            <div className='flex items-center py-4'>
                                <BiMessageDetail/>
                                <p className="ml-2">dcurbanxtreme@gmail.com</p>
                            </div>
                        </div>
                        <div className="flex-1 md-text-right">
                            <p className="pb-4">Nosotros</p>
                            <p className="pb-4">Ponte en contacto</p>
                            <p className="pb-4">Nuestro compromiso con la privacidad</p>
                            <p className="pb-4">Términos del servicio</p>

                        </div>
                        <div className='flex-1 md:text-right'>
                            <p className='pb-4'>Experiencia gastronómica</p>
                            <p className='pb-4'>Bienestar</p>
                            <p className='pb-4'>Acondicionamiento físico</p>
                            <p className='pb-4'>Deportes</p>
                            <p>Eventos</p>
                        </div>
                    </div>
                </div>
            <div className='bg-tertiary-light h-10 md:h-[70px] mt-16 w-full bottom-0 left-0'></div>
        </footer>
    );
};
export default Footer;