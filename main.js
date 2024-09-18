//import videoList from './videoList.js';

// main.js
var player;
var channelID = 0;



//Get the current time past midnight in seconds
function getTime()
{
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    return (hours * 60 * 60) + (minutes * 60) + seconds;
}



function readVideoJson() {
    return videoList;
}

function getVideoIndex() {
    const json =  readVideoJson();
    const seconds = getTime();

    // Ensure that json is an array before filtering
    if (!Array.isArray(json)) {
        console.error('Fetched data is not an array');
        return null;
    }

    console.log(json);

    // Filter the JSON with the videos thart are on the correnct channel and are not in the future
    const channelVideos = json.filter(video => video.channel == channelID);
    console.log(channelVideos);
    const validVideos = channelVideos.filter(video => video.start_playing <= seconds);
    console.log(validVideos);

    //find closest video
    let closestVideo = validVideos[0];
    validVideos.forEach(video => {
        if (video.start_playing > closestVideo.start_playing) {
            closestVideo = video;
        }
    });
    console.log("Closest video: " + closestVideo);

    //return closest video or null
    return closestVideo ? closestVideo : null;
}


function loadVideo()
{
    const video = getVideoIndex();
    if(video == null)
    {
        console.error("No video to play");
        //we have a big problem
    }
    console.log("THIS IS THE VIDEO!!!" + video.video_id);

    //Find the video the player should be playing based on the current time and the channel

    //if the time the video should play time is behind the current time we need to jump forward in the video to a timestamp (second argument in loadVideoById)
    if(video.start_playing == getTime())
    {
        player.loadVideoById(video.video_id);
    }else
    {
        //second argument is the time in seconds to start the video at
        var start_time = video.start_playing - getTime();
        start_time = Math.abs(start_time);
        console.log("Start time: " + start_time);
         //an edge case may occure where the time to skip to is outside the video runtime, in that case the json file clearly does not have enough videos for the day
        if(start_time > video.video_length)
        {
            console.error("Number of videos provided length is too short for 24 hours of playtime on channel: " + channelID);
        }
        player.loadVideoById(video.video_id, start_time);  // Load the desired video
    }
}











function onYouTubeIframeAPIReady() {
    console.log("API Ready");
    player = new YT.Player('player', {
        playerVars: {
            'playsinline': 1,
            'disablekb': 1,
            'enablejsapi': 1,
            'iv_load_policy': 3,
            'cc_load_policy': 0,
            'controls': 0,
            'rel': 0,
            'autoplay': 1,  // Ensure autoplay is enabled
            'mute': 1       // Start muted to avoid autoplay restrictions
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            //'onAutoplayBlocked': onAutoplayBlocked,
            //'onError': onErrorOccured
        }
    });
}










// When the player is ready, set the video and play it
function onPlayerReady(event) {
    console.log("Player ready!");

    //Get the video to play
    loadVideo();
    player.playVideo();  // Play the video
    
    player.setVolume(50);  // Set the volume to 50% by default
    player.setPlaybackRate(1);  // Set the playback rate to normal speed

    
}











function onPlayerStateChange(event) {
    console.log("State Change:", event.data);

    //player.unMute();  //if the player unmutes too quickly it will not play the video, we will just leave it muted until the user unmutes it via the remote

    //Stack Overflow Question: 13735783
    player.unloadModule("captions");  //Works for html5 ignored by AS3
    player.unloadModule("cc");  //Works for AS3 ignored by html5

    if (event.data == YT.PlayerState.CUED || event.data == YT.PlayerState.ENDED || event.data == YT.PlayerState.PAUSED) {

        //when the player ends we start the next video, otherwise we try to force play a video
        if(event.data == YT.PlayerState.ENDED )
        {
            loadVideo(); //load next video
        }
        


        player.playVideo();
        
    }
}




//temp location of videoList

const videoList = [
    {
        "id": 1,
        "video_id": "g4FNC9dbT-E",
        "start_playing": 3600,
        "video_length": 3000,
        "channel": 0
    },
    {
        "id": 2,
        "video_id": "uPrXEtvKFoI",
        "start_playing": 7200,
        "video_length": 3000,
        "channel": 1
    },
    {
        "id": 3,
        "video_id": "8oc_huxXD4M",
        "start_playing": 10800,
        "video_length": 3000,
        "channel": 2
    }
];

