import { useContext, useState } from 'react';
import logo from '../assets/homelekic.png';
import Image from 'react-bootstrap/Image';
import { AppContext } from '../Context/AppContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCredential, getUserPostCreds } from '../api/posts';
import { useParams } from 'react-router-dom';

function CreateAgent() {
  const { id } = useParams();
  const { token } = useContext(AppContext);
  const [formData, setFormData] = useState({
    apartmentName: "",
    role: "",
    companyId: null,
    licenseId: null,
    propertyTitle: null,
    businessPermit: null,
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const { data: userCreds,  isError } = useQuery({
    queryKey: ["postsCreds", id],
    queryFn: () => getUserPostCreds(id, token),
    enabled: !!id, // Ensure the query runs only if ID exists
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ payload, token }) => createCredential(payload, token),
    onSuccess: (data) => {
      if (data.errors) {
        setErrors(data.errors);
      } else {
        setErrors({});
        setMessage("Credentials successfully submitted!");
        queryClient.invalidateQueries({ queryKey: ["postsCreds"] });
      }
    },
    onError: () => {
      setMessage("An error occurred. Please try again.");
    },
  });

  const handleSubmit = async () => {
    try {
      // Convert files to Base64 strings
      const base64Images = await Promise.all(
        ['companyId', 'licenseId', 'propertyTitle', 'businessPermit'].map(async (key) => {
          const file = formData[key];
          return file ? await toBase64(file) : null; // Convert only if file exists
        })
      );
  
      // Construct payload
      const payload = {
        apartmentName: formData.apartmentName,
        role: formData.role,
        companyId: base64Images[0],
        licenseId: base64Images[1],
        propertyTitle: base64Images[2],
        businessPermit: base64Images[3],
      };
  
      // Call the mutation to create credentials
      mutate({ payload, token });
    } catch (error) {
      setMessage("File processing error. Please check your inputs.");
      console.error("Error processing files:", error);
    }
  };
  
  const toBase64 = (file) => 
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result); // Result will be the full Base64 string
      reader.onerror = (error) => reject(error);
    });

  return (
    <div className="relative py-20 px-3 z-40 w-[500px] h-full bg-[#D9D9D9] rounded-2xl">
      <div className="flex justify-center mb-5">
        <Image src={logo} />
      </div>
      {message && <div className="text-center text-green-600">{message}</div>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-3"
      >
        {/* Role Selection */}
        {/* Role Selection */}
        {userCreds?.postCredential  == null ? (
         <>
          {/* Form Fields */}
        <div className="flex space-x-1 h-[50px]">
          <label htmlFor="apartment" className="whitespace-nowrap grid place-content-center px-2 rounded bg-white px-1">
            Company/Apartment Name
          </label>
          <input
            value={formData.apartmentName}
            onChange={(e) => setFormData({ ...formData, apartmentName: e.target.value })}
            placeholder="Enter company name"
            id="apartment"
            name="apartment"
            type="text"
          />
        </div>
          <select
            className="w-full h-[50px] text-center"
            id="dropdown"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="">-- Select an option --</option>
            <option value="Landlord">Landlord</option>
            <option value="Broker/Agent">Broker/Agent</option>
          </select>

        {/* Dynamic File Inputs */}
        {formData.role === 'Landlord' && (
          <>
            <div>
              <label htmlFor="property">Property Title</label>
              <input
                id="property"
                type="file"
                onChange={(e) => setFormData({ ...formData, propertyTitle: e.target.files[0] })}
              />
            </div>
            <div>
              <label htmlFor="business">Business Permit</label>
              <input
                id="business"
                type="file"
                onChange={(e) => setFormData({ ...formData, businessPermit: e.target.files[0] })}
              />
            </div>
          </>
        )}
        {formData.role === 'Broker/Agent' && (
          <>
            <div>
              <label htmlFor="license">Licensed ID</label>
              <input
                id="license"
                type="file"
                onChange={(e) => setFormData({ ...formData, licenseId: e.target.files[0] })}
              />
            </div>
            <div>
              <label htmlFor="option">Company ID</label>
              <input
                id="option"
                type="file"
                onChange={(e) => setFormData({ ...formData, companyId: e.target.files[0] })}
              />
            </div>
          </>
        )}
        {/* Submit Button */}
        <div className="left-[200px] absolute bottom-4">
          <button
            type="submit"
            className="text-white hover:bg-[#281d14] transition-all h-[34px] w-[113px] rounded-lg bg-[#4e3827]"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
        </>
        ) : (
          <div className='grid place-content-center'>
            We will continue working on it in the future.
            <br></br><br></br><br></br>&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Team Homosapiens
          </div>
        )}
      </form>
    </div>
  );
}

export default CreateAgent;