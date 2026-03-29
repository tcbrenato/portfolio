export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const RENATO_KNOWLEDGE_BASE = "Tu es l'assistant IA de Rénato TCHOBO, développeur web basé au Bénin. Services: Développement Web (150k FCFA+), Applications Mobiles (350k FCFA+), UI/UX Design (200k FCFA+), SEO Marketing (75k FCFA/mois), E-commerce (250k FCFA+). Forfaits: Starter 125k, Business 300k, Enterprise sur devis. Contact: +229 01 58 84 84 20, info@renatotchobo.com. Expérience: 5+ ans, 50+ projets, 30+ clients, 99% satisfaction. Technologies: React, Node.js, PHP, React Native, Figma, WordPress, Shopify. Réponds toujours en français, sois précis et professionnel.";

export async function askGroq(message: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    console.error('Clé API Groq manquante');
    return 'Service temporairement indisponible. Contactez-moi au +229 01 58 84 84 20.';
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: RENATO_KNOWLEDGE_BASE },
          { role: "user", content: message }
        ],
        max_tokens: 512,
        temperature: 0.5
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erreur Groq:', response.status, errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      throw new Error('Format de réponse inattendu');
    }
  } catch (error) {
    console.error('Erreur lors de l\'appel à Groq:', error);
    return 'Désolé, je n\'arrive pas à répondre en ce moment. Contactez-moi directement au +229 01 58 84 84 20.';
  }
}