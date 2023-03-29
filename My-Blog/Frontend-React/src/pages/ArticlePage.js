import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router-dom'
import articles from './article-content';
import NotFoundPage from './NotFoundPage';
import axios from 'axios';
import CommentsList from '../Components/CommentsList';
import AddCommentForm from '../Components/AddCommentForm';
import useUser from '../hooks/useUser';


const ArticlePage = () => {

const [articleInfo,setArticleInfo]=useState({upvotes:0,comments:[]})
const {articleId}=useParams();

const {user,isLoading}=useUser();

useEffect(()=>{
const loadArticleInfo=async()=>{
  const response=await axios.get(`/api/articles/${articleId}`);
  const newArticleInfo=response.data;
  setArticleInfo(newArticleInfo);
}
loadArticleInfo();
},[]);

   
    const article=articles.find(article=>article.name===articleId);

  const addUpVote=async()=>{
    const response=await axios.put(`/api/articles/${articleId}/upvote`);
    const updatedArticle=response.data;
    setArticleInfo(updatedArticle);
  }


    if(!article){
      return  <NotFoundPage/>
    }
  return (
    <>   
       <h1>{article.title}</h1>
       <div className='upvotes-section'>
        {user 
      ? <button onClick={addUpVote}>Upvote</button>
      :<button>Login to upvote</button>
      }
    <p>this article has {articleInfo.upvotes} upvotes</p>
       </div>
       
        {article.content.map((paragraph,i)=>(
            <p key={i}>{paragraph}</p>
        ))}
        {user
        ?<AddCommentForm 
        articleName={articleId}
        onArticleUpdated={updatedArticle=>setArticleInfo(updatedArticle)}
        />
        :<button>Log in to add a comment </button> }
        <CommentsList comments={articleInfo.comments}/>
    </>
  )
}

export default ArticlePage;
