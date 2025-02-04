export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' });
}

/**
 * API routes must be in pages/api/, otherwise Next.js will not recognize them.
 */
