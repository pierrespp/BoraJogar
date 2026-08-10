interface DiscordNotificationParams {
  webhookUrl: string;
  groupName: string;
  sessionUrl: string;
  createdByName?: string;
  gameCount?: number;
}

export async function sendDiscordSessionNotification({
  webhookUrl,
  groupName,
  sessionUrl,
  createdByName = 'Um membro do grupo',
  gameCount = 0,
}: DiscordNotificationParams): Promise<boolean> {
  if (!webhookUrl || !webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
    return false;
  }

  try {
    const payload = {
      username: 'BoraJogar Bot 🎮',
      avatar_url: 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg',
      embeds: [
        {
          title: `🎮 Hora de decidir! Nova votação aberta no ${groupName}!`,
          description: `**${createdByName}** iniciou uma sessão para escolher o jogo de hoje. Temos **${gameCount} jogos** na pauta!`,
          url: sessionUrl,
          color: 0x8b5cf6, // Violet / Purple
          fields: [
            {
              name: '⏱️ Tempo Estimado',
              value: 'Apenas 2 minutos para votar',
              inline: true,
            },
            {
              name: '🚀 Acessar Votação',
              value: `[Clique para Votar Agora](${sessionUrl})`,
              inline: true,
            },
          ],
          footer: {
            text: 'BoraJogar — Chega de paralisia de escolha!',
          },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (err) {
    console.error('Failed to send Discord webhook:', err);
    return false;
  }
}
