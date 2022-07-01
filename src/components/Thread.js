import {useMode} from './Store'

export const Thread =({tweet})=>{
    const mode = useMode(state => state.mode)
    return(
        <div className="tweet-container mb-2">
            {mode === "question" &&
                <div className="d-flex align-items-center mb-3">
                    <span className="tweet-name">{tweet.username}</span>
                    <span className="ms-auto tweet-date">{tweet.date}</span>
                </div>
            }
            
            <div className="tweet-body">
                {tweet.body}
            </div>  
        </div>
    )
}