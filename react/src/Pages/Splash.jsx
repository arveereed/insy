import Image from 'react-bootstrap/Image';
import logo from '../assets/homelekic.png'

export const Splash = () => {
  return (
    <div className="min-h-screen grid place-content-center bg-[#281d14]">
      <Image
          src={logo} 
          alt="" 
        />
    </div>
  )
}
