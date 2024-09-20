//import videoList from './videoList.js';

// main.js
var player;
var channelID = 0;
var volume = 50;
const channelUpButton = document.getElementById('channelUp');
const channelDownButton = document.getElementById('channelDown');
const toggleMuteButton = document.getElementById('toggleMute');
const volumeUpButton = document.getElementById('volumeUp');
const volumeDownButton = document.getElementById('volumeDown');

//There are so many random console.logs in here



function channelUpPressed() {
    console.log("Channel Up Pressed");

    //Limited to 10 channels
    if(channelID < 9)
    {
        channelID++;
    }else
    {
        channelID = 0;
    }
    console.log("Channel ID: " + channelID);
    loadVideo();
    
}

function channelDownPressed() {
    console.log("Channel Down Pressed");
    if(channelID > 0)
    {
        channelID--;
    }else
    {
        channelID = 10;
    }
    console.log("Channel ID: " + channelID);
    loadVideo();
   
}

function toggleMute() {
    console.log("Toggle Mute Pressed");
    if(player.isMuted())
    {
        player.unMute();
    }else
    {
        player.mute();
    }
   
}

function volumeUpPressed() 
{
    if(volume < 100)
    {
        volume += 10;
    }
    player.setVolume(volume);
    
}

function volumeDownPressed() 
{
    if(volume > 0)
    {
        volume -= 10;
    }
    
    player.setVolume(volume);
}

channelUpButton.addEventListener('click', channelUpPressed);
channelDownButton.addEventListener('click', channelDownPressed);
toggleMuteButton.addEventListener('click', toggleMute);
volumeUpButton.addEventListener('click', volumeUpPressed);
volumeDownButton.addEventListener('click', volumeDownPressed);


//Get the current time past midnight in seconds
function getTime()
{
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    return (hours * 60 * 60) + (minutes * 60) + seconds;
}



async function readVideoJson() {
    try {
        // Use fetch to get the JSON file from the same directory
        const response = await fetch('videoList.json');
        
        // Check if the fetch was successful
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parse and return the JSON content
        const videoJson = await response.json();
        return videoJson;
    } catch (error) {
        // Handle any errors during fetch or parsing
        console.error('There was a problem with the fetch operation:', error);
        return [];  // Return an empty array or handle error as appropriate
    }
}

async function getVideoIndex() {
    json = await readVideoJson();
    const seconds = getTime();
    console.log(json);
    var result = [];

    for(var i in json)
        result.push([i, json [i]]);
    console.log("RESULTS");
    console.log(result);
    json = result;
    console.log("AM HERE");
    // Ensure that json is an array before filtering
    if (!Array.isArray(json)) {
        console.error('Fetched data is not an array');
        return null;
    }

    console.log(json);
    console.log("AM HERE2");
    // Filter the JSON with the videos thart are on the correct channel and are not in the future
    const channelVideos = json.filter(item => item[1].channel == channelID);

    console.log("Channel Videos:");
    console.log(channelVideos);
    const validVideos = channelVideos.filter(item => item[1].start_playing <= seconds);

    console.log("Valid Videos:");
    console.log(validVideos);

    // Find the closest video based on start_playing
    let closestVideo = validVideos[0]; // Start with the first valid video

    validVideos.forEach(item => {
        if (item[1].start_playing > closestVideo[1].start_playing) {
            closestVideo = item;
        }
    });
    console.log("Closest video:");
    console.log(closestVideo);

    //return closest video or null
    return closestVideo ? closestVideo : null;
}


async function loadVideo()
{
    video = await getVideoIndex();
    video = video[1];
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
        var time = getTime();
        //second argument is the time in seconds to start the video at
        var start_time = video.start_playing - time;
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
    volume = 50;
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
//Need 86400 seconds of videos for each channe;

//channels are as follows
//1 = Autos (videoCategoryId = 2)
//2 = Music (videoCategoryId = 10)
//3 = Sports (videoCategoryId = 17)
//4 = Gaming (videoCategoryId = 20)
//5 = People and Blogs (videoCategoryId = 22)
//6 = Comedy (videoCategoryId = 23)
//7 = Entertainment (videoCategoryId = 24)
//8 = News (videoCategoryId = 25)
//9 = Education (videoCategoryId = 27)
//10 = Science and Technology (videoCategoryId = 8)

