#pip install google-api-python-client is required for this code to work
#a config.json file must be created in the same directory as this file with the following format:
#{
#    "API_KEY": "YOUR_YOUTUBE_API_KEY"
#}
#Where YOUR_YOUTUBE_API_KEY is your youtube api key


import json
from googleapiclient.discovery import build

# Load API key from config file
def load_api_key():
    with open('config.json') as f:
        config = json.load(f)
    return config.get('API_KEY')

# Initialize the YouTube API client
API_KEY = load_api_key()
youtube = build('youtube', 'v3', developerKey=API_KEY)

def get_trending_videos():
    # Fetch trending videos
    request = youtube.videos().list(
        part='snippet,contentDetails',
        chart='mostPopular',
        regionCode='CA',  # Change region code if needed
        maxResults=50
    )
    response = request.execute()
    
    videos = response['items']
    return videos

def generate_json_list(videos):
    json_list = []
    total_runtime = 0

    for idx, video in enumerate(videos):
        video_id = video['id']
        snippet = video['snippet']
        content_details = video['contentDetails']

        # Video details
        duration_str = content_details['duration']
        duration_seconds = parse_duration(duration_str)
        start_playing = total_runtime
        total_runtime += duration_seconds

        # Generate JSON object
        json_obj = {
            "id": idx + 1,
            "video_id": video_id,
            "start_playing": start_playing,
            "video_length": duration_seconds,
            "channel": 0
        }
        json_list.append(json_obj)
    
    return json_list

def parse_duration(duration_str):
    import re
    # Extract duration in seconds from ISO 8601 duration format
    match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration_str)
    hours = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)
    return hours * 3600 + minutes * 60 + seconds

def main():
    videos = get_trending_videos()
    json_list = generate_json_list(videos)
    
    # Print the JSON list or save it to a file
    with open('videos.json', 'w') as f:
        json.dump(json_list, f, indent=4)
    
    print(json.dumps(json_list, indent=4))

if __name__ == "__main__":
    main()