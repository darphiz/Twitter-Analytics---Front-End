import twitter from '../assets/images/twitter.png'
import AnalyticsBoard from './AnalyticsBoard';
import {useEffect} from 'react'
import {useTweet, useMode} from './Store'
import axios from 'axios'
export const origin = "https://conswap.pythonanywhere.com/api";


const Header = () => {
  return(
      <header className="d-flex header align-items-center gap-2">  
        <img src={twitter} alt="twitter" className='header-logo' />
        <span className='header-text'>Analytics.</span>
      </header>
  )
  }

const Stats = () => {
      const tweets = useTweet(state => state.tweets)
      return(
          <div className="d-flex align-items-center gap-5 mb-2 grey">
            <span>Keywords: Startup, tips</span>
            <span>Tweets in this category : {tweets.length}</span>
            <span>Since: 2021-01-01</span>
          </div>
      )
}

const App = ()=> {
  const setTweets = useTweet(state => state.setTweet)
  const mode = useMode(state => state.mode)
  useEffect(()=>{
      
      let url
      if(mode === 'thread'){
          url = `${origin}/get_threads_tweets/`
      }else if (mode ==='question'){
          url = `${origin}/get_questions/`
      }else{
        url = `${origin}/get_others`
      }
      
      axios.get(url)
      .then(res => {
        setTweets(res.data)
      }).catch(err => {
        setTweets([])
      } )

      return () => {
        setTweets([])
      }
    }, [setTweets,mode])
  return (
    <div className="App">
      <Header/>
      <main className='my-3 main-container'>
          <Stats />
          <AnalyticsBoard />
      </main>
    </div>
  );
}

export default App;
