from urllib.parse import urlparse, parse_qs
from youtube_transcript_api import YouTubeTranscriptApi



def _extract_video_id(youtube_url: str) -> str:
    """
    Extract video ID from YouTube URL
    (ONLY used for youtube-transcript-api)
    """
    youtube_url = youtube_url.strip()
    parsed_url = urlparse(youtube_url)

    if parsed_url.hostname in ("www.youtube.com", "youtube.com"):
        video_id = parse_qs(parsed_url.query).get("v", [None])[0]
        if video_id:
            return video_id

    if parsed_url.hostname == "youtu.be":
        return parsed_url.path.lstrip("/")

    raise ValueError("Invalid YouTube URL")


def extract_text_from_youtube(youtube_url: str) -> str:
    """
    Try official YouTube Transcript API first.
    If it fails, fallback to yt-dlp subtitles.
    """
    youtube_url = youtube_url.strip()

    video_id = _extract_video_id(youtube_url)
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    return " ".join(item["text"] for item in transcript)

