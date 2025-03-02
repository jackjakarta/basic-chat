export async function transcribeYoutubeVideo({ videoUrl }: { videoUrl: string }) {
  if (videoUrl) {
    return videoUrl;
  }
  return undefined;
}
