import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export async function withAuth(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Add user to request object
      req.user = session.user as { id: string; email: string; name: string };

      // Call the original handler
      return handler(req, res);
    } catch (error) {
      console.error('Auth Middleware Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
} 