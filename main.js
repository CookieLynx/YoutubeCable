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
    }
    
];

