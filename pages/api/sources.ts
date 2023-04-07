import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import sourceData from '../../utils/server/sources.json'; // Updated import

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      res.status(200).json({ fileContents: sourceData }); // Updated response
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to read source files' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
