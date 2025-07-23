import { Express } from 'express';

export type FileMap = Record<string, Express.Multer.File[]>;
