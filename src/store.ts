import Alpine from 'alpinejs';
import { generatePassword, buildFingerprint, type PasswordProfile, type Fingerprint } from 'lesspass';

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

const ICON_TO_EMOJI: Record<string, string> = {
  'fa-hashtag': '#️', 'fa-heart': '❤️', 'fa-hotel': '🏨',
  'fa-university': '🎓', 'fa-plug': '🔌', 'fa-ambulance': '🚑',
  'fa-bus': '🚌', 'fa-car': '🚗', 'fa-plane': '✈️',
  'fa-rocket': '🚀', 'fa-ship': '🚢', 'fa-subway': '🚇',
  'fa-truck': '🚚', 'fa-jpy': '💴', 'fa-eur': '💶',
  'fa-btc': '₿', 'fa-usd': '💵', 'fa-gbp': '💷',
  'fa-archive': '🗄️', 'fa-area-chart': '📈', 'fa-bed': '🛏️',
  'fa-beer': '🍺', 'fa-bell': '🔔', 'fa-binoculars': '🔭',
  'fa-birthday-cake': '🎂', 'fa-bomb': '💣', 'fa-briefcase': '💼',
  'fa-bug': '🐛', 'fa-camera': '📷', 'fa-cart-plus': '🛒',
  'fa-certificate': '⭐', 'fa-coffee': '☕', 'fa-cloud': '☁️',
  'fa-comment': '🗨️', 'fa-cube': '📦', 'fa-cutlery': '🍴',
  'fa-database': '🖥️', 'fa-diamond': '💎', 'fa-exclamation-circle': '❗',
  'fa-eye': '👁️', 'fa-flag': '🏁', 'fa-flask': '⚗️',
  'fa-futbol-o': '⚽', 'fa-gamepad': '🎮', 'fa-graduation-cap': '🎓',
};

export function iconToEmoji(icon: string): string {
  return ICON_TO_EMOJI[icon] ?? '❓';
}

(window as any).iconToEmoji = iconToEmoji;

interface AddProfileForm {
  site: string;
  login: string;
  lowercase: boolean;
  uppercase: boolean;
  digits: boolean;
  symbols: boolean;
  length: number;
  counter: number;
}

interface AppStore {
  profiles: ProfileWithId[];
  query: string;
  masterPassword: string;
  fingerprint: Fingerprint | null;
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
  addSite: AddProfileForm;

  readonly filteredProfiles: ProfileWithId[];

  importJson(): void;
  fillGenerator(profile: ProfileWithId): void;
  generatePassword(): Promise<void>;
  removeProfile(id: string): void;
  exportJson(): void;
  addSiteProfile(): void;
  updateFingerprint(): void;
}

const profileDefaults = {
  lowercase: true,
  uppercase: true,
  digits: true,
  symbols: true,
  length: 16,
  counter: 1,
};

Alpine.store('app', {
  profiles: [] as ProfileWithId[],
  query: '',
  masterPassword: '',
  fingerprint: null as Fingerprint | null,
  genSite: '',
  genLogin: '',
  genLowercase: profileDefaults.lowercase,
  genUppercase: profileDefaults.uppercase,
  genDigits: profileDefaults.digits,
  genSymbols: profileDefaults.symbols,
  genLength: profileDefaults.length,
  genCounter: profileDefaults.counter,
  generatedPassword: '',
  error: '',
  importText: '',
  exportedJson: '',
  addSite: { site: '', login: '', ...profileDefaults },

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

  addSiteProfile() {
    if (!this.addSite.site) {
      this.error = 'Veuillez entrer le nom du site';
      return;
    }
    const profile: PasswordProfile = { ...this.addSite };
    const id = profileId(profile);
    if (!this.profiles.some(p => p.id === id)) {
      this.profiles = [...this.profiles, { ...profile, id }];
    }
    this.addSite = { site: '', login: '', ...profileDefaults };
    this.error = '';
  },

  updateFingerprint() {
    const pwd = this.masterPassword;
    if (!pwd) {
      this.fingerprint = null;
      return;
    }
    buildFingerprint(pwd).then(fp => {
      this.fingerprint = fp;
    });
  },
} satisfies AppStore);

Alpine.start();

let fingerprintTimer: ReturnType<typeof setTimeout>;
Alpine.effect(() => {
  const store = Alpine.store('app');
  const _pwd = store.masterPassword;
  clearTimeout(fingerprintTimer);
  fingerprintTimer = setTimeout(() => store.updateFingerprint(), 500);
});
