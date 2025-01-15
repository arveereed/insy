
export const getPosts = async (obj) => {
    const response = await fetch('/api/posts');
    const data = await response.json();
    return data
}

export const getPost = async (id) => {
  const response = await fetch(`/api/posts/${id}`);
  const data = await response.json();
  return data
}

export const createPost = async (payload, token) => {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload), // Convert payload to JSON string
  });
  return await response.json();
};


export const updatePost = async (formData, token, id) => {
  const response = await fetch(`/api/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();
  return data;
};



/* ################################################################################## */

export const createCredential = async (payload, token) => {
  const response = await fetch("/api/creds", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload), // Convert payload to JSON string
  });
  return await response.json();
};

export const getUserPostCreds = async (id, token) => {
  const response = await fetch(`/api/creds/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};