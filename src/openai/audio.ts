export async function transcribeAudio({ audioUrl }: { audioUrl: string }) {
  const endpoint = 'http://192.168.2.139:8000/api/v1/audio/';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ audio_url: audioUrl }),
    });

    const data = await response.json();
    console.debug({ data });
    return data.text;
  } catch (error) {
    console.error({ error });
  }
}
