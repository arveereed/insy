import { useContext, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPost } from "../../api/posts";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Captions } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/plugins/captions.css";
import Container from "react-bootstrap/Container";
import userIcon from "../../assets/user.png";
import verified from "../../assets/verified.png";
import Image from "react-bootstrap/Image";
import PostTime from "../../utils/PostTime";
import bed from '../../assets/bed.png'
import shower from '../../assets/shower.png'

const Show = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, token } = useContext(AppContext);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => getPost(id),
    enabled: !!id, // Ensure the query runs only if ID exists
  });

  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState([]); // State for Lightbox slides

  const handleOpenLightbox = (images) => {
    // Convert images into slides format for Lightbox
    const parsedImages = Array.isArray(images) ? images : JSON.parse(images || "[]");
    const newSlides = parsedImages.map((image, i) => ({
      src: `http://127.0.0.1:8000/storage/${image}`,
      title: `Image ${i + 1}`,
      description: "",
    }));

    setSlides(newSlides); // Set slides for Lightbox
    setOpen(true); // Open Lightbox
  };

  const deletePost = async (id, token) => {
    const response = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  };

  const { mutate, isLoading: isPending } = useMutation({
    mutationFn: ({ id, token }) => deletePost(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/"); // Navigate to home after deletion
    },
  });

  if (isLoading) return <h1>Loading ako teka lang</h1>;
  if (isError || !data) return <p className="title">Post not found</p>;

  const post = data.post;
  const images = typeof post.images === "string" ? JSON.parse(post.images) : post.images;

  console.log(post)

  return (
    <Container className=" z-40 min-w-[320px] max-w-[90%] md:min-w-[500px] lg:max-w-[800px] mx-auto px-4">
{/*       <div key={post.id} className=" bg-white mb-4 p-4 border rounded-md border-dashed border-slate-400">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h2 className="font-bold text-2xl">{post.title}</h2>
            <small className="text-xs text-slate-600">
              Posted by {data.user.firstname} {data.user.lastname} on {new Date(post.created_at).toDateString()} -{" "}
              {new Date(post.created_at).toLocaleTimeString()}
            </small>
          </div>
        </div>
        <p>{post.body}</p>
        <button onClick={() => handleOpenLightbox(post.images)} className="flex">
        
        {myImages.length > 0 &&
          myImages.map((image, i) => (
            <div key={i} className="w-full flex justify-center mt-4">
              <img
                className="max-w-full h-auto object-contain rounded-md"
                src={`http://127.0.0.1:8000/storage/${image}`}
                alt={`Post Image ${i + 1}`}
              />
            </div>
          ))}

        </button>
        {user && post.user_id === user.id && (
          <div className="flex mt-4 justify-end items-center gap-4">
            <Link to={`/posts/update/${post.id}`} className="bg-green-500 text-white text-sm rounded-md px-3 py-1">
              Update
            </Link>
            <button
              disabled={isPending}
              onClick={() => mutate({ id, token })}
              className="bg-red-500 text-white text-sm rounded-md px-3 py-1"
            >
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div> */}

      <div className="relative mt-10 bg-white mb-4 py-4 px-7 rounded-md">
        <div className="flex flex-col items-start justify-between">
          <div className="w-[78%] mb-2 h-[40px] flex space-x-3">
            <div className="bg-[#323232] w-[35px] h-[35px] rounded-full grid place-content-center">
              <Image src={userIcon} />
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
        <div className="h-[30px] grid grid-cols-2 place-content-center mt-3">
          <div className="font-bold text-[16px] grid place-content-center">
            <span className="">{post.title}</span>
          </div>
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
        <div className=" mt-2 bg-[#D9D9D9] p-3 rounded-md mb-2">
          <p>{post.body.length <= 70 ? post.body : `${post.body.slice(0, 70)}...`}</p>
        </div>
        <p className="text-gray-700 mb-2">Other Information</p>
        <div className="ml-2 space-y-2">
          <div className="flex">
            <div>Floor Squaremeter</div>
            <div className="ml-3 bg-[#D9D9D9] w-[120px] h-[35px] grid place-content-center rounded-sm">{post.floor_squaremeter}</div>
          </div>
          <div className="flex">
            <div>Lot Squaremeter</div>
            <div className="ml-[27px] bg-[#D9D9D9] w-[120px] h-[35px] grid place-content-center rounded-sm">{post.lot_squaremeter}</div>
          </div>
          <div className="flex">
            <div>Price</div>
            <div className="ml-[120px] bg-[#D9D9D9] w-[120px] h-[35px] grid place-content-center rounded-sm">{post.price}</div>
          </div>
        </div>

        <p className="text-gray-700 mb-2">Seller Information</p>
        <div className="ml-2 space-y-2">
          <div className="flex">
            <div>Name</div>
            <div className="ml-[112px] bg-[#D9D9D9] w-[330px] h-[35px] grid place-content-center rounded-sm">{post.seller_name}</div>
          </div>
          <div className="flex">
            <div>Email</div>
            <div className="ml-[118px] bg-[#D9D9D9] w-[330px] h-[35px] grid place-content-center rounded-sm">{post.email}</div>
          </div>
        </div>

        {user && post.user_id === user.id && (
          <div className="flex mt-4 justify-end items-center gap-4">
            <Link to={`/posts/update/${post.id}`} className="hover:bg-[#281d14] transition-all bg-[#5C432E] text-white text-sm rounded-md px-3 py-1">
              Update
            </Link>
            <button
              disabled={isPending}
              onClick={() => mutate({ id, token })}
              className="hover:bg-[#bc3535] transition-all bg-red-500 text-white text-sm rounded-md px-3 py-1"
            >
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>
      <Lightbox
        plugins={[Captions]}
        open={open}
        close={() => setOpen(false)}
        slides={slides}
      />
    </Container>
  );
};

export default Show;
