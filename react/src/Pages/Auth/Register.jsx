import { useContext, useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { useMutation } from "@tanstack/react-query";
import logo from '../../assets/homelekic.png'
import Image from 'react-bootstrap/Image';

const Register = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(AppContext);

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const [errors, setErrors] = useState({});

  const handleRegister = async (formData) => {
    const response = await fetch('/api/register', {
      method: "POST",
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    return data
  }

  const { mutate, isPending } = useMutation({
    mutationFn: ({formData}) => handleRegister(formData),
    onSuccess: (data) => {
      if (data.errors) {
        setErrors(data.errors); // Set errors from the JSON response
      } else {
        console.log(data)
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setErrors({}); // Clear errors
        setFormData({
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          password_confirmation: ''
        });
        navigate("/"); // Navigate to another page after successful creation
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      }
    }
  })

  return (
    <div className=" container-bg h-[562px] w-[390px] z-50 rounded-2xl grid place-content-center ">
      <div className="flex justify-center mb-[50px]">
        <Image
            className="m-0"
            src={logo} 
            alt="" 
          />
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="mx-auto space-y-4 mb-[50px]" action="">
        <div className="flex w-[280px] space-x-2">
          <div>
            <input 
              type="text" 
              placeholder="First Name"
              value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
            />
            {errors.firstname && <div className="error">{errors.firstname}</div>
            }
          </div>
          <div>
            <input 
              type="text" 
              placeholder="Last Name"
              value={formData.lastname}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
            />
            {errors.lastname && <div className="error">{errors.lastname}</div>
            }
          </div>
        </div>
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
        <div>
          <input 
            type="password" 
            placeholder="Confirm Password"
            value={formData.password_confirmation}
            onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
          />
        </div>
        
        <div className="flex justify-center">
          <button disabled={isPending} onClick={() => mutate({ formData })} className="text-[12px] h-[34px] w-[113px] bg-[#4e3827] rounded-full text-white">{isPending ? 'Loading...' : 'Register'}</button>
        </div>
        <div className="text-[14px] flex justify-center">
          <p>Already have an account? <Link to='/login' className="underline text-blue-400">Login</Link></p>
        </div>
      </form>
    </div>
  )
}

export default Register