import create from 'zustand'

export const useThread = create(set => ({
    thread: [],
    setThread: (tweet) => set({thread: tweet})
        }
    )
)

export const useMainThread = create(set => ({
    mainthread: "",
    setMainThread: (tweet) => set({mainthread: tweet})
        }
    )
)

export const useTweet = create(set => ({
    tweets: [],
    setTweet: (fetched) => set({tweets: fetched})
        }
    )
)

export const useMode = create(set => ({
    mode: "thread",
    setMode: (fetched) => set({mode: fetched})
        }
    )
)