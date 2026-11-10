export async function readApiResponse(response) {
  const body = await response.text();

  if (!body.trim()) {
    const status = `${response.status} ${response.statusText}`.trim();
    throw new Error(
      response.ok
        ? "The API returned an empty response. Check the Vercel function logs."
        : `The API is unavailable (${status}). Start the app with Vercel so its API routes are running.`,
    );
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new Error(
      response.ok
        ? "The API returned an invalid response. Check the Vercel function logs."
        : `The API is unavailable (${response.status}). Start the app with Vercel so its API routes are running.`,
    );
  }
}
