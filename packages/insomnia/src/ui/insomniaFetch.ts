import { getApiBaseURL, getClientString, INSOMNIA_FETCH_TIME_OUT, PLAYWRIGHT } from '../common/constants';
import { generateId } from '../common/misc';

interface FetchConfig {
  method: 'POST' | 'PUT' | 'GET' | 'DELETE' | 'PATCH';
  path: string;
  sessionId: string | null;
  organizationId?: string | null;
  data?: unknown;
  retries?: number;
  origin?: string;
  headers?: Record<string, string>;
  onlyResolveOnSuccess?: boolean;
  timeout?: number;
}

export class ResponseFailError extends Error {
  constructor(msg: string, response: Response) {
    super(msg);
    this.response = response;
  }
  response;
  name = 'ResponseFailError';
}

// Adds headers, retries and opens deep links returned from the api
export async function insomniaFetch<T = void>({
  method,
  path,
  data,
  sessionId,
  organizationId,
  origin,
  headers,
  onlyResolveOnSuccess = false,
  timeout = INSOMNIA_FETCH_TIME_OUT,
}: FetchConfig): Promise<T> {
  switch (`${method} ${path}`) {
    case 'GET /v1/organizations': {
      return {
        organizations: [
          {
            id: 'org_personal',
            name: 'personal',
            display_name: 'Personal',
            branding: { logo_url: '' },
            metadata: { organizationType: 'personal', ownerAccountId: 'default_account' },
          },
        ],
      } as T;
    }
    case 'GET /v1/user/profile': {
      return {
        id: 'default_user',
        email: '',
        name: '',
        picture: '',
        bio: '',
        github: '',
        linkedin: '',
        twitter: '',
        identities: null,
        given_name: '',
        family_name: '',
      } as T;
    }
    case 'GET /v1/billing/current-plan': {
      return { isActive: true, period: 'year', planId: 'free', price: 0, quantity: 1, type: 'free' } as T;
    }
    default: {
      // window.alert(JSON.stringify({ method, path, data, sessionId, organizationId }));
      throw new Error(`No stub for endpoint: ${method} ${path}`);
    }
  }
}
