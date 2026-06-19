import Alpine from 'alpinejs';
import { generatePassword, type PasswordProfile } from 'lesspass';

interface ProfileWithId extends PasswordProfile {
  id: string;
}

function profileId(p: PasswordProfile): string {
  return `${p.site}|${p.login}|${p.counter}`;
}

function deduplicate(profiles: ProfileWithId[]): ProfileWithId[] {
  const seen = new Map<string, ProfileWithId>();
  for (const p of profiles) seen.set(p.id, p);
  return Array.from(seen.values());
}

function filterProfiles(profiles: ProfileWithId[], query: string): ProfileWithId[] {
  if (!query.trim()) return profiles;
  const q = query.toLowerCase();
  return profiles.filter(p => p.site.toLowerCase().includes(q) || p.login.toLowerCase().includes(q));
}

interface AppStore {
  profiles: ProfileWithId[];
  query: string;
  masterPassword: string;
  genSite: string;
  genLogin: string;
  genLowercase: boolean;
  genUppercase: boolean;
  genDigits: boolean;
  genSymbols: boolean;
  genLength: number;
  genCounter: number;
  generatedPassword: string;
  error: string;
  importText: string;
  exportedJson: string;

  readonly filteredProfiles: ProfileWithId[];

  importJson(): void;
  fillGenerator(profile: ProfileWithId): void;
  generatePassword(): Promise<void>;
  removeProfile(id: string): void;
  exportJson(): void;
}

const defaults = {
  genLowercase: true,
  genUppercase: true,
  genDigits: true,
  genSymbols: true,
  genLength: 16,
  genCounter: 1,
};

Alpine.store('app', {
  profiles: [] as ProfileWithId[],
  query: '',
  masterPassword: '',
  genSite: '',
  genLogin: '',
  ...defaults,
  generatedPassword: '',
  error: '',
  importText: '',
  exportedJson: '',

  get filteredProfiles(): ProfileWithId[] {
    return filterProfiles(this.profiles, this.query);
  },

  importJson() {
    try {
      const raw = JSON.parse(this.importText);
      if (!Array.isArray(raw)) throw new Error('Le JSON doit être un tableau');
      const parsed: ProfileWithId[] = raw.map((item: Record<string, unknown>) => ({
        site: String(item.site ?? ''),
        login: String(item.login ?? ''),
        counter: Number(item.counter) || 1,
        uppercase: Boolean(item.uppercase),
        lowercase: Boolean(item.lowercase),
        digits: Boolean(item.digits),
        symbols: Boolean(item.symbols),
        length: Number(item.length) || 16,
        id: '',
      }));
      parsed.forEach(p => { p.id = profileId(p); });
      this.profiles = deduplicate([...this.profiles, ...parsed]);
      this.importText = '';
    } catch (e) {
      this.error = `Erreur d'import : ${(e as Error).message}`;
    }
  },

  fillGenerator(profile: ProfileWithId) {
    this.genSite = profile.site;
    this.genLogin = profile.login;
    this.genLowercase = profile.lowercase;
    this.genUppercase = profile.uppercase;
    this.genDigits = profile.digits;
    this.genSymbols = profile.symbols;
    this.genLength = profile.length;
    this.genCounter = profile.counter;
  },

  async generatePassword() {
    if (!this.masterPassword) {
      this.error = 'Veuillez entrer le mot de passe maître';
      return;
    }
    if (!this.genSite) {
      this.error = 'Veuillez entrer le site';
      return;
    }
    try {
      this.generatedPassword = await generatePassword(
        {
          site: this.genSite,
          login: this.genLogin,
          counter: this.genCounter,
          uppercase: this.genUppercase,
          lowercase: this.genLowercase,
          digits: this.genDigits,
          symbols: this.genSymbols,
          length: this.genLength,
        },
        this.masterPassword,
      );
      this.error = '';
    } catch (e) {
      this.error = `Erreur de génération : ${(e as Error).message}`;
    }
  },

  removeProfile(id: string) {
    this.profiles = this.profiles.filter(p => p.id !== id);
  },

  exportJson() {
    const clean = this.profiles.map(({ id, ...rest }) => rest);
    this.exportedJson = JSON.stringify(clean, null, '\t');
  },
} satisfies AppStore);

Alpine.start();
