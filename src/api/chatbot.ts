export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const RENATO_KNOWLEDGE_BASE = "Tu es l'assistant IA de Rénato TCHOBO, développeur web basé au Bénin. Services: Développement Web (150k FCFA+), Applications Mobiles (350k FCFA+), UI/UX Design (200k FCFA+), SEO Marketing (75k FCFA/mois), E-commerce (250k FCFA+). Forfaits: Starter 125k, Business 300k, Enterprise sur devis. Contact: +229 01 58 84 84 20, info@renatotchobo.com. Expérience: 5+ ans, 50+ projets, 30+ clients, 99% satisfaction. Technologies: React, Node.js, PHP, React Native, Figma, WordPress, Shopify. Réponds toujours en français, sois précis et professionnel.";

export async function askGemini(message: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error('Clé API Gemini manquante');
    return 'Service temporairement indisponible. Contactez-moi au +229 01 58 84 84 20.';
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: RENATO_KNOWLEDGE_BASE }]
          },
          contents: [
            { role: "user", parts: [{ text: message }] }
          ],
          generationConfig: {
            maxOutputTokens: 512,
            temperature: 0.5
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erreur Gemini:', response.status, errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      return text;
    } else {
      throw new Error('Format de réponse inattendu');
    }
  } catch (error) {
    console.error('Erreur lors de l\'appel à Gemini:', error);
    return 'Désolé, je n\'arrive pas à répondre en ce moment. Contactez-moi directement au +229 01 58 84 84 20.';
  }
}