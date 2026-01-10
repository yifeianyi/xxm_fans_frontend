import { config } from '../config/config';
import { ISongService, IFanDIYService } from '../../domain/api/ISongService';
import { MockSongService, MockFanDIYService } from './MockSongService';
import { RealSongService, RealFanDIYService } from './RealSongService';

console.log('[API] Initializing services with config:', config.api);

let songService: ISongService;
let fanDIYService: IFanDIYService;

if (config.api.useMock) {
  console.log('[API] Condition met: useMock is true');
  songService = new MockSongService();
  fanDIYService = new MockFanDIYService();
  console.log('[API] Using Mock Service');
} else {
  console.log('[API] Condition met: useMock is false');
  songService = new RealSongService();
  fanDIYService = new RealFanDIYService();
  console.log('[API] Using Real Service:', config.api.baseURL);
}

export { songService, fanDIYService };
