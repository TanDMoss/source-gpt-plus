import fs from 'fs';
import path from 'path';

interface Source {
  name: string;
  content: string;
}

const loadSources = (): Source[] => {
  const sourcesFolderPath = path.join(__dirname, '..', '..', 'sources');
  const sourceFiles = fs.readdirSync(sourcesFolderPath);
  const sources: Source[] = [];

  for (const file of sourceFiles) {
    const filePath = path.join(sourcesFolderPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    sources.push({ name: file, content });
  }

  return sources;
};

export type { loadSources, Source };
