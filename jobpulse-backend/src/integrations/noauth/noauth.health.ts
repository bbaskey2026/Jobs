import { noAuthService } from './noauth.service.js';

export async function checkNoAuthHealth() {
  return await noAuthService.checkHealth();
}
