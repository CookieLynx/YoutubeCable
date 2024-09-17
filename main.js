// main.js


var player;



//Get the current time past midnight in seconds
function getTime()
{
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    return (hours * 60 * 60) + (minutes * 60) + seconds;
}



function readVideoJson()
{
    //const videoJson = require('./videos.json');
    //console.log(videoJson);
}


function loadVideo()
{
    const json = readVideoJson();
    const seconds = getTime();

    //Find the video the player should be playing based on the current time and the channel

    //if the time the video should play time is behind the current time we need to jump forward in the video to a timestamp (second argument in loadVideoById)

    player.loadVideoById('uPrXEtvKFoI');  // Load the desired video
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

