import { useContext, useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import logo from '../../assets/homelekic.png'
import Image from 'react-bootstrap/Image';
import { useMutation } from "@tanstack/react-query";

const Login = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(AppContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleLogin = async (formData) => {

    const response = await fetch('/api/login', {
      method: "POST",
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    return data
  }

  const { mutate, isPending } = useMutation({
    mutationFn: ({formData}) => handleLogin(formData),
    onSuccess: (data) => {
      if (data.errors) {
        setErrors(data.errors); // Set errors from the JSON response
      } else {
        navigate('/')
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setErrors({}); // Clear errors
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      }
    }
  })

  return (
    <div className="container-bg h-[562px] w-[390px] z-50 rounded-2xl grid place-content-center">
      <div className="flex justify-center mb-[50px]">
        <Image
            className="m-0"
            src={logo} 
            alt="" 
          />
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="mb-[50px] mx-auto space-y-4 w-[280px]">
        <div>
          <input 
            type="text" 
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>
        <div>
          <input 
            type="password" 
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>

        <div className="flex justify-center">
          <button disabled={isPending} onClick={() => mutate({ formData })} className="text-[12px] h-[34px] w-[113px] bg-[#4e3827] rounded-full text-white">{isPending ? 'Loading...' : 'Login'}</button>
        </div>
        <div className="text-[14px] flex justify-center">
          <p>Don't have an account? <Link to='/register' className="underline text-blue-400">Register</Link></p>
        </div>
      </form>
    </div>
  )
}

export default Login