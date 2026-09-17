import { describe, it, expect } from 'vitest';
import { slugify } from '../utils/slugify';

describe('Utility: Slugify', () => {
  it('should convert a standard string to lowercase with hyphens', () => {
    const result = slugify('My Portfolio Project');
    expect(result).toBe('my-portfolio-project');
  });

  it('should remove special characters', () => {
    const result = slugify('Next.js, Express & MongoDB!');
    expect(result).toBe('nextjs-express-mongodb');
  });

  it('should trim leading and trailing spaces and hyphens', () => {
    const result = slugify('  ---Hello World---  ');
    expect(result).toBe('hello-world');
  });

  it('should collapse multiple spaces into a single hyphen', () => {
    const result = slugify('Deep    Space    Nine');
    expect(result).toBe('deep-space-nine');
  });
});