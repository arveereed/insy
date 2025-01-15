import React, { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createPost } from "../../api/posts";

const Create = () => {
  const { token } = useContext(AppContext);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    images: [], // Store multiple images
    offerType: "", // Track offer type
    propertyType: "", // Track property type
    bedrooms: '',
    bathrooms: '',
    floorSquaremeter: '',
    lotSquaremeter: '',
    address: '',
    price: '',
    sellerName: '',
    email: '',
    mobileNumber: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ payload, token }) => createPost(payload, token),
    onSuccess: (data) => {
      if (data.errors) {
        setErrors(data.errors);
        console.log(data.errors)
      } else {
        setErrors({});
        navigate("/");
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert all images to Base64
    const base64Images = await Promise.all(
      formData.images.map((file) => toBase64(file))
    );

    // Prepare JSON payload
    const payload = {
      title: formData.title,
      body: formData.body,
      images: base64Images, // Include Base64 strings
      offerType: formData.offerType,
      propertyType: formData.propertyType,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      floorSquaremeter: formData.floorSquaremeter,
      lotSquaremeter: formData.lotSquaremeter,
      address: formData.address,
      price: formData.price,
      sellerName: formData.sellerName,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
    };

    // Call mutate with JSON payload
    mutate({ payload, token });
  };

  // Utility function to convert file to Base64
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="relative px-[80px] pt-[30px] pb-[80px] mt-4 mb-4 container-bg w-[868px] z-40 rounded-2xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-[16px]">
        <div className="flex w-[80%] gap-8">
          <span className="ml-20">Title</span>
          <input
            id="title"
            className="h-[26px]"
            type="text"
            placeholder="Post Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          {errors.title && <div className="error">{errors.title[0]}</div>}
        </div>

        {/* Offer Type */}
        <div className="flex gap-8">
          <span className="ml-7">Offer Type</span>
          <div className="space-x-3 flex">
            {["Sale", "Rent"].map((type) => (
              <div
                key={type}
                className={`w-[205px] text-center py-2 rounded-md cursor-pointer ${
                  formData.offerType === type ? "bg-[#5C432E] text-white" : "bg-gray-200"
                }`}
                onClick={() => setFormData({ ...formData, offerType: type })}
              >
                {type}
              </div>
            ))}
            {errors.offerType && <div className="error">{errors.offerType[0]}</div>}
          </div>
        </div>

        {/* Property Type */}
        <div className="flex gap-8">
          <span>Property Type</span>
          <div className="space-x-3 flex">
            {["House", "Apartment"].map((type) => (
              <div
                key={type}
                className={`w-[205px] text-center py-2 rounded-md cursor-pointer ${
                  formData.propertyType === type ? "bg-[#5C432E] text-white" : "bg-gray-200"
                }`}
                onClick={() => setFormData({ ...formData, propertyType: type })}
              >
                {type}
              </div>
            ))}
            {errors.propertyType && <div className="error">{errors.propertyType[0]}</div>}
          </div>
        </div>

        {/* Upload multiple images */}
        <div className="flex gap-8">
          <label htmlFor="image" className="cursor-pointer">
            Upload Photo
          </label>
          <input
            id="image"
            type="file"
            multiple // Allow selecting multiple files
            onChange={(e) =>
              setFormData({
                ...formData,
                images: Array.from(e.target.files),
              })
            }
          />
        </div>

        <div>
          <textarea
            rows="3"
            placeholder="House description"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          ></textarea>
          {errors.body && <div className="error">{errors.body[0]}</div>}
        </div>

        <p className="text-[#544c46]">Other Information</p>
        <div className="flex items-center gap-8 w-[37%]">
          <p className="whitespace-nowrap ml-[25%] text-right">Bedrooms</p>
          <input
            className="h-[26px]"
            type="text"
            value={formData.bedrooms}
            onChange={(e) =>
              setFormData({ ...formData, bedrooms: e.target.value })
            }
          />
        </div>
        {errors.bedrooms && <div className="error grid place-content-end">{errors.bedrooms}</div>}
          

        <div className="flex items-center gap-8 w-[37%]">
          <p className="whitespace-nowrap ml-[23%] text-right">Bathrooms</p>
          <input
            className="h-[26px]"
            type="text"
            value={formData.bathrooms}
            onChange={(e) =>
              setFormData({ ...formData, bathrooms: e.target.value })
            }
          />
        </div>
        {errors.bathrooms && <div className="error grid place-content-end">{errors.bathrooms}</div>}

        <div className="flex items-center gap-8 w-[37%]">
          <p className="whitespace-nowrap text-right">Floor Squaremeter</p>
          <input
            className="h-[26px]"
            type="text"
            value={formData.floorSquaremeter}
            onChange={(e) =>
              setFormData({ ...formData, floorSquaremeter: e.target.value })
            }
          />
        </div>
        {errors.floorSquaremeter && <div className="error grid place-content-end">{errors.floorSquaremeter}</div>}

        <div className="flex items-center gap-8 w-[37%]">
          <p className="whitespace-nowrap ml-[7%] text-right">Lot Squaremeter</p>
          <input
            className="h-[26px]"
            type="text"
            value={formData.lotSquaremeter}
            onChange={(e) =>
              setFormData({ ...formData, lotSquaremeter: e.target.value })
            }
          />
        </div>
        {errors.lotSquaremeter && <div className="error grid place-content-end">{errors.lotSquaremeter}</div>}

        <div className="flex items-center gap-8">
          <p className="whitespace-nowrap ml-[12%] text-right">Address</p>
          <input
            className="h-[26px]"
            type="text"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>
        {errors.address && <div className="error grid place-content-end">{errors.address}</div>}

        <div className="flex items-center gap-8 w-[37%]">
          <p className="whitespace-nowrap ml-[43%] text-right">Price</p>
          <input
            className="h-[26px]"
            type="text"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
        </div>
        {errors.price && <div className="error grid place-content-end">{errors.price}</div>}

        <div className="flex items-center gap-8 w-[60%]">
          <p className="whitespace-nowrap ml-[12%] text-right">Seller Name</p>
          <input
            className="h-[26px]"
            type="text"
            value={formData.sellerName}
            onChange={(e) =>
              setFormData({ ...formData, sellerName: e.target.value })
            }
          />
        </div>
        {errors.sellerName && <div className="error grid place-content-end">{errors.sellerName}</div>}

        <div className="flex items-center gap-8 w-[60%]">
          <p className="whitespace-nowrap ml-[24%] text-right">Email</p>
          <input
            className="h-[26px]"
            type="text"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        {errors.email && <div className="error grid place-content-end">{errors.email}</div>}

        <div className="flex items-center gap-8 w-[60%]">
          <p className="whitespace-nowrap ml-[6%] text-right">Mobile Number</p>
          <input
            className="h-[26px]"
            type="text"
            value={formData.mobileNumber}
            onChange={(e) =>
              setFormData({ ...formData, mobileNumber: e.target.value })
            }
          />
        </div>
        {errors.mobileNumber && <div className="error grid place-content-end">{errors.mobileNumber.length == 2 ? errors.mobileNumber[1] : errors.mobileNumber}</div>}


        {/* Submit button */}
        <div className="flex place-content-center text-[16px] space-x-6 absolute right-[9%]">
          <button
            disabled={isPending}
            className="h-[26px] w-[78px] hover:bg-[#281d14] transition-all bg-[#4e3827] rounded-md text-white"
          >
            {isPending ? "Posting.." : "Post"}
          </button>
          <Link to='/'>
            <button className="h-[26px] w-[78px] rounded-md bg-[#E24343] text-white">Cancel</button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Create;
