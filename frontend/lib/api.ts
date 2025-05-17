export async function postProcess(
  text: string,
  channel: 'chat' | 'messages' | 'timeline'
): Promise<{ id: string; valid: boolean; ghost: boolean; missing: string[] }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/process_request`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        user_id: process.env.NEXT_PUBLIC_USER_ID,
        tenant_id: process.env.NEXT_PUBLIC_TENANT_ID,
        channel,
      }),
    }
  );
  return res.json();
}
