import { Message } from '@/types/chat';
import { OpenAIModel } from '@/types/openai';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';
import { OPENAI_API_HOST } from '../app/const';
import fs from 'fs';
import path from 'path';
import fetch from 'isomorphic-fetch';



export class OpenAIError extends Error {
  type: string;
  param: string;
  code: string;

  constructor(message: string, type: string, param: string, code: string) {
    super(message);
    this.name = 'OpenAIError';
    this.type = type;
    this.param = param;
    this.code = code;
  }
}

import { searchAnswer, paraphraseAnswer } from './search_and_paraphrase';


async function fetchSources(): Promise<string[]> {
  const apiUrl = process.env.API_URL || 'http://localhost:3000';
  const res = await fetch(`${apiUrl}/api/sources`);
  console.log('Response:', res); // Add this line
  const data = await res.json();
  console.log('Data:', data); // Add this line
  console.log('Data from /api/sources:', data);
  return data.fileContents.map((file: { content: string }) => file.content);
}
debugger; 

async function processUserInput(query: string, sources: string[]): Promise<string> {
  const answer = await searchAnswer(query, sources);
  if (answer) {
    const paraphrasedAnswer = await paraphraseAnswer(answer);
    return paraphrasedAnswer;
  } else {
    return 'I could not find an answer to your question within the provided sources.';
  }
}
debugger; 

export const OpenAIStream = async (
  model: OpenAIModel,
  systemPrompt: string,
  key: string,
  messages: Message[],
): Promise<string> => {
  const sources = await fetchSources();
  console.log('Sources:', sources); // Add this line
  const userInput = messages[messages.length - 1].content;
  const paraphrasedAnswer = await processUserInput(userInput, sources);
  console.log('Paraphrased answer:', paraphrasedAnswer); // Add this line
  debugger; 

  return paraphrasedAnswer;
};

export const OpenAI = async (
  model: OpenAIModel,
  systemPrompt: string,
  key: string,
  messages: Message[],
): Promise<string> => {
  const apiUrl = process.env.API_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${apiUrl}/api/openai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        systemPrompt,
        key,
        messages,
      }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return 'An error occurred while fetching data from the API.'; // Add this line
  }
};


