export const YouTubeChannelId = 'UC4aVECc1ZdyNOYvuqD5fwgg';

export const getYouTubeSubscriberCount = async () => {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey || !YouTubeChannelId) {
    throw new Error('YOUTUBE_API_KEY 또는 YOUTUBE_CHANNEL_ID가 설정되지 않았습니다.');
  }

  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${YouTubeChannelId}&key=${apiKey}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 86400 } // 24시간 캐싱
    });
    if (!response.ok) {
      throw new Error(`YouTube API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      throw new Error('채널 데이터를 찾을 수 없습니다.');
    }

    return data.items[0].statistics.subscriberCount; // 첫 번째 채널 데이터 반환
  } catch (error) {
    console.error('YouTube API 호출 에러:', error.message);
    throw error;
  }
};

export const getYouTubeVideos = async () => {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey || !YouTubeChannelId) {
    throw new Error('YOUTUBE_API_KEY 또는 YOUTUBE_CHANNEL_ID가 설정되지 않았습니다.');
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YouTubeChannelId}&order=date&type=video&videoDuration=medium&maxResults=4&key=${apiKey}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 86400 } // 24시간 캐싱
    });
    if (!response.ok) {
      throw new Error(`YouTube API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      throw new Error('최근 동영상 데이터를 찾을 수 없습니다.');
    }

    // 동영상 ID와 썸네일 정보 반환
    return data.items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
    }));
  } catch (error) {
    console.error('YouTube API 호출 에러:', error.message);
    throw error;
  }
};
