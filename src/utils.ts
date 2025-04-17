import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export class ConfigManager {
  public static getConfigPath(): string {
    const platform = os.platform();
    if (platform === 'win32') {
      const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
      return path.join(appData, 'Claude', 'claude_desktop_config.json');
    } else {
      const homedir = os.homedir();
      return path.join(homedir, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
    }
  }
  public static addKeyValue(key: string, value: string): void {
    try {
      const configPath = this.getConfigPath();

      let configData: any = {};
      if (fs.existsSync(configPath)) {
        const fileContent = fs.readFileSync(configPath, 'utf8');
        configData = JSON.parse(fileContent);
      }

      if (!configData.mcpServers) {
        configData.mcpServers = {};
      }

      if (!configData.mcpServers['threads-dev']) {
        configData.mcpServers['threads-dev'] = {
          command: "node",
          args: [],
          env: {}
        };
      }

      if (!configData.mcpServers['threads-dev'].env) {
        configData.mcpServers['threads-dev'].env = {};
      }

      configData.mcpServers['threads-dev'].env.key = value;

      // Write the updated data back to the file
      fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));

      console.log(`${key} added to threads-dev env section successfully`);
    } catch (error) {
      console.error('Error updating config file:', error);
    }
  
  }
  
  public static addLongToken(longTokenValue: string): void {
    try {
      const configPath = this.getConfigPath();

      let configData: any = {};
      if (fs.existsSync(configPath)) {
        const fileContent = fs.readFileSync(configPath, 'utf8');
        configData = JSON.parse(fileContent);
      }

      if (!configData.mcpServers) {
        configData.mcpServers = {};
      }

      if (!configData.mcpServers['threads-dev']) {
        configData.mcpServers['threads-dev'] = {
          command: "node",
          args: [],
          env: {}
        };
      }

      if (!configData.mcpServers['threads-dev'].env) {
        configData.mcpServers['threads-dev'].env = {};
      }

      configData.mcpServers['threads-dev'].env.LONG_TOKEN = longTokenValue;

      // Write the updated data back to the file
      fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));

      console.log('LONG_TOKEN added to threads-dev env section successfully');
    } catch (error) {
      console.error('Error updating config file:', error);
    }
  }
}