import React, {useEffect, useState} from "react";
import axios from "axios";
import "semantic-ui-css/semantic.min.css";
import {Container, Header, Button, Icon, Input, TextArea} from "semantic-ui-react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	useParams,
	useHistory,
} from "react-router-dom";
import "./App.scss";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {v4 as uuidv4} from "uuid";

const URL_PATH = 'http://localhost:5000';

const App = () => {
	return (
		<>
			<Router>
				<Switch>
					<Route path='/post/:id' exact>
						<Post />
					</Route>
					<Route path='/' exact>
						<Home />
					</Route>
				</Switch>
			</Router>
		</>
	);
};

const Home = () =>{
  const [posts, setPosts] = useState([]);

	const fetchPosts = () => {
		axios.get(`${URL_PATH}/posts`).then((res) => setPosts(res.data));
	};

	useEffect(() => {
		fetchPosts();
	}, []);

  return (
		<div className='App'>
			<h1>Majalah ARC</h1>
			{posts.length &&
				posts.map((row, i) => (
					<Link to={`post/${row.id}`}>
						<PostThumb data={row} key={i} />
					</Link>
				))}
		</div>
	);
}


const PostThumb = ({data}) => (
	<Container text className='post-container thumb'>
		<Header as='h2'>{data.title || "No Title"}</Header>
		<div>{data.content.substring(0,200) || "No Content"}...</div>
	</Container>
);

const Post = () => {
  const history = useHistory();

  const {id} = useParams();

  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

	const fetchPost = () => {
		axios.get(`${URL_PATH}/post/${id}`).then((res) => setPost(res.data));
	};

	const fetchComments = () => {
		axios.get(`${URL_PATH}/comments/${id}`).then((res) => setComments(res.data));
	};
  
  const postComment = () =>{
    return axios.post(`${URL_PATH}/comment/${id}`,{name,content:comment,id:uuidv4()})
  }

  const handlePost = () => {
    if(name=="") return toast.error("Nama tidak boleh kosong!");
    if(comment=="") return toast.error("Comment tidak boleh kosong!");

    const target = {
      name, content : comment, id : uuidv4(), post_id : id+""
    }
    console.log(target);
    axios
			.post(`${URL_PATH}/comment/${id}`,target)
			.then(() => {
				toast.success("Comment berhasil ditambahkan!");
				setTimeout(() => history.go(0), 1000);
			})
			.catch((err) => console.log(err));
  }

	useEffect(() => {
		fetchPost();
    fetchComments();
	}, []);

  return (
		<div className='post-detail'>
			<ToastContainer />
			<Container text className='post-container'>
				<Header as='h2'>{post.title || "No Title"}</Header>
				<div className='content'>{post.content || "No Content"}</div>
				<hr />
				<p>Post A Comment!</p>
				<div className='comment-form-container'>
					<Input label='Nama' placeholder='Anonymous' value={name} onChange={(e)=>setName(e.target.value)}/>
					<TextArea
						className='text-area'
						placeholder='Wow! What a great article!'
            value={comment}
            onChange={(e)=>setComment(e.target.value)}
					/>
					<Button primary onClick={() => handlePost()}>
						Post
					</Button>
				</div>
				<Container>
					{comments.length &&
						comments.map((row, i) => <Comment data={row} key={i} />)}
				</Container>
			</Container>
			<Button className='back-button' onClick={() => history.push("/")}>
				<Icon name='left arrow' />
				Back
			</Button>
		</div>
	);};

const Comment = ({data}) =>(
  <div className="comment-container">
    <h3>{data.name}</h3>
    <p>{data.content}</p>
  </div>
)

export default App;
