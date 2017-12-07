import './Authentication.css';
// This is for URL parsing. I don't understand why I can't import it
// the ES6 way.
let url = require("url");

class Authentication {
    constructor() {
        /**
          Nobody else needs to see this function, so I've snuck it in here.
          It will load the tweets, friends, and messages from the server
          and store them in the fields in this object. It'll also return a Promise
          that will resolve to void when everything is where it's supposed to be.
          The only point of this is for some other functions, getTweets, getMessages,
          and getFriends, to work without duplicating code.
        */
        this.loadData = async () => {
            // https://memegenerator.net/img/instances/500x/80786494/private-method.jpg
            if(this.isAuthenticated) {
                let response = await fetch(`/auth/twitter/verify?oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}`);
                let json = await response.json();

                // console.log(json.tweets);
                // console.log(json.friends);
                // console.log(json.messages);

                this.screen_name = json.screen_name;
                this.user_id = json.user_id;
                this.tweets = json.tweets;
                this.friends = json.friends;
                this.messages = json.friends;

                if (typeof(Storage) !== "undefined") {
                    localStorage.setItem("user_info", JSON.stringify(json));
                }
                return;
            }
        }

        this.authenticate = this.authenticate.bind(this);
        this.logout = this.logout.bind(this);
        this.screen_name = null;
        this.user_id = null;

        let curr_url = window.location.href;
        let url_parts = url.parse(curr_url, true);
        let query = url_parts.query;
        let oauth_token = query["oauth_token"];
        let oauth_verifier = query["oauth_verifier"];

        if (typeof(Storage) !== "undefined") {
            const cacheHits = localStorage.getItem("user_info");
            if (cacheHits){
                this.isAuthenticated = true;
                var obj = JSON.parse(cacheHits);
                this.screen_name = obj.screen_name;
                this.user_id = obj.user_id;
                this.tweets = obj.tweets;
                this.friends = obj.friends;
                this.messages = obj.messages;
                return;
            }
        }

        this.isAuthenticated = oauth_token !== undefined && oauth_verifier !== undefined;

        // console.log(this.tweets);
        // console.log(this.friends);
        // console.log(this.messages);
    }


    /**
        Returns a Promise that will fulfill when the auth endpoint
        comes back. The Promise will have as its argument the URL that
        comes back from the server.
     */
    authenticate() {
        let that = this;
        return new Promise((resolve, reject) => {
            if(that.isAuthenticated) {
                reject("You already signed in!");
                return;
            }
            // send request for redirect_uri
            fetch("/auth/twitter")
                .then(function(res){
                        console.log(res);
                    res.json().then(function(json){
                        resolve(json.redirect_uri);
                    });
                }).catch(reject);
            });
    }

    /**
        Clear out authentication data so you can log in again
    */
    logout() {
        this.isAuthenticated = false;
        this.screen_name = undefined;
        this.oauth_token = undefined;
        this.oauth_verifier = undefined;
        localStorage.removeItem("user_info");
    }

    getTweetsNoWait() {
        if(this.tweets === undefined)
            return null;
        else
            return this.tweets;
    }

    async getTweets() {
        let ret = this.getTweetsNoWait();
        if(ret === null) {
            await this.loadData();
            return this.getTweetsNoWait();
        } else {
            return ret;
        }
    }

    getMessagesNoWait() {
        if(this.messages === undefined)
            return null;
        else
            return this.messages;
    }

    async getMessages() {
        let ret = this.getMessagesNoWait();
        if(ret === null) {
            await this.loadData();
            return this.getMessagesNoWait();
        } else {
            return ret;
        }
    }

    getFriendsNoWait() {
        if(this.friends === undefined)
            return null;
        else
            return this.friends;
    }

    async getFriends() {
        let ret = this.getFriendsNoWait();
        if(ret === null) {
            await this.loadData();
            return this.getFriendsNoWait();
        } else {
            return ret;
        }
    }

    async getScreenName() {
        let ret = this.getScreenNameNoWait();
        if(ret === null) {
            await this.loadData();
            return this.getScreenNameNoWait();
        } else {
            return ret;
        }
    }

    getScreenNameNoWait() {
        if(this.screen_name === undefined)
            return null;
        else
            return this.screen_name;
    }
}

export default Authentication;
