//import videoList from './videoList.js';

// main.js
var player;
var channelID = 0;

const channelUpButton = document.getElementById('channelUp');
const channelDownButton = document.getElementById('channelDown');
const toggleMuteButton = document.getElementById('toggleMute');






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

channelUpButton.addEventListener('click', channelUpPressed);
channelDownButton.addEventListener('click', channelDownPressed);
toggleMuteButton.addEventListener('click', toggleMute);


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
        "video_id": "QaJbAennB_Q",
        "start_playing": 0,
        "video_length": 152,
        "channel": 0
    },
    {
        "id": 2,
        "video_id": "S-Wh4qalmKg",
        "start_playing": 152,
        "video_length": 712,
        "channel": 0
    },
    {
        "id": 3,
        "video_id": "F6iYcXynA4s",
        "start_playing": 864,
        "video_length": 149,
        "channel": 0
    },
    {
        "id": 4,
        "video_id": "CmcFFv3pmjo",
        "start_playing": 1013,
        "video_length": 52,
        "channel": 0
    },
    {
        "id": 5,
        "video_id": "SbvAaDN1bpE",
        "start_playing": 1065,
        "video_length": 707,
        "channel": 0
    },
    {
        "id": 6,
        "video_id": "biQqm1-RB_g",
        "start_playing": 1772,
        "video_length": 2201,
        "channel": 0
    },
    {
        "id": 7,
        "video_id": "HqgT5c9zip0",
        "start_playing": 3973,
        "video_length": 1245,
        "channel": 0
    },
    {
        "id": 8,
        "video_id": "6Los4BD0ikA",
        "start_playing": 5218,
        "video_length": 857,
        "channel": 0
    },
    {
        "id": 9,
        "video_id": "GGqPl7SRLYc",
        "start_playing": 6075,
        "video_length": 235,
        "channel": 0
    },
    {
        "id": 10,
        "video_id": "FRoEjAlhmsw",
        "start_playing": 6310,
        "video_length": 164,
        "channel": 0
    },
    {
        "id": 11,
        "video_id": "1cCIOlSQIT0",
        "start_playing": 6474,
        "video_length": 2066,
        "channel": 0
    },
    {
        "id": 12,
        "video_id": "36aW_jGdJ-s",
        "start_playing": 8540,
        "video_length": 317,
        "channel": 0
    },
    {
        "id": 13,
        "video_id": "3EgrU2T0_C4",
        "start_playing": 8857,
        "video_length": 1784,
        "channel": 0
    },
    {
        "id": 14,
        "video_id": "Z5LRjAS2-TQ",
        "start_playing": 10641,
        "video_length": 251,
        "channel": 0
    },
    {
        "id": 15,
        "video_id": "KTTBJI13WI4",
        "start_playing": 10892,
        "video_length": 317,
        "channel": 0
    },
    {
        "id": 16,
        "video_id": "OyhoHq-_Xms",
        "start_playing": 11209,
        "video_length": 207,
        "channel": 0
    },
    {
        "id": 17,
        "video_id": "SsNUHXvga_4",
        "start_playing": 11416,
        "video_length": 294,
        "channel": 0
    },
    {
        "id": 18,
        "video_id": "_9DhBT2luWk",
        "start_playing": 11710,
        "video_length": 2256,
        "channel": 0
    },
    {
        "id": 19,
        "video_id": "Ct24gs0rP_k",
        "start_playing": 13966,
        "video_length": 183,
        "channel": 0
    },
    {
        "id": 20,
        "video_id": "_1_gA2Deo3M",
        "start_playing": 14149,
        "video_length": 1157,
        "channel": 0
    },
    {
        "id": 21,
        "video_id": "6bzswzE_myE",
        "start_playing": 15306,
        "video_length": 1485,
        "channel": 0
    },
    {
        "id": 22,
        "video_id": "IOWYuncFMYQ",
        "start_playing": 16791,
        "video_length": 732,
        "channel": 0
    },
    {
        "id": 23,
        "video_id": "DQ8-CtiFn7w",
        "start_playing": 17523,
        "video_length": 2372,
        "channel": 0
    },
    {
        "id": 24,
        "video_id": "_YwrI5SlS8Q",
        "start_playing": 19895,
        "video_length": 1523,
        "channel": 0
    },
    {
        "id": 25,
        "video_id": "ID9Mv1r9jFE",
        "start_playing": 21418,
        "video_length": 184,
        "channel": 0
    },
    {
        "id": 26,
        "video_id": "qKMcKQCQxxI",
        "start_playing": 21602,
        "video_length": 1038,
        "channel": 0
    },
    {
        "id": 27,
        "video_id": "4x4hh8W1MzE",
        "start_playing": 22640,
        "video_length": 604,
        "channel": 0
    },
    {
        "id": 28,
        "video_id": "COsGJ5Fpq3o",
        "start_playing": 23244,
        "video_length": 117,
        "channel": 0
    },
    {
        "id": 29,
        "video_id": "4_RXdX68tXQ",
        "start_playing": 23361,
        "video_length": 2597,
        "channel": 0
    },
    {
        "id": 30,
        "video_id": "9fZQZ0Ubdlw",
        "start_playing": 25958,
        "video_length": 1109,
        "channel": 0
    },
    {
        "id": 31,
        "video_id": "GEieqZy0aqI",
        "start_playing": 27067,
        "video_length": 163,
        "channel": 0
    },
    {
        "id": 32,
        "video_id": "ZsmQYHbjGnQ",
        "start_playing": 27230,
        "video_length": 386,
        "channel": 0
    },
    {
        "id": 33,
        "video_id": "0jXqyG1G1J0",
        "start_playing": 27616,
        "video_length": 1681,
        "channel": 0
    },
    {
        "id": 34,
        "video_id": "9XhLOTO2scs",
        "start_playing": 29297,
        "video_length": 130,
        "channel": 0
    },
    {
        "id": 35,
        "video_id": "RucEj-nKiMg",
        "start_playing": 29427,
        "video_length": 1632,
        "channel": 0
    },
    {
        "id": 36,
        "video_id": "Mu8ozThE89Y",
        "start_playing": 31059,
        "video_length": 1413,
        "channel": 0
    },
    {
        "id": 37,
        "video_id": "V80MGYrWWaM",
        "start_playing": 32472,
        "video_length": 807,
        "channel": 0
    },
    {
        "id": 38,
        "video_id": "1NZOPBBDM8U",
        "start_playing": 33279,
        "video_length": 878,
        "channel": 0
    },
    {
        "id": 39,
        "video_id": "Bkj9eA77WLU",
        "start_playing": 34157,
        "video_length": 1776,
        "channel": 0
    },
    {
        "id": 40,
        "video_id": "tmSzoy8cl8Y",
        "start_playing": 35933,
        "video_length": 1021,
        "channel": 0
    },
    {
        "id": 41,
        "video_id": "7DIbsVHFXmw",
        "start_playing": 36954,
        "video_length": 928,
        "channel": 0
    },
    {
        "id": 42,
        "video_id": "3nQV-gT2ijU",
        "start_playing": 37882,
        "video_length": 30,
        "channel": 0
    },
    {
        "id": 43,
        "video_id": "bghn4prC7i0",
        "start_playing": 37912,
        "video_length": 16,
        "channel": 0
    },
    {
        "id": 44,
        "video_id": "Br8_YASkfb8",
        "start_playing": 37928,
        "video_length": 570,
        "channel": 0
    },
    {
        "id": 45,
        "video_id": "OALmcVG0hGM",
        "start_playing": 38498,
        "video_length": 72,
        "channel": 0
    },
    {
        "id": 46,
        "video_id": "7jW448KZQyw",
        "start_playing": 38570,
        "video_length": 3463,
        "channel": 0
    },
    {
        "id": 47,
        "video_id": "hh3p_MsIW_A",
        "start_playing": 42033,
        "video_length": 267,
        "channel": 0
    },
    {
        "id": 48,
        "video_id": "YIjL3Zl7-BE",
        "start_playing": 42300,
        "video_length": 1023,
        "channel": 0
    },
    {
        "id": 49,
        "video_id": "SoY7tljdqyE",
        "start_playing": 43323,
        "video_length": 422,
        "channel": 0
    },
    {
        "id": 50,
        "video_id": "bQo-Gbx9Xhs",
        "start_playing": 43745,
        "video_length": 853,
        "channel": 0
    },
    {
        "id": 1,
        "video_id": "QaJbAennB_Q",
        "start_playing": 43745,
        "video_length": 152,
        "channel": 0
    },
    {
        "id": 2,
        "video_id": "SbvAaDN1bpE",
        "start_playing": 43897,
        "video_length": 707,
        "channel": 0
    },
    {
        "id": 3,
        "video_id": "36aW_jGdJ-s",
        "start_playing": 44604,
        "video_length": 317,
        "channel": 0
    },
    {
        "id": 4,
        "video_id": "S-Wh4qalmKg",
        "start_playing": 44921,
        "video_length": 712,
        "channel": 0
    },
    {
        "id": 5,
        "video_id": "F6iYcXynA4s",
        "start_playing": 45633,
        "video_length": 149,
        "channel": 0
    },
    {
        "id": 6,
        "video_id": "6Los4BD0ikA",
        "start_playing": 45782,
        "video_length": 857,
        "channel": 0
    },
    {
        "id": 7,
        "video_id": "CmcFFv3pmjo",
        "start_playing": 46639,
        "video_length": 52,
        "channel": 0
    },
    {
        "id": 8,
        "video_id": "1cCIOlSQIT0",
        "start_playing": 46691,
        "video_length": 2066,
        "channel": 0
    },
    {
        "id": 9,
        "video_id": "biQqm1-RB_g",
        "start_playing": 48757,
        "video_length": 2201,
        "channel": 0
    },
    {
        "id": 10,
        "video_id": "_YwrI5SlS8Q",
        "start_playing": 50958,
        "video_length": 1523,
        "channel": 0
    },
    {
        "id": 11,
        "video_id": "6bzswzE_myE",
        "start_playing": 52481,
        "video_length": 1485,
        "channel": 0
    },
    {
        "id": 12,
        "video_id": "wrFsapf0Enk",
        "start_playing": 53966,
        "video_length": 8798,
        "channel": 0
    },
    {
        "id": 13,
        "video_id": "qKMcKQCQxxI",
        "start_playing": 62764,
        "video_length": 1038,
        "channel": 0
    },
    {
        "id": 14,
        "video_id": "_9DhBT2luWk",
        "start_playing": 63802,
        "video_length": 2256,
        "channel": 0
    },
    {
        "id": 15,
        "video_id": "ZsmQYHbjGnQ",
        "start_playing": 66058,
        "video_length": 386,
        "channel": 0
    },
    {
        "id": 16,
        "video_id": "4x4hh8W1MzE",
        "start_playing": 66444,
        "video_length": 604,
        "channel": 0
    },
    {
        "id": 17,
        "video_id": "4_RXdX68tXQ",
        "start_playing": 67048,
        "video_length": 2597,
        "channel": 0
    },
    {
        "id": 18,
        "video_id": "FRoEjAlhmsw",
        "start_playing": 69645,
        "video_length": 164,
        "channel": 0
    },
    {
        "id": 19,
        "video_id": "HqgT5c9zip0",
        "start_playing": 69809,
        "video_length": 1245,
        "channel": 0
    },
    {
        "id": 20,
        "video_id": "OALmcVG0hGM",
        "start_playing": 71054,
        "video_length": 72,
        "channel": 0
    },
    {
        "id": 21,
        "video_id": "9fZQZ0Ubdlw",
        "start_playing": 71126,
        "video_length": 1109,
        "channel": 0
    },
    {
        "id": 22,
        "video_id": "Mu8ozThE89Y",
        "start_playing": 72235,
        "video_length": 1413,
        "channel": 0
    },
    {
        "id": 23,
        "video_id": "1NZOPBBDM8U",
        "start_playing": 73648,
        "video_length": 878,
        "channel": 0
    },
    {
        "id": 24,
        "video_id": "COsGJ5Fpq3o",
        "start_playing": 74526,
        "video_length": 117,
        "channel": 0
    },
    {
        "id": 25,
        "video_id": "Bkj9eA77WLU",
        "start_playing": 74643,
        "video_length": 1776,
        "channel": 0
    },
    {
        "id": 26,
        "video_id": "DQ8-CtiFn7w",
        "start_playing": 76419,
        "video_length": 2372,
        "channel": 0
    },
    {
        "id": 27,
        "video_id": "tmSzoy8cl8Y",
        "start_playing": 78791,
        "video_length": 1021,
        "channel": 0
    },
    {
        "id": 28,
        "video_id": "0jXqyG1G1J0",
        "start_playing": 79812,
        "video_length": 1681,
        "channel": 0
    },
    {
        "id": 29,
        "video_id": "Br8_YASkfb8",
        "start_playing": 81493,
        "video_length": 570,
        "channel": 0
    },
    {
        "id": 30,
        "video_id": "YIjL3Zl7-BE",
        "start_playing": 82063,
        "video_length": 1023,
        "channel": 0
    },
    {
        "id": 31,
        "video_id": "7ynDOY1PR74",
        "start_playing": 83086,
        "video_length": 491,
        "channel": 0
    },
    {
        "id": 32,
        "video_id": "IOWYuncFMYQ",
        "start_playing": 83577,
        "video_length": 732,
        "channel": 0
    },
    {
        "id": 33,
        "video_id": "7jW448KZQyw",
        "start_playing": 84309,
        "video_length": 3463,
        "channel": 0
    },
    {
        "id": 34,
        "video_id": "SoY7tljdqyE",
        "start_playing": 87772,
        "video_length": 422,
        "channel": 0
    },
    {
        "id": 35,
        "video_id": "hh3p_MsIW_A",
        "start_playing": 88194,
        "video_length": 267,
        "channel": 0
    },
    {
        "id": 36,
        "video_id": "OyhoHq-_Xms",
        "start_playing": 88461,
        "video_length": 207,
        "channel": 0
    },
    {
        "id": 37,
        "video_id": "GEieqZy0aqI",
        "start_playing": 88668,
        "video_length": 163,
        "channel": 0
    },
    {
        "id": 38,
        "video_id": "bQo-Gbx9Xhs",
        "start_playing": 88831,
        "video_length": 853,
        "channel": 0
    },
    {
        "id": 39,
        "video_id": "RucEj-nKiMg",
        "start_playing": 89684,
        "video_length": 1632,
        "channel": 0
    },
    {
        "id": 40,
        "video_id": "Z5LRjAS2-TQ",
        "start_playing": 91316,
        "video_length": 251,
        "channel": 0
    },
    {
        "id": 41,
        "video_id": "-e11wcNO_CU",
        "start_playing": 91567,
        "video_length": 557,
        "channel": 0
    },
    {
        "id": 42,
        "video_id": "snfWFBhJggU",
        "start_playing": 92124,
        "video_length": 942,
        "channel": 0
    },
    {
        "id": 43,
        "video_id": "3nQV-gT2ijU",
        "start_playing": 93066,
        "video_length": 30,
        "channel": 0
    },
    {
        "id": 44,
        "video_id": "Qfkm13T_MIY",
        "start_playing": 93096,
        "video_length": 422,
        "channel": 0
    },
    {
        "id": 45,
        "video_id": "cUklhL1cGqY",
        "start_playing": 93518,
        "video_length": 1315,
        "channel": 0
    },
    {
        "id": 46,
        "video_id": "3EgrU2T0_C4",
        "start_playing": 94833,
        "video_length": 1784,
        "channel": 0
    },
    {
        "id": 47,
        "video_id": "Ys7L5rFN4PA",
        "start_playing": 96617,
        "video_length": 1914,
        "channel": 0
    },
    {
        "id": 48,
        "video_id": "b2XI3O5DiiQ",
        "start_playing": 98531,
        "video_length": 2402,
        "channel": 0
    },
    {
        "id": 49,
        "video_id": "TdeRdPB-JHY",
        "start_playing": 100933,
        "video_length": 117,
        "channel": 0
    },
    {
        "id": 50,
        "video_id": "6Kbp2uDIdNE",
        "start_playing": 101050,
        "video_length": 813,
        "channel": 0
    },
    {
        "id": 1,
        "video_id": "xUB-CYsjW5U",
        "start_playing": 0,       
        "video_length": 60,       
        "channel": 1
    },
    {
        "id": 2,
        "video_id": "EMlBfpO1DDo",
        "start_playing": 60,      
        "video_length": 60,       
        "channel": 1
    },
    {
        "id": 3,
        "video_id": "syNaaKrgIoo",
        "start_playing": 120,
        "video_length": 60,
        "channel": 1
    },
    {
        "id": 4,
        "video_id": "aBr7RlGH0D0",
        "start_playing": 180,
        "video_length": 35,
        "channel": 1
    },
    {
        "id": 5,
        "video_id": "AFE0e8yq5ec",
        "start_playing": 215,
        "video_length": 56,
        "channel": 1
    },
    {
        "id": 6,
        "video_id": "6-eev0-6WS8",
        "start_playing": 271,
        "video_length": 56,
        "channel": 1
    },
    {
        "id": 7,
        "video_id": "oDcRaOQBNSE",
        "start_playing": 327,
        "video_length": 20,
        "channel": 1
    },
    {
        "id": 8,
        "video_id": "kEyCBL8qv20",
        "start_playing": 347,
        "video_length": 60,
        "channel": 1
    },
    {
        "id": 9,
        "video_id": "cJO5AW5YdyQ",
        "start_playing": 407,
        "video_length": 49,
        "channel": 1
    },
    {
        "id": 10,
        "video_id": "blKIIFk9r8I",
        "start_playing": 456,
        "video_length": 17,
        "channel": 1
    },
    {
        "id": 11,
        "video_id": "uDfYF-qTJLs",
        "start_playing": 473,
        "video_length": 60,
        "channel": 1
    },
    {
        "id": 12,
        "video_id": "PrXgW8kAcsc",
        "start_playing": 533,
        "video_length": 29,
        "channel": 1
    },
    {
        "id": 13,
        "video_id": "iVGeVgeMxhA",
        "start_playing": 562,
        "video_length": 1043,
        "channel": 1
    },
    {
        "id": 14,
        "video_id": "_-OerslnkhA",
        "start_playing": 1605,
        "video_length": 59,
        "channel": 1
    },
    {
        "id": 15,
        "video_id": "5gS4GjKib8k",
        "start_playing": 1664,
        "video_length": 60,
        "channel": 1
    },
    {
        "id": 16,
        "video_id": "Ax8e-ny8Hlg",
        "start_playing": 1724,
        "video_length": 57,
        "channel": 1
    },
    {
        "id": 17,
        "video_id": "JcitC_0ETxY",
        "start_playing": 1781,
        "video_length": 54,
        "channel": 1
    },
    {
        "id": 18,
        "video_id": "O7mi0aaNOR4",
        "start_playing": 1835,
        "video_length": 52,
        "channel": 1
    },
    {
        "id": 19,
        "video_id": "4ElqOXVx7ys",
        "start_playing": 1887,
        "video_length": 10,
        "channel": 1
    },
    {
        "id": 20,
        "video_id": "nfZ2RXK_J7U",
        "start_playing": 1897,
        "video_length": 57,
        "channel": 1
    },
    {
        "id": 21,
        "video_id": "Gl8LbhWu4fg",
        "start_playing": 1954,
        "video_length": 61,
        "channel": 1
    },
    {
        "id": 22,
        "video_id": "zre-KLMXJ20",
        "start_playing": 2015,
        "video_length": 57,
        "channel": 1
    },
    {
        "id": 23,
        "video_id": "yysF79-bXO8",
        "start_playing": 2072,
        "video_length": 60,
        "channel": 1
    },
    {
        "id": 24,
        "video_id": "M3q29WvcSG4",
        "start_playing": 2132,
        "video_length": 15,
        "channel": 1
    },
    {
        "id": 25,
        "video_id": "eoMefkYfHU8",
        "start_playing": 2147,
        "video_length": 23,
        "channel": 1
    },
    {
        "id": 26,
        "video_id": "auGtRVB6pKA",
        "start_playing": 2170,
        "video_length": 60,
        "channel": 1
    },
    {
        "id": 27,
        "video_id": "_gP2-3wfe6U",
        "start_playing": 2230,
        "video_length": 13,
        "channel": 1
    },
    {
        "id": 28,
        "video_id": "Z4QkUNQgyyI",
        "start_playing": 2243,
        "video_length": 18,
        "channel": 1
    },
    {
        "id": 29,
        "video_id": "cmOUH1Xq1Po",
        "start_playing": 2261,
        "video_length": 60,
        "channel": 1
    },
    {
        "id": 30,
        "video_id": "9g2Hwhak0_Q",
        "start_playing": 2321,
        "video_length": 53,
        "channel": 1
    },
    {
        "id": 31,
        "video_id": "Zh5lqjzWfQo",
        "start_playing": 2374,
        "video_length": 60,
        "channel": 1
    },
    {
        "id": 32,
        "video_id": "2-wGvYPqHvg",
        "start_playing": 2434,
        "video_length": 61,
        "channel": 1
    },
    {
        "id": 33,
        "video_id": "7k6m44eSoRo",
        "start_playing": 2495,
        "video_length": 60,
        "channel": 1
    },
    {
        "id": 34,
        "video_id": "fMHoIv5ZvGo",
        "start_playing": 2555,
        "video_length": 58,
        "channel": 1
    },
    {
        "id": 35,
        "video_id": "xW7h9hadHN4",
        "start_playing": 2613,
        "video_length": 44,
        "channel": 1
    },
    {
        "id": 36,
        "video_id": "ejFp3i0jJF0",
        "start_playing": 2657,
        "video_length": 34,
        "channel": 1
    },
    {
        "id": 37,
        "video_id": "rj2w1Jkd41E",
        "start_playing": 2691,
        "video_length": 57,
        "channel": 1
    },
    {
        "id": 38,
        "video_id": "_pg8NCwSB8I",
        "start_playing": 2748,
        "video_length": 14,
        "channel": 1
    },
    {
        "id": 39,
        "video_id": "rYjNEXP2mBQ",
        "start_playing": 2762,
        "video_length": 11,
        "channel": 1
    },
    {
        "id": 40,
        "video_id": "TCzSfo4zwhA",
        "start_playing": 2773,
        "video_length": 57,
        "channel": 1
    },
    {
        "id": 41,
        "video_id": "9zZebC3PLak",
        "start_playing": 2830,
        "video_length": 53,
        "channel": 1
    },
    {
        "id": 42,
        "video_id": "lyJzaRkpfHI",
        "start_playing": 2883,
        "video_length": 60,
        "channel": 1
    },
    {
        "id": 43,
        "video_id": "ImbQebAt3b4",
        "start_playing": 2943,
        "video_length": 60,
        "channel": 1
    },
    {
        "id": 44,
        "video_id": "a6vx8dJgc8s",
        "start_playing": 3003,
        "video_length": 56,
        "channel": 1
    },
    {
        "id": 45,
        "video_id": "nEJc1c7q6VY",
        "start_playing": 3059,
        "video_length": 60,
        "channel": 1
    },
    {
        "id": 46,
        "video_id": "xuU-2BqqAZo",
        "start_playing": 3119,
        "video_length": 13,
        "channel": 1
    },
    {
        "id": 47,
        "video_id": "W5jhGt3N0PY",
        "start_playing": 3132,
        "video_length": 60,
        "channel": 1
    },
    {
        "id": 48,
        "video_id": "uUmFJJr33fk",
        "start_playing": 3192,
        "video_length": 61,
        "channel": 1
    },
    {
        "id": 49,
        "video_id": "Yup1GKtmAjw",
        "start_playing": 3253,
        "video_length": 60,
        "channel": 1
    },
    {
        "id": 50,
        "video_id": "9ywZaOcfUm8",
        "start_playing": 3313,
        "video_length": 60,
        "channel": 1
    },
    {
        "id": 1,
        "video_id": "9zkGauo6inI",
        "start_playing": 0,
        "video_length": 953,
        "channel": 2
    },
    {
        "id": 2,
        "video_id": "yg7Oxq0V0bw",
        "start_playing": 953,
        "video_length": 281,
        "channel": 2
    },
    {
        "id": 3,
        "video_id": "6v0eQ2gzvc8",
        "start_playing": 1234,
        "video_length": 787,
        "channel": 2
    },
    {
        "id": 4,
        "video_id": "_a8JaRmLHbc",
        "start_playing": 2021,
        "video_length": 1278,
        "channel": 2
    },
    {
        "id": 5,
        "video_id": "2th7vYbFg1Q",
        "start_playing": 3299,
        "video_length": 824,
        "channel": 2
    },
    {
        "id": 6,
        "video_id": "UOkY2VbGX3Q",
        "start_playing": 4123,
        "video_length": 529,
        "channel": 2
    },
    {
        "id": 7,
        "video_id": "aEf4WEbOb-s",
        "start_playing": 4652,
        "video_length": 651,
        "channel": 2
    },
    {
        "id": 8,
        "video_id": "CmcFFv3pmjo",
        "start_playing": 5303,
        "video_length": 52,
        "channel": 2
    },
    {
        "id": 9,
        "video_id": "LQ0rdIvAc6I",
        "start_playing": 5355,
        "video_length": 2310,
        "channel": 2
    },
    {
        "id": 10,
        "video_id": "k-iYRkNliXw",
        "start_playing": 7665,
        "video_length": 2517,
        "channel": 2
    },
    {
        "id": 11,
        "video_id": "6Los4BD0ikA",
        "start_playing": 10182,
        "video_length": 857,
        "channel": 2
    },
    {
        "id": 12,
        "video_id": "9q2g5OSt2Ok",
        "start_playing": 11039,
        "video_length": 9874,
        "channel": 2
    },
    {
        "id": 13,
        "video_id": "U8Dw2VQsLfM",
        "start_playing": 20913,
        "video_length": 1417,
        "channel": 2
    },
    {
        "id": 14,
        "video_id": "cWSp75_E5Cs",
        "start_playing": 22330,
        "video_length": 2926,
        "channel": 2
    },
    {
        "id": 15,
        "video_id": "ktROcHKe43c",
        "start_playing": 25256,
        "video_length": 2462,
        "channel": 2
    },
    {
        "id": 16,
        "video_id": "AfpyWIqLOAs",
        "start_playing": 27718,
        "video_length": 489,
        "channel": 2
    },
    {
        "id": 17,
        "video_id": "qIg3IiQDdAs",
        "start_playing": 28207,
        "video_length": 563,
        "channel": 2
    },
    {
        "id": 18,
        "video_id": "HqgT5c9zip0",
        "start_playing": 28770,
        "video_length": 1245,
        "channel": 2
    },
    {
        "id": 19,
        "video_id": "3L8FLyNxm6w",
        "start_playing": 30015,
        "video_length": 1546,
        "channel": 2
    },
    {
        "id": 20,
        "video_id": "g_ja-Fpyg-M",
        "start_playing": 31561,
        "video_length": 1133,
        "channel": 2
    },
    {
        "id": 21,
        "video_id": "1qToWgXWRm0",
        "start_playing": 32694,
        "video_length": 1084,
        "channel": 2
    },
    {
        "id": 22,
        "video_id": "Z1_j3hQDVWM",
        "start_playing": 33778,
        "video_length": 508,
        "channel": 2
    },
    {
        "id": 23,
        "video_id": "1cCIOlSQIT0",
        "start_playing": 34286,
        "video_length": 2066,
        "channel": 2
    },
    {
        "id": 24,
        "video_id": "6bzswzE_myE",
        "start_playing": 36352,
        "video_length": 1485,
        "channel": 2
    },
    {
        "id": 25,
        "video_id": "OetVoc67ZNk",
        "start_playing": 37837,
        "video_length": 1371,
        "channel": 2
    },
    {
        "id": 26,
        "video_id": "TJT3XsoQCYY",
        "start_playing": 39208,
        "video_length": 831,
        "channel": 2
    },
    {
        "id": 27,
        "video_id": "R-CQnaRBjR8",
        "start_playing": 40039,
        "video_length": 1196,
        "channel": 2
    },
    {
        "id": 28,
        "video_id": "YyqBqrbpSWU",
        "start_playing": 41235,
        "video_length": 4500,
        "channel": 2
    },
    {
        "id": 29,
        "video_id": "G30x2dddJsY",
        "start_playing": 45735,
        "video_length": 30,
        "channel": 2
    },
    {
        "id": 30,
        "video_id": "s4eizlFcz_I",
        "start_playing": 45765,
        "video_length": 627,
        "channel": 2
    },
    {
        "id": 31,
        "video_id": "IF83YO_c-48",
        "start_playing": 46392,
        "video_length": 12266,
        "channel": 2
    },
    {
        "id": 32,
        "video_id": "soMjH8Zgdl0",
        "start_playing": 58658,
        "video_length": 1531,
        "channel": 2
    },
    {
        "id": 33,
        "video_id": "tiX1-FGXwa0",
        "start_playing": 60189,
        "video_length": 672,
        "channel": 2
    },
    {
        "id": 34,
        "video_id": "-SYy6izgPE8",
        "start_playing": 60861,
        "video_length": 2665,
        "channel": 2
    },
    {
        "id": 35,
        "video_id": "WGHkUPngPYw",
        "start_playing": 63526,
        "video_length": 20559,
        "channel": 2
    },
    {
        "id": 36,
        "video_id": "9vq4wWHiHrM",
        "start_playing": 84085,
        "video_length": 2412,
        "channel": 2
    },
    {
        "id": 37,
        "video_id": "0nmal8-qrWI",
        "start_playing": 86497,
        "video_length": 831,
        "channel": 2
    },
    {
        "id": 38,
        "video_id": "HgZwhEgOxps",
        "start_playing": 87328,
        "video_length": 1027,
        "channel": 2
    },
    {
        "id": 39,
        "video_id": "oDR43HIdmfc",
        "start_playing": 88355,
        "video_length": 970,
        "channel": 2
    },
    {
        "id": 40,
        "video_id": "6sxzE56TMVA",
        "start_playing": 89325,
        "video_length": 1741,
        "channel": 2
    },
    {
        "id": 41,
        "video_id": "8_EGLSoeqvQ",
        "start_playing": 91066,
        "video_length": 262,
        "channel": 2
    },
    {
        "id": 42,
        "video_id": "84v5xjza5jU",
        "start_playing": 91328,
        "video_length": 1865,
        "channel": 2
    },
    {
        "id": 43,
        "video_id": "znBgI2iy3l0",
        "start_playing": 93193,
        "video_length": 1340,
        "channel": 2
    },
    {
        "id": 44,
        "video_id": "xwKxofTEGAU",
        "start_playing": 94533,
        "video_length": 2491,
        "channel": 2
    },
    {
        "id": 45,
        "video_id": "HpZ20Rjo_xI",
        "start_playing": 97024,
        "video_length": 418,
        "channel": 2
    },
    {
        "id": 46,
        "video_id": "ajjro_QUmCA",
        "start_playing": 97442,
        "video_length": 8409,
        "channel": 2
    },
    {
        "id": 47,
        "video_id": "t-mqPEWVGnA",
        "start_playing": 105851,
        "video_length": 3671,
        "channel": 2
    },
    {
        "id": 48,
        "video_id": "9mH1T1rB6mA",
        "start_playing": 109522,
        "video_length": 1035,
        "channel": 2
    },
    {
        "id": 49,
        "video_id": "B8e5o31Mvtg",
        "start_playing": 110557,
        "video_length": 13692,
        "channel": 2
    },
    {
        "id": 50,
        "video_id": "19SFt7G2_cw",
        "start_playing": 124249,
        "video_length": 43,
        "channel": 2
    }
    
];

