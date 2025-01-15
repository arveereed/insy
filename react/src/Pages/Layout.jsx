import { useContext, useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import bg from '../assets/image.png'
import logo from '../assets/homelekic.png'
import Image from 'react-bootstrap/Image';
import { getUserPostCreds } from "../api/posts";

const Layout = () => {
  const { user, setUser, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const { data: userCreds, isLoading,  isError } = useQuery({
    queryKey: ["postsCreds", user?.id],
    queryFn: () => getUserPostCreds(user.id, token),
    enabled: !!user?.id, // Ensure the query runs only if ID exists
  });
  console.log(userCreds)

  const handleLogout = async (token) => {
    const response = await fetch('/api/logout', {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    return data
  }

  const { mutate, isPending } = useMutation({
    mutationFn: ({ token }) => handleLogout(token),
    onSuccess: () => {
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
      toggleDropdown()
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate('/login'); // Navigate to another page after successful creation
    }
  })

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative bg-slate-700">
        <Image
          className="absolute z-10 w-full h-full object-cover"
          src={bg} 
          alt="" 
        />
      <header className="relative bg-[#decaba] z-50 shadow-md">
        <nav>
          <Link to='/'><Image
          className="m-0 "
          src={logo} 
          alt="" 
        /></Link>
          {user 
            ? (
            <div className="text-slate-400 space-x-4 flex items-center">
              {userCreds?.postCredential && (
                <Link to="/create" className="bg-[#5C432E] hover:bg-[#281d14] transition-all text-white shadow-md h-[37px] w-[94px] grid place-content-center rounded font-light">
                  Post
                </Link>
              )}
              <div className="profile-menu relative z-50 text-black" ref={dropdownRef}>
                <button className={`hover:bg-[#281d14] ${isOpen ? 'bg-[#281d14]' : 'bg-[#5C432E]'} transition-all menu-button font-light h-[37px] w-[158px] shadow-md grid place-content-center`} onClick={toggleDropdown}>
                {user.firstname}
                </button>
                {isOpen && (
                  <div className="dropdown grid shadow-sm">
                    <a href="#edit-profile" className="transition">Edit Profile</a>
                    <Link to="/bookmark" className="transition">List Property</Link>
                    <Link to={`/create-agent-account/${user.id}`} className="transition">Create Agent/Landlord Account</Link>
                    <form onSubmit={(e) => e.preventDefault()}>
                      <button className="w-full transition-all" onClick={() => mutate({ token })}>{isPending ? 'Loading..' : 'Logout'}</button>
                    </form>
                  </div>
                )}
              </div>
            </div>
              )
            : (
            <div className="space-x-4">
              <Link to='/register' >
                <button className="nav-link shadow-md">
                  Register
                </button>
              </Link>
              <Link to='/login' >
                <button className="nav-link shadow-md">
                  Login
                </button>
              </Link>
            </div>
            )}
        </nav>
      </header>
      <main className="grid place-content-center min-h-screen">
        <Outlet/>
      </main>
    </div>
  )
}

export default Layout