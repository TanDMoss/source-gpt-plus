import fetch from 'isomorphic-fetch';
import sources from './sources.json';

const OPENAI_API_KEY = 'OPENAI_API_KEY'; // Replace with your actual API key

interface ParaphraseResponse {
  choices: {
    text: string;
  }[];
}

// Function to search for the most relevant answer within the provided sources
export async function searchAnswer(query: string, fileContents: string[]): Promise<string> {
  const keywords = query.split(' ').map(word => word.toLowerCase());
  let bestMatch = { index: -1, count: 0 };

  fileContents.forEach((content, index) => {
    const words = content.split(' ').map(word => word.toLowerCase());
    let count = 0;
    keywords.forEach(keyword => {
      count += words.filter(word => word === keyword).length;
    });

    if (count > bestMatch.count) {
      bestMatch = { index, count };
    }
  });

  if (bestMatch.index !== -1) {
    return fileContents[bestMatch.index];
  } else {
    return '';
  }
}
import { OPENAI_API_HOST } from '../app/const';

// Function to paraphrase the answer found in the sources
export async function paraphraseAnswer(answer: string): Promise<string> {
  const prompt = `Please rephrase the following text in a more natural language format:\n\n"${answer}"\n\nRephrased text:`;

  const response = await fetch(`${OPENAI_API_HOST}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: prompt,
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.8,
    }),
  });

  const data = await response.json() as ParaphraseResponse;
  const paraphrased = data.choices[0].text.trim();
  return paraphrased;
}
