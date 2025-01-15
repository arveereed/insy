import { useContext, useEffect, useState } from "react";
import { getPosts } from "../api/posts";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Container from "react-bootstrap/Container";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Captions } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/plugins/captions.css";
import user from "../assets/user.png";
import verified from "../assets/verified.png";
import Image from "react-bootstrap/Image";
import PostTime from "../utils/PostTime";
import bed from '../assets/bed.png'
import shower from '../assets/shower.png'

import { AppContext } from "../Context/AppContext";

const Home = () => {
  const { open, setOpen, slides, setSlides, toggleSavePost, checkMark } = useContext(AppContext);

  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const handleOpenLightbox = (images) => {
    // Ensure images are parsed and converted to slides
    const parsedImages = typeof images === "string" ? JSON.parse(images) : images;
    const newSlides = parsedImages.map((image, i) => ({
      src: `http://127.0.0.1:8000/storage/${image}`,
      title: `Image ${i + 1}`,
      description: "",
    }));

    setSlides(newSlides); // Set the slides for Lightbox
    setOpen(true); // Open the Lightbox
  };
  
  const [search, setSearch] = useState('')
  const [dropdownSearch1, setDropdownSearch1] = useState('')
  const [dropdownSearch2, setDropdownSearch2] = useState('')
  const [dropdownSearch3, setDropdownSearch3] = useState('')
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (posts) {
      const filteredResults = posts.filter((post) => {
        const matchesSearch = search
          ? post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.body.toLowerCase().includes(search.toLowerCase()) ||
            post.address.toLowerCase().includes(search.toLowerCase()) ||
            String(post.bathrooms).toLowerCase().includes(search.toLowerCase()) ||
            String(post.bedrooms).toLowerCase().includes(search.toLowerCase()) ||
            post.email.toLowerCase().includes(search.toLowerCase()) ||
            post.floor_squaremeter.toLowerCase().includes(search.toLowerCase()) ||
            post.lot_squaremeter.toLowerCase().includes(search.toLowerCase()) ||
            post.mobile_number.toLowerCase().includes(search.toLowerCase()) ||
            post.offer_type.toLowerCase().includes(search.toLowerCase()) ||
            post.price.toLowerCase().includes(search.toLowerCase()) ||
            post.property_type.toLowerCase().includes(search.toLowerCase()) ||
            post.seller_name.toLowerCase().includes(search.toLowerCase())
          : true;
  
        const matchesDropdown1 = dropdownSearch1
          ? post.offer_type.toLowerCase() === dropdownSearch1.toLowerCase()
          : true;
  
        const matchesDropdown2 = dropdownSearch2
          ? post.property_type.toLowerCase() === dropdownSearch2.toLowerCase()
          : true;
  
        const matchesDropdown3 = dropdownSearch3
          ? post.price.toLowerCase() === dropdownSearch3.toLowerCase()
          : true;
  
        return matchesSearch && matchesDropdown1 && matchesDropdown2 && matchesDropdown3;
      });
  
      setSearchResults(filteredResults);
    }
  }, [posts, search, dropdownSearch1, dropdownSearch2, dropdownSearch3]);

  return (
    <>
      <div onSubmit={(e) => e.preventDefault()} className="z-40 mt-7 flex h-[42px] gap-3 text-[16px]">
        <div className="w-[149px]">
          <select 
            className='w-full h-full text-center rounded-md'
            value={dropdownSearch1}
            onChange={(e) => setDropdownSearch1(e.target.value)}
          >
            <option value="">Offer Type</option>
            <option value="Sale">Sale</option>
            <option value="Rent">Rent</option>
          </select>
        </div>
        <div className="w-[149px]">
        <select 
            className='w-full h-full text-center rounded-md'
            value={dropdownSearch2}
            onChange={(e) => setDropdownSearch2(e.target.value)}
          >
            <option value="">Property Type</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
          </select>
        </div>
        <div className="w-[149px]">
        <select 
            className='w-full h-full text-center rounded-md'
            value={dropdownSearch3}
            onChange={(e) => setDropdownSearch3(e.target.value)}
          >
            <option value="">Price</option>
            <option value="1M - 2M">1M - 2M</option>
            <option value="2M - 4M">2M - 4M</option>
            <option value="4M - 8M">4M - 8M</option>
            <option value="9M - 10M">9M - 10M</option>
          </select>
        </div>
        <div className=" flex-1 min-w-[149px]">
          <input 
            className="outline-none h-full px-3" 
            type="text" 
            placeholder="Search" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Container
        className="custom-scrollbar z-40 mt-5 min-h-screen overflow-y-auto   min-w-[320px] max-w-[90%] md:min-w-[500px] lg:max-w-[948px] mx-auto"
        style={{ maxHeight: "600px" }}
      >
        {isError && (
          <div className="text-red-500 px-5 py-2 bg-white grid place-content-center font-semibold rounded-lg">
            Please check your internet connection and try again. Thank you!
          </div>
        )}
        {isLoading && (
          <div className="bg-white px-5 py-2 text-center rounded-lg">
            <h1 className="text-[24px]">Loading ako teka lang</h1>
          </div>
        )}

        <div>
          {posts &&
            !isLoading &&
            (posts.length ? (
              searchResults.map((post) => {
                const images =
                  typeof post.images === "string" ? JSON.parse(post.images) : post.images;

                return (
                  <div
                    key={post.id}
                    className="relative bg-white mb-4 py-4 px-7 rounded-md"
                  >
                    <div className="flex flex-col items-start justify-between">
                      <div className="w-[78%] mb-2 h-[40px] flex space-x-3">
                        <div className="bg-[#323232] w-[35px] h-[35px] rounded-full grid place-content-center">
                          <Image src={user} />
                        </div>
                        <div className="relative">
                          <div className="flex space-x-2">
                            <span className="font-bold text-[14px]">
                              {post.user.firstname} {post.user.lastname}
                            </span>
                            <Image
                              className="h-[20px] mt-[2px] w-[20px]"
                              src={verified}
                            />
                          </div>
                          <small className="text-[11px] absolute bottom-1">Landlord</small>
                        </div>
                      </div>
                      <PostTime createdAt={post.created_at} />
                      <button onClick={() => toggleSavePost(post)}>
                        <Image className="h-[27px] absolute top-4 right-[115px]" src={checkMark(post)} />
                      </button>

                      <Link
                        className="hover:bg-[#281d14] transition-all bg-[#4e3827] text-white text-sm rounded-lg px-3 py-1 mt-2 md:mt-0 absolute top-4 right-4"
                        to={`/posts/${post.id}`}
                      >
                        View post
                      </Link>
                    </div>
                    
                    <button
                      onClick={() => handleOpenLightbox(post.images)}
                      className="flex border border-[#4e3827]"
                    >
                      {images && images.length > 0 && (
                        <div
                          className={`images-grid grid ${
                            images.length === 1
                              ? "grid-cols-1"
                              : images.length === 2
                              ? "grid-cols-2"
                              : images.length <= 4
                              ? "grid-cols-2"
                              : "grid-cols-4"
                          }`}
                          style={{ width: "100%", maxWidth: "948px" }}
                        >
                          {images.slice(0, 8).map((image, i) => (
                            <div
                              key={i}
                              className="relative border border-[#4e3827] flex justify-center items-center overflow-hidden"
                              style={{
                                width: "100%",
                                height: `${images.length <= 2 ? "auto" : "calc(748px / 4)"}`,
                              }}
                            >
                              <img
                                className="w-full h-full object-cover"
                                src={`http://127.0.0.1:8000/storage/${image}`}
                                alt={`Post Image ${i + 1}`}
                              />
                              {i === 7 && images.length > 8 && (
                                <div
                                  className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center font-bold text-lg"
                                >
                                  +{images.length - 8}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </button>
                    <div className="mt-3 h-[30px] grid grid-cols-2 place-content-center">
                      <div className="font-bold text-[16px] grid place-content-center"><span className="">{post.title}</span></div>
                      <div className="h-full flex gap-4">
                        <div className="flex">
                          <Image
                            className="w-[32px] h-[32px]"
                            src={bed}
                          />
                          <span className="mt-2 ml-2 font-semibold">{post.bedrooms}</span>
                        </div>
                          <Image
                            className="w-[32px] h-[32px]"
                            src={shower}
                          />
                          <span className="mt-2 font-semibold">{post.bathrooms}</span>
                        </div>
                    </div>
                    <div className="text-[12px] font-semibold space-x-2 mt-2">
                      <span className="bg-[#C09067] py-[1px] px-4 rounded-md">{post.offer_type}</span>
                      <span className="bg-[#C09067] py-[1px] px-4 rounded-md">{post.property_type}</span>
                      <span className="bg-[#C09067] py-[1px] px-4 rounded-md">{post.address}</span>
                    </div>
                    <div className=" mt-2 bg-[#D9D9D9] p-3 rounded-md">
                      <p>{post.body.length <= 70 ? post.body : `${post.body.slice(0, 70)}...`}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-red-500 px-5 py-2 bg-white grid place-content-center font-semibold rounded-lg">
                <p>There are no posts.</p>
              </div>
            ))}
        </div>
        <Lightbox
          plugins={[Captions]}
          open={open}
          close={() => setOpen(false)}
          slides={slides}
        />
      </Container>
    </>
  );
};

export default Home;
