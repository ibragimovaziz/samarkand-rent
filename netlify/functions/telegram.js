
export default async (request, context) => {
  const headers = {
    "Content-Type": "application/json"
  };

  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ ok: false, error: "Method not allowed" }),
      { status: 405, headers }
    );
  }

  try {
    const { name, phone, message } = await request.json();

    if (!name || !phone) {
      return new Response(
        JSON.stringify({ ok: false, error: "Name and phone required" }),
        { status: 400, headers }
      );
    }

    const token = Netlify.env.get("TELEGRAM_BOT_TOKEN");
    const chatId = Netlify.env.get("TELEGRAM_CHAT_ID");

    if (!token || !chatId) {
      throw new Error("Telegram settings missing");
    }

    const text = `Новая заявка Samarkand Rent\n\nИмя: ${name}\nТелефон: ${phone}\nСообщение: ${message || "Нет"}`;

    const result = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text
        })
      }
    );

    if (!result.ok) throw new Error("Telegram sending failed");

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ ok: false, error: "Server error" }),
      { status: 500, headers }
    );
  }
};
