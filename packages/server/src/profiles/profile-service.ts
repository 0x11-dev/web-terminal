import { ShellProfile } from '@web-terminal/shared';
import { detectAvailableShells, getDefaultShell } from './shell-detector';
import * as fs from 'fs';
import * as path from 'path';

const CONFIG_DIR = path.join(process.env.HOME || '~', '.web-terminal');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

interface UserConfig {
  defaultProfile?: ShellProfile;
}

export class ProfileService {
  private profiles: ShellProfile[] = [];
  private defaultProfile: ShellProfile;
  private userConfig: UserConfig = {};

  constructor() {
    this.profiles = detectAvailableShells();
    this.loadUserConfig();
    this.defaultProfile = this.userConfig.defaultProfile || getDefaultShell();
  }

  private loadUserConfig(): void {
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
        this.userConfig = JSON.parse(content);
      }
    } catch (error) {
      console.warn('Failed to load user config:', error);
    }
  }

  private saveUserConfig(): void {
    try {
      if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true });
      }
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.userConfig, null, 2));
    } catch (error) {
      console.warn('Failed to save user config:', error);
    }
  }

  getProfiles(): ShellProfile[] {
    return this.profiles;
  }

  getDefaultProfile(): ShellProfile {
    return this.defaultProfile;
  }

  setDefaultProfile(profile: ShellProfile): void {
    // Validate the profile exists
    const exists = this.profiles.find(
      p => p.name === profile.name && p.path === profile.path
    );
    if (!exists) {
      throw new Error(`Invalid profile: ${profile.name}`);
    }
    this.defaultProfile = profile;
    this.userConfig.defaultProfile = profile;
    this.saveUserConfig();
  }
}
