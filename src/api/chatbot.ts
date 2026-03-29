export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const RENATO_KNOWLEDGE_BASE = "Tu es l'assistant IA de Rénato TCHOBO (Bénin). Services: Développement Web (150k FCFA+), Applications Mobiles (350k FCFA+), UI/UX Design (200k FCFA+), SEO Marketing (75k FCFA/mois), E-commerce (250k FCFA+). Forfaits: Starter 125k, Business 300k, Enterprise sur devis. Contact: +229 01 58 84 84 20, info@renatotchobo.com. Expérience: 5+ ans, 50+ projets, 30+ clients, 99% satisfaction. Technologies: React, Node.js, PHP, React Native, Figma, WordPress, Shopify. Réponds en français, sois précis et professionnel.";

export async function askGroq(message: string): Promise<string> {
  try {
    if (!message || typeof message !== "string") {
      return "Message invalide. Veuillez réessayer.";
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
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
    return 'Désolé, je n\'arrive pas à répondre en ce moment. Veuillez essayer dans quelques instants ou me contacter directement au +229 01 58 84 84 20.';
  }
}

// Fonction de fallback Hugging Face (optionnelle)
export async function askHuggingFace(question: string): Promise<string> {
  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: question,
          parameters: {
            max_length: 100,
            temperature: 0.7,
            do_sample: true,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data[0].generated_text || data[0].text || 'Désolé, je n\'ai pas pu générer une réponse.';
    } else if (data.generated_text) {
      return data.generated_text;
    } else if (data.text) {
      return data.text;
    } else {
      return 'Désolé, je n\'ai pas pu comprendre votre question.';
    }
  } catch (error) {
    console.error('Erreur lors de l\'appel à Hugging Face:', error);
    return 'Désolé, une erreur s\'est produite. Veuillez réessayer plus tard.';
  }
}
