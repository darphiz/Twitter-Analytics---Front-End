import {Thread} from './Thread.js'
import {useThread, useTweet, useMainThread, useMode} from './Store.js'
import axios from 'axios'
import {origin} from './App'
import {useRef, useState, useEffect} from 'react'


const TweetContainer = ({body, username, date, handleClick}) => {
        return(
            <div onClick={handleClick} className="tweet-container my-2">
                <div className="d-flex align-items-center mb-3">
                    <span className="tweet-name">{username}</span>
                    <span className="ms-auto tweet-date">{date}</span>
                </div>
                <div className="tweet-body">
                    {body}
                </div>  
            </div>
        )
}


const LeftPane = () => {
    const setThread = useThread(state => state.setThread)
    const setMainThread = useMainThread(state => state.setMainThread)
    const setMode = useMode(state => state.setMode)
    const mode = useMode(state => state.mode)
    const tweets = useTweet(state => state.tweets) 
    
    const fetchThread = (tweet) =>{
        
        axios.get(`${origin}/get_thread/`,   {params: {
            tweet_id: tweet.tweet_id
          }})
        .then(res => {
            if(res.data.message === 'ok'){
                setMainThread(tweet)
                setThread(res.data.thread)
            }else{
                setMainThread(tweet)
                setThread([])
            }
        }).catch(err => {
            setMainThread(tweet)
            setThread([])
        } )
    }

    return (
        <div className="p-2 my-2 left-pane">
            <div className="d-flex">
                <span className="pane-title">Tweets</span>
                <span className="ms-auto d-flex gap-1 align-items-center">
                    <button onClick = {()=> setMode("thread")} className={mode==='thread' ? "switch-btn active-switch" : "switch-btn"}>threads</button>
                    <button onClick = {()=> setMode("question")} className={mode==='question' ? "switch-btn active-switch" : "switch-btn"}>questions</button>
                    <button onClick = {()=> setMode("others")} className={mode==='others' ? "switch-btn active-switch" : "switch-btn"}>others</button>
                </span>
                
            </div>
            <div className="my-4">
                {tweets.map((tweet, index) => <TweetContainer handleClick={()=> fetchThread(tweet)} key={index} {...tweet} />)}
            </div>
        </div>
    )
}

const RightPane = () => {
    const thread = useThread(state => state.thread)
    const mode = useMode(state => state.mode)
    const mainThread = useMainThread(state => state.mainthread)
    const [copy, setCopy] = useState(false)
    const copyBoard = useRef('')
    const sort_by = (field, reverse, primer) => {
        const key = primer ?
          function(x) {
            return primer(x[field])
          } :
          function(x) {
            return x[field]
          };
      
        reverse = !reverse ? 1 : -1;
      
        return function(a, b) {
            // eslint-disable-next-line
          return a = key(a), b = key(b), reverse * ((a > b) - (b > a))
        }
      }
    const threads = thread.sort(sort_by('id', false, parseInt))      
    
    const EmptyThread = () => {
        return (
            <div className="empty-thread">
                <span className="empty-thread-text">tweets you've clicked will appear here...</span>
            </div>
        )
    }
    const openMain = () =>{
        const url = mainThread.url
        const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=700,right=100,top=60`;
        window.open(url, 'tweet', params);
    }
    const copyToClipboard = () => {
        navigator.clipboard.writeText(copyBoard.current.textContent).then(() => {
            setCopy(true)
        });
      }
    const removeCopy = () => {
        setCopy(false)
    }
    useEffect(removeCopy, [mainThread])
    return (
        <div className="p-2 mt-2 left-pane">
            <div className='d-flex align-items-center'>
                {mode==="thread" && <span className="pane-title">Thread</span> }
                {mode==="question" && <span className="pane-title">Answers</span> }
                <span className="ms-auto d-flex gap-1">
                    <button onClick={copyToClipboard} disabled={!mainThread} className={copy ? "save-btn-2": "save-btn"}>{copy ? "Copied": "Copy to clipboard"}</button>
                    <button disabled={!mainThread} onClick={openMain} className='save-btn'>open main tweet</button>
                </span>
            </div>
            <div ref={copyBoard} className="my-4">
               {mainThread &&
                    <div className="tweet-container-1 mb-4">
                    <div className="d-flex align-items-center mb-3">
                        <span className="tweet-name">{mainThread.username}</span>
                        <span className="ms-auto tweet-date">{mainThread.date}</span>
                    </div>
                    <div className="tweet-body">
                        <b>{mainThread.body}</b>
                    </div>  
                    </div>
               }
                {thread.length > 0  ? threads.map((th)=> { return <Thread key={th.id} tweet={th} />}) : <EmptyThread />}
            </div>
        </div>
    )
}

export default function AnalyticsBoard (){
    return(
    <div className="row analytics-container">
        <div className="col-md-6 border-right">
            <LeftPane />
        </div>
        <div className="col-md-6">
            <RightPane />
        </div>
    </div>
    )
} 