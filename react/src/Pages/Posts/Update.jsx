import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getPost, updatePost } from "../../api/posts";

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(AppContext);

  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });

  const [errors, setErrors] = useState({});

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => getPost(id),
    enabled: !!id,
  });

  // Redirect if the user doesn't own the post
  useEffect(() => {
    if (data && data.post.user_id !== user.id) {
      navigate("/");
    }
  }, [data, user.id, navigate]);

  // Populate form data
  useEffect(() => {
    if (data?.post) {
      setFormData({
        title: data.post.title,
        body: data.post.body,
      });
    }
  }, [data]);

  const queryClient = useQueryClient()
  
    const { mutate, isPending } = useMutation({
      mutationFn: ({formData, token, id}) => updatePost(formData, token, id),
      onSuccess: (data) => {
        if (data.errors) {
          setErrors(data.errors); // Set errors from the JSON response
        } else {
          setErrors({}); // Clear errors
          navigate("/"); // Navigate to another page after successful creation
          queryClient.invalidateQueries({ queryKey: ["posts"] });
        }
      }
    })

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="container-bg h-[562px] w-[390px] z-40 rounded-2xl grid place-content-center">
      <p className="text-center font-bold text-[20px] mb-4">Update a post</p>

      <form onSubmit={(e) => e.preventDefault()} className=" mx-auto space-y-6 w-[320px]">
        <div>
          <input
            type="text"
            placeholder="Post Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          {errors.title && <div className="error">{errors.title[0]}</div>}
        </div>

        <div>
          <textarea
            rows="6"
            placeholder="Post Content"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          ></textarea>
          {errors.body && <div className="error">{errors.body[0]}</div>}
        </div>

        <div className="flex justify-center">
          <button disabled={isPending} onClick={() => mutate({formData, token, id})} className="text-[12px] h-[34px] w-[113px] hover:bg-[#281d14] transition-all bg-[#4e3827] rounded-full text-white">Update</button>
        </div>
      </form>
    </div>
  );
};

export default Update;
