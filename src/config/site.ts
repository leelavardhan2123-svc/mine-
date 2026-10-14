/**
 * ─────────────────────────────────────────────────────────────
 *  FOREVER WITH YOU ❤️  —  EDIT EVERYTHING HERE
 * ─────────────────────────────────────────────────────────────
 *  This is the ONLY file you need to touch to personalize the
 *  whole website: names, dates, the letter, photos, colours,
 *  and the final surprise message.
 *
 *  Tips:
 *  • Change text between quotes:  "your text"
 *  • Keep the comma at the end of each line
 *  • Photos: drop your images into  public/gallery/
 *    then point  src: "/gallery/your-photo.jpg"
 *  • Everything you change is saved in this file only — the
 *    site never sends your data anywhere.
 */

export type MilestoneIcon = 'heart' | 'message' | 'star' | 'smile' | 'sparkles'

export interface Milestone {
  id: string
  /** Shown as the date of this moment — any format you like */
  date: string
  title: string
  description: string
  icon: MilestoneIcon
}

export interface GalleryItem {
  id: string
  /** Path relative to  public/  — e.g. "/gallery/us-1.jpg" */
  src: string
  caption: string
  /** Describes the photo for screen readers & if the image fails */
  alt: string
}

export interface SpecialCard {
  id: string
  title: string
  message: string
  emoji: string
}

export const siteConfig = {
  /* ── WHO THIS IS FOR ─────────────────────────────────────── */
  myName: 'Your Name',
  herName: 'My Love',

  /** The day your story began — used for the "days together" counter.
   *  Format: YYYY-MM-DD */
  anniversary: '2023-02-14',

  /* ── COLOURS (favourite colours) ─────────────────────────── */
  /** Change these hex codes to repaint the entire site. */
  colors: {
    primary: '#be123c', // deep rose red — buttons, accents
    secondary: '#e11d48', // bright rose — gradients
    accent: '#a78bfa', // soft lavender — highlights
    blush: '#ffe4e9', // blush pink — soft backgrounds
    cream: '#fff8f0', // warm cream — paper, cards
    lavender: '#ede9fe', // pale lavender — alt backgrounds
    ink: '#411223', // deep plum — headings & text
  },

  /* ── FEATURE 1 · WELCOME SCREEN ──────────────────────────── */
  welcome: {
    eyebrow: 'Forever With You ❤️',
    title: 'Hey, My Favorite Person ❤️',
    subtitle: 'I made something special just for you...',
    button: 'Open Your Surprise 💌',
  },

  /* ── INTRO BAND (after the welcome opens) ────────────────── */
  intro: {
    title: 'Forever With You',
    subtitle: 'A little corner of the world that I built only for us.',
    daysLabel: 'beautiful days together',
  },

  /* ── FEATURE 2 · OUR LOVE STORY ──────────────────────────── */
  story: {
    eyebrow: 'Chapter One',
    title: 'Our Love Story',
    subtitle: 'Every moment with you deserves to be remembered.',
    milestones: [
      {
        id: 'first-met',
        date: 'February 14, 2023',
        title: 'The day we first met',
        description:
          'The day the universe quietly rearranged everything so our paths could cross. I still remember how natural it felt, like we had known each other forever.',
        icon: 'heart',
      },
      {
        id: 'first-talk',
        date: 'February 16, 2023',
        title: 'Our first conversation',
        description:
          'One message turned into hours of talking. That night I smiled at my phone like a complete fool — and I would happily do it all over again.',
        icon: 'message',
      },
      {
        id: 'favourite-memory',
        date: 'June 3, 2023',
        title: 'My favorite memory with you',
        description:
          'That perfect, ordinary evening when the world went quiet and it was just us laughing about nothing. Nothing in the world mattered more.',
        icon: 'star',
      },
      {
        id: 'made-me-smile',
        date: 'October 22, 2023',
        title: 'The moment you made me smile',
        description:
          'The way you did that silly little thing without even trying — you have no idea how completely you turned my whole day around.',
        icon: 'smile',
      },
      {
        id: 'our-dreams',
        date: 'Forever from now',
        title: 'Our dreams together',
        description:
          'Slow mornings, long drives, a home full of laughter, and a lifetime of choosing each other — again and again, every single day.',
        icon: 'sparkles',
      },
    ] satisfies Milestone[],
  },

  /* ── FEATURE 3 · A LETTER FROM MY HEART ──────────────────── */
  letter: {
    eyebrow: 'Sealed With Love',
    title: 'A Letter From My Heart',
    subtitle: 'Some things are better said on paper...',
    /** The envelope label */
    sealLabel: 'For You',
    /** The whole letter body — keep line breaks with \n */
    body: `Hey, my love ❤️

Sometimes, words aren't enough to explain how special you are to me. Your smile can make an ordinary day feel beautiful, and the little moments we share mean more to me than you know.

I may not always find the perfect words, but I hope you always remember that you matter to me. Thank you for being part of my life and making my world brighter.

No matter how busy life gets, I hope we keep creating beautiful memories together.

You are someone truly special to me. ❤️`,
    signature: 'Forever yours,',
    replayButton: 'Read it again ↺',
    openHint: 'Tap the envelope to open it',
  },

  /* ── FEATURE 4 · OUR MEMORY GALLERY ──────────────────────── */
  gallery: {
    eyebrow: 'Little Moments',
    title: 'Our Memory Gallery',
    subtitle: 'Click any memory to see it a little closer.',
    items: [
      {
        id: 'm1',
        src: '/gallery/memory-1.svg',
        caption: 'The beginning of us',
        alt: 'Placeholder for our first photo together',
      },
      {
        id: 'm2',
        src: '/gallery/memory-2.svg',
        caption: 'That unstoppable laughter',
        alt: 'Placeholder for a laughing moment together',
      },
      {
        id: 'm3',
        src: '/gallery/memory-3.svg',
        caption: 'Our favourite sunset',
        alt: 'Placeholder for a sunset we watched together',
      },
      {
        id: 'm4',
        src: '/gallery/memory-4.svg',
        caption: 'Just being us',
        alt: 'Placeholder for a candid photo together',
      },
      {
        id: 'm5',
        src: '/gallery/memory-5.svg',
        caption: 'One more adventure',
        alt: 'Placeholder for a travel photo together',
      },
      {
        id: 'm6',
        src: '/gallery/memory-6.svg',
        caption: 'And many more to come...',
        alt: 'Placeholder for a future photo together',
      },
    ] satisfies GalleryItem[],
  },

  /* ── FEATURE 5 · WHY YOU ARE SPECIAL ─────────────────────── */
  special: {
    eyebrow: 'From My Heart',
    title: 'Why You Are Special',
    subtitle: 'Tap each card to discover a little reason...',
    allRevealed: 'You have seen every reason — and there are countless more. ❤️',
    cards: [
      {
        id: 'smile',
        emoji: '😊',
        title: 'Your beautiful smile',
        message:
          'Your smile is my favourite sight in the entire world. It has a way of fixing my worst days without you even trying.',
      },
      {
        id: 'laugh',
        emoji: '😄',
        title: 'The way you make me laugh',
        message:
          'You turn the most ordinary moments into memories I never want to forget. Life with you is my kind of funny.',
      },
      {
        id: 'kindness',
        emoji: '🕊️',
        title: 'Your kindness',
        message:
          'The way you care for everyone around you says everything about the beautiful soul you are.',
      },
      {
        id: 'little-things',
        emoji: '✨',
        title: 'The little things you do',
        message:
          'The good-morning texts, the silly notes, the way you remember the small details — I notice every single one.',
      },
      {
        id: 'memories',
        emoji: '📸',
        title: 'The memories we create together',
        message:
          'Every new memory with you becomes a favourite. I would choose you in every version of our story.',
      },
    ] satisfies SpecialCard[],
  },

  /* ── FEATURE 6 · ONE LAST SURPRISE ───────────────────────── */
  surprise: {
    button: 'One Last Surprise 💝',
    eyebrow: 'Just One More Thing',
    heading: 'For You, Always',
    message:
      'If I could give you one thing, it would be the ability to see yourself through my eyes, because then you\'d know just how special you are to me. ❤️',
    replayButton: 'Watch again ♻️',
    closeLabel: 'Close surprise',
  },

  /* ── FEATURE 7 · MUSIC ───────────────────────────────────── */
  music: {
    /** Replace this file in  public/audio/  with a song you both love.
     *  See  public/audio/README.md  for details. */
    src: '/audio/our-song.wav',
    title: 'Our Song',
    playLabel: 'Play music',
    pauseLabel: 'Pause music',
    muteLabel: 'Mute music',
    unmuteLabel: 'Unmute music',
    unavailableHint: 'Add a song at public/audio/ to enable music',
  },

  /* ── FEATURE 9 · FINAL SCREEN ────────────────────────────── */
  final: {
    message:
      "Every love story is special, but I'm glad ours is part of my life. ❤️",
    button: 'Revisit our memories 💞',
    signature: '— always yours',
    privacyNote:
      'Made with ❤️ · Your preferences are saved only in this browser, never uploaded anywhere.',
    restartLabel: 'Start over from the beginning',
  },
} as const

export type SiteConfig = typeof siteConfig
