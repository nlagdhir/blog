import { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Edit from "../imgs/edit.png";
import Delete from "../imgs/delete.png";
import axios from "axios";
import moment from "moment";
import { AuthContext } from "../context/AuthContext";
import DOMPurify from "dompurify";

function Single() {
  const [post, setPost] = useState({});

  const location = useLocation();
  const navigate = useNavigate();
  const postID = location.pathname.split("/")[2];

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/posts/${postID}`
        );
        setPost(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getPost();
  }, [postID]);

  const handleDeleteClick = async () => {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL}/posts/${postID}`,
      { withCredentials: true }
    );

    console.log(res.response);
    //navigate('/');
  };

  return (
    <div className="single">
      <div className="content">
        <img src={`../upload/${post.img}`} alt="post" />
        <div className="user">
          <img src={post.userImage} alt="user" />
          <div className="info">
            <span>{post?.username}</span>
            <p>Posted {moment(post?.date).fromNow()}</p>
          </div>
          {currentUser.username === post.username && (
            <div className="edit">
              <Link to={`/write/?edit=2`} state={post}>
                <img src={Edit} alt="edit" />
              </Link>

              <img onClick={handleDeleteClick} src={Delete} alt="delete" />
            </div>
          )}
        </div>
        <h1>{post?.title}</h1>
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.desc),
          }}
        ></p>
      </div>
      <Sidebar cat={post.cat} />
    </div>
  );
}

export default Single;
