import headerData from '../data/header.json';
import type { HeaderData } from '../types/header';

export const getHeaderData = (): HeaderData => headerData as HeaderData;
