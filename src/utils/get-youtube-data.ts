export const YouTubeChannelId = 'UC4aVECc1ZdyNOYvuqD5fwgg';

export const getYouTubeSubscriberCount = async () => {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey || !YouTubeChannelId) {
    throw new Error('YOUTUBE_API_KEY 또는 YOUTUBE_CHANNEL_ID가 설정되지 않았습니다.');
  }

  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${YouTubeChannelId}&key=${apiKey}`;

  try {
    const response = await fetch(url);
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
    const response = await fetch(url);
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

export const getYouTubeChannelThumbnail = async () => {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.warn('YOUTUBE_API_KEY가 설정되지 않았습니다. 기본 이미지를 사용합니다.');
    return '/assets/thumbnail.png';
  }

  try {
    // 채널 ID로 직접 조회
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${YouTubeChannelId}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    const channel = data.items?.[0];

    if (!channel) {
      throw new Error('채널 정보를 찾을 수 없습니다.');
    }

    // 채널 프로필 이미지 URL 반환
    const thumbnailUrl =
      channel.snippet.thumbnails.high?.url ||
      channel.snippet.thumbnails.medium?.url ||
      channel.snippet.thumbnails.default?.url;

    if (!thumbnailUrl) {
      throw new Error('썸네일 URL을 찾을 수 없습니다.');
    }

    return thumbnailUrl;
  } catch (error) {
    console.error('YouTube 채널 썸네일 가져오기 에러:', error.message);
    return '/assets/thumbnail.png'; // 에러 시 기본 이미지 반환
  }
};
