import type { Answers, Localized } from './types.ts'

export type QuestionKind = 'state' | 'single' | 'number' | 'boolean' | 'text'

export type QuestionOption = { value: string; label: Localized }

export type Question = {
  id: string
  step: number
  kind: QuestionKind
  label: Localized
  help?: Localized
  why?: Localized
  options?: QuestionOption[]
  preferNotToSay?: boolean
  skippable?: boolean
  min?: number
  max?: number
  suffix?: Localized
  showWhen?: (answers: Answers) => boolean
}

export const STEPS: { id: string; title: Localized; subtitle: Localized }[] = [
  {
    id: 'location',
    title: { en: 'Where you live', te: 'మీరు ఎక్కడ నివసిస్తున్నారు' },
    subtitle: {
      en: 'State schemes only apply inside that state, so this comes first.',
      te: 'రాష్ట్ర పథకాలు ఆ రాష్ట్రంలో మాత్రమే వర్తిస్తాయి కాబట్టి ముందు ఇది.',
    },
  },
  {
    id: 'about',
    title: { en: 'About you', te: 'మీ గురించి' },
    subtitle: {
      en: 'Only what scheme rules actually check. Everything stays on this device.',
      te: 'పథకాల నియమాలు నిజంగా పరిశీలించే విషయాలు మాత్రమే. మీ సమాధానాలు ఈ పరికరంలోనే ఉంటాయి.',
    },
  },
  {
    id: 'education',
    title: { en: 'Education', te: 'విద్య' },
    subtitle: {
      en: 'Scholarships and student schemes check this.',
      te: 'ఉపకార వేతనాలు, విద్యార్థి పథకాలు దీన్ని పరిశీలిస్తాయి.',
    },
  },
  {
    id: 'work',
    title: { en: 'Work you do', te: 'మీ వృత్తి' },
    subtitle: {
      en: 'Farmer, artisan, student, business or other — with a few follow-ups.',
      te: 'రైతు, కళాకారుడు, విద్యార్థి, వ్యాపారం లేదా ఇతరం — కొన్ని అదనపు ప్రశ్నలతో.',
    },
  },
  {
    id: 'income',
    title: { en: 'Household income', te: 'కుటుంబ ఆదాయం' },
    subtitle: {
      en: 'Choose a range, never an exact amount. Most schemes use annual income limits.',
      te: 'ఖచ్చితమైన మొత్తం కాదు, పరిధి ఎంచుకోండి. చాలా పథకాలు వార్షిక ఆదాయ పరిమితులను చూస్తాయి.',
    },
  },
  {
    id: 'situation',
    title: { en: 'Home & family situation', te: 'ఇల్లు & కుటుంబ పరిస్థితి' },
    subtitle: {
      en: 'A few yes/no questions that many housing, health and welfare schemes depend on.',
      te: 'గృహ, ఆరోగ్య, సంక్షేమ పథకాలకు సంబంధించిన కొన్ని అవును/కాదు ప్రశ్నలు.',
    },
  },
]

export const QUESTIONS: Question[] = [
  {
    id: 'state',
    step: 1,
    kind: 'state',
    label: { en: 'Which state do you live in?', te: 'మీరు ఏ రాష్ట్రంలో నివసిస్తున్నారు?' },
    help: {
      en: 'Central schemes apply across India. State schemes apply only in their state.',
      te: 'కేంద్ర పథకాలు దేశవ్యాప్తంగా వర్తిస్తాయి. రాష్ట్ర పథకాలు ఆ రాష్ట్రంలో మాత్రమే వర్తిస్తాయి.',
    },
  },
  {
    id: 'district',
    step: 1,
    kind: 'text',
    label: { en: 'District (optional)', te: 'జిల్లా (ఐచ్ఛికం)' },
    help: {
      en: 'Used only to label your saved results on this device. It does not change eligibility checks.',
      te: 'ఈ పరికరంలో మీ ఫలితాలకు పేరు పెట్టడానికి మాత్రమే. అర్హత పరిశీలనను మార్చదు.',
    },
    skippable: true,
  },
  {
    id: 'age',
    step: 2,
    kind: 'number',
    label: { en: 'Your age', te: 'మీ వయసు' },
    help: {
      en: 'Used only to check age limits. If you skip it, age-limited schemes will show as "more information needed".',
      te: 'వయసు పరిమితులు తనిఖీ చేయడానికి మాత్రమే. వదిలేస్తే వయసు పరిమితి ఉన్న పథకాలు "మరింత సమాచారం కావాలి"గా కనిపిస్తాయి.',
    },
    min: 0,
    max: 110,
    preferNotToSay: true,
  },
  {
    id: 'gender',
    step: 2,
    kind: 'single',
    label: { en: 'Gender', te: 'లింగం' },
    why: {
      en: 'Some schemes are meant only for women. This is used for nothing else.',
      te: 'కొన్ని పథకాలు మహిళల కోసం మాత్రమే. దీనిని ఇంకేమీ కోసం ఉపయోగించం.',
    },
    options: [
      { value: 'female', label: { en: 'Woman', te: 'మహిళ' } },
      { value: 'male', label: { en: 'Man', te: 'పురుషుడు' } },
      { value: 'other', label: { en: 'Other', te: 'ఇతరం' } },
    ],
    preferNotToSay: true,
  },
  {
    id: 'socialCategory',
    step: 2,
    kind: 'single',
    label: { en: 'Social category (if applicable)', te: 'సామాజిక వర్గం (వర్తిస్తుంటే)' },
    why: {
      en: 'Many scholarships and welfare schemes are limited to SC, ST, OBC or minority communities. Your answer stays on this device and is only used to check scheme rules.',
      te: 'చాలా ఉపకార వేతనాలు, సంక్షేమ పథకాలు SC, ST, OBC లేదా మైనారిటీ వర్గాలకు పరిమితం. మీ సమాధానం ఈ పరికరంలోనే ఉంటుంది.',
    },
    options: [
      { value: 'sc', label: { en: 'Scheduled Caste (SC)', te: 'షెడ్యూల్డ్ కులం (SC)' } },
      { value: 'st', label: { en: 'Scheduled Tribe (ST)', te: 'షెడ్యూల్డ్ తెగ (ST)' } },
      { value: 'obc', label: { en: 'Other Backward Class (OBC)', te: 'వెనుకబడిన తరగతి (OBC)' } },
      { value: 'minority', label: { en: 'Minority community', te: 'మైనారిటీ వర్గం' } },
      { value: 'general', label: { en: 'General / no reservation', te: 'సాధారణ / రిజర్వేషన్ లేదు' } },
    ],
    preferNotToSay: true,
  },
  {
    id: 'education',
    step: 3,
    kind: 'single',
    label: { en: 'Highest education completed', te: 'పూర్తి చేసిన గరిష్ఠ విద్య' },
    options: [
      { value: 'no-formal-schooling', label: { en: 'No formal schooling', te: 'ఔపచారిక చదువు లేదు' } },
      { value: 'primary', label: { en: 'Primary (Class 1-5)', te: 'ప్రాథమిక (1-5 తరగతులు)' } },
      { value: 'middle', label: { en: 'Middle (Class 6-8)', te: 'మాధ్యమిక (6-8 తరగతులు)' } },
      { value: 'secondary', label: { en: 'Secondary (Class 9-10)', te: 'మాధ్యమిక ఉన్నత (9-10 తరగతులు)' } },
      { value: 'higher-secondary', label: { en: 'Class 11-12 / Intermediate', te: '11-12 / ఇంటర్' } },
      { value: 'iti-diploma', label: { en: 'ITI / Diploma', te: 'ITI / డిప్లొమా' } },
      { value: 'graduate', label: { en: 'Graduate (Degree)', te: 'పట్టా (డిగ్రీ)' } },
      { value: 'post-graduate', label: { en: 'Post-graduate', te: 'పోస్ట్ గ్రాడ్యుయేట్' } },
    ],
    preferNotToSay: true,
  },
  {
    id: 'student',
    step: 3,
    kind: 'boolean',
    label: { en: 'Are you studying full-time right now?', te: 'మీరు ప్రస్తుతం పూర్తి సమయం చదువుతున్నారా?' },
    help: {
      en: 'School, college, ITI or equivalent full-time study.',
      te: 'పాఠశాల, కళాశాల, ITI లేదా సమానమైన పూర్తి సమయ చదువు.',
    },
    showWhen: (answers) => answers.age === undefined || answers.age <= 35,
  },
  {
    id: 'occupation',
    step: 4,
    kind: 'single',
    label: { en: 'What do you mainly do?', te: 'మీరు ప్రధానంగా ఏం చేస్తారు?' },
    options: [
      { value: 'farmer-owner', label: { en: 'Farmer (own land)', te: 'రైతు (సొంత భూమి)' } },
      { value: 'farmer-tenant', label: { en: 'Farmer (leased land)', te: 'రైతు (కౌలు భూమి)' } },
      { value: 'agricultural-labourer', label: { en: 'Agricultural labourer', te: 'వ్యవసాయ కూలీ' } },
      { value: 'artisan', label: { en: 'Artisan / skilled trade', te: 'కళాకారుడు / నైపుణ్య వృత్తి' } },
      { value: 'student', label: { en: 'Student', te: 'విద్యార్థి' } },
      { value: 'salaried-private', label: { en: 'Private job (salaried)', te: 'ప్రైవేట్ ఉద్యోగం' } },
      { value: 'government-employee', label: { en: 'Government employee', te: 'ప్రభుత్వ ఉద్యోగి' } },
      { value: 'self-employed-business', label: { en: 'Own business / enterprise', te: 'సొంత వ్యాపారం' } },
      { value: 'street-vendor', label: { en: 'Street vendor', te: 'వీధి వ్యాపారి' } },
      { value: 'homemaker', label: { en: 'Homemaker', te: 'గృహిణి' } },
      { value: 'retired-senior', label: { en: 'Retired / senior citizen', te: 'పదవీ విరమించిన / వృద్ధుడు' } },
      { value: 'unemployed', label: { en: 'Looking for work', te: 'ఉద్యోగం వెతుకుతున్నా' } },
      { value: 'other', label: { en: 'Other', te: 'ఇతరం' } },
    ],
    preferNotToSay: true,
  },
  {
    id: 'attributes.landholding-acres',
    step: 4,
    kind: 'number',
    label: { en: 'Cultivable land you hold (acres)', te: 'మీ వద్ద ఉన్న సాగు భూమి (ఎకరాలు)' },
    help: {
      en: 'Enter 0 for tenant farmers without a recorded share. Land record databases are the final proof.',
      te: 'రికార్డులో వాటా లేని కౌలు రైతులు 0 నమోదు చేయండి. భూమి రికార్డులే అంతిమ రుజువు.',
    },
    min: 0,
    max: 1000,
    suffix: { en: 'acres', te: 'ఎకరాలు' },
    showWhen: (answers) =>
      answers.occupation === 'farmer-owner' ||
      answers.occupation === 'farmer-tenant' ||
      answers.occupation === 'agricultural-labourer',
  },
  {
    id: 'attributes.kisan-credit-existing',
    step: 4,
    kind: 'boolean',
    label: { en: 'Do you already have a Kisan Credit Card loan?', te: 'మీ వద్ద ఇప్పటికే కిసాన్ క్రెడిట్ కార్డు రుణం ఉందా?' },
    showWhen: (answers) =>
      answers.occupation === 'farmer-owner' || answers.occupation === 'farmer-tenant',
  },
  {
    id: 'attributes.business-year-old',
    step: 4,
    kind: 'number',
    label: { en: 'How old is your business (years)?', te: 'మీ వ్యాపారం ఎన్ని సంవత్సరాల నుండి ఉంది?' },
    min: 0,
    max: 80,
    suffix: { en: 'years', te: 'సంవత్సరాలు' },
    showWhen: (answers) => answers.occupation === 'self-employed-business',
  },
  {
    id: 'attributes.enterprise-investment-lakhs',
    step: 4,
    kind: 'number',
    label: { en: 'Money already invested in the business (₹ lakh)', te: 'వ్యాపారంలో పెట్టిన మొత్తం (₹ లక్షలు)' },
    help: {
      en: 'Approximate total plant, machinery and working capital you put in.',
      te: 'మీరు పెట్టిన యంత్రాలు, పని మూలధనం సుమారు మొత్తం.',
    },
    min: 0,
    max: 10000,
    suffix: { en: 'lakh', te: 'లక్షలు' },
    showWhen: (answers) => answers.occupation === 'self-employed-business',
  },
  {
    id: 'attributes.first-generation-entrepreneur',
    step: 4,
    kind: 'boolean',
    label: { en: 'Is this the first business in your family?', te: 'మీ కుటుంబంలో మొదటి వ్యాపారమా ఇది?' },
    showWhen: (answers) => answers.occupation === 'self-employed-business',
  },
  {
    id: 'attributes.street-vendor',
    step: 4,
    kind: 'boolean',
    label: { en: 'Are you listed in the local street-vendor survey?', te: 'స్థానిక వీధి వ్యాపారుల సర్వేలో మీ పేరు ఉందా?' },
    help: {
      en: 'Certificates of vending are issued by the local municipal body or Town Vending Committee.',
      te: 'వ్యాపార ధ్రువీకరణ పత్రాలు స్థానిక పురపాలక సంస్థ లేదా టౌన్ వెండింగ్ కమిటీ ఇస్తాయి.',
    },
    showWhen: (answers) => answers.occupation === 'street-vendor',
  },
  {
    id: 'attributes.homeless-vending',
    step: 4,
    kind: 'boolean',
    label: { en: 'Do you sell from a cart or on the street without a fixed shop?', te: 'మీరు స్థిరంగా దుకాణం లేకుండా రిక్కా/వీధిలో వ్యాపారం చేస్తారా?' },
    showWhen: (answers) => answers.occupation === 'street-vendor',
  },
  {
    id: 'attributes.unorganised-worker',
    step: 4,
    kind: 'boolean',
    label: { en: 'Do you work without a fixed employer or formal job contract?', te: 'మీకు స్థిర యజమాని లేదా అధికారిక ఉద్యోగ ఒప్పందం లేకుండా పని చేస్తారా?' },
    help: {
      en: 'Covers casual wage work, domestic work, construction work and similar unorganised jobs.',
      te: 'కూలీ పని, గృహ పని, నిర్మాణ పని వంటి అసంఘటిత రంగ ఉద్యోగాలు ఇందులోకి వస్తాయి.',
    },
    showWhen: (answers) =>
      answers.occupation === 'agricultural-labourer' ||
      answers.occupation === 'artisan' ||
      answers.occupation === 'street-vendor' ||
      answers.occupation === 'unemployed' ||
      answers.occupation === 'other',
  },
  {
    id: 'attributes.shg-member',
    step: 4,
    kind: 'boolean',
    label: { en: 'Are you a member of a women\u2019s self-help group (SHG)?', te: 'మీరు మహిళా స్వయం సహాయక బృందం (SHG) సభ్యురాలా?' },
    showWhen: (answers) =>
      answers.occupation === 'homemaker' ||
      answers.occupation === 'farmer-owner' ||
      answers.occupation === 'farmer-tenant' ||
      answers.occupation === 'agricultural-labourer' ||
      answers.occupation === 'unemployed' ||
      answers.occupation === 'other',
  },
  {
    id: 'incomeBand',
    step: 5,
    kind: 'single',
    label: { en: 'Annual household income (approximate)', te: 'కుటుంబ వార్షిక ఆదాయం (సుమారు)' },
    why: {
      en: 'We ask for a range, never an exact amount. The range stays on this device and is only used against scheme income limits.',
      te: 'ఖచ్చితమైన మొత్తం కాదు, పరిధి మాత్రమే అడుగుతాం. ఈ పరిధి ఈ పరికరంలోనే ఉంటుంది.',
    },
    options: [
      { value: 'under-1l', label: { en: 'Below ₹1 lakh', te: '₹1 లక్ష లోపు' } },
      { value: '1l-2.5l', label: { en: '₹1 lakh to ₹2.5 lakh', te: '₹1 లక్ష – ₹2.5 లక్షలు' } },
      { value: '2.5l-5l', label: { en: '₹2.5 lakh to ₹5 lakh', te: '₹2.5 – ₹5 లక్షలు' } },
      { value: '5l-8l', label: { en: '₹5 lakh to ₹8 lakh', te: '₹5 – ₹8 లక్షలు' } },
      { value: '8l-10l', label: { en: '₹8 lakh to ₹10 lakh', te: '₹8 – ₹10 లక్షలు' } },
      { value: 'above-10l', label: { en: 'Above ₹10 lakh', te: '₹10 లక్షల పైన' } },
    ],
    preferNotToSay: true,
  },
  {
    id: 'attributes.bank-account',
    step: 6,
    kind: 'boolean',
    label: { en: 'Do you have a bank account in your own or guardian\u2019s name?', te: 'మీ పేరు లేదా సంరక్షకుడి పేరు మీద బ్యాంకు ఖాతా ఉందా?' },
    help: {
      en: 'Most benefits are transferred directly to a bank account (DBT).',
      te: 'చాలా ప్రయోజనాలు బ్యాంకు ఖాతాలోకి నేరుగా జమ అవుతాయి (DBT).',
    },
  },
  {
    id: 'attributes.has-pucca-house',
    step: 6,
    kind: 'boolean',
    label: { en: 'Does your family own a pucca (permanent) house?', te: 'మీ కుటుంబానికి పక్కా (శాశ్వత) ఇల్లు ఉందా?' },
    help: {
      en: 'Housing schemes usually require that the family does not already own a pucca house.',
      te: 'గృహ పథకాలు సాధారణంగా కుటుంబానికి ఇప్పటికే పక్కా ఇల్లు లేకుండా ఉండాలని కోరతాయి.',
    },
  },
  {
    id: 'attributes.secc-listed',
    step: 6,
    kind: 'boolean',
    label: { en: 'Is your household listed in the rural housing survey (SECC / Awaas+)?', te: 'మీ కుటుంబం గ్రామీణ గృహ సర్వే (SECC / Awaas+) జాబితాలో ఉందా?' },
    help: {
      en: 'Rural housing beneficiaries are selected from the 2011 socio-economic census and Awaas+ survey lists. If you are not sure, skip this — your Grama Sachivalayam can confirm.',
      te: 'గ్రామీణ గృహాల లబ్ధిదారులను 2011 ఆర్థిక-సామాజిక గణన, Awaas+ సర్వే జాబితాల నుండి ఎంపిక చేస్తారు. ఖచ్చితంగా తెలియకపోతే వదిలేయండి.',
    },
    showWhen: (answers) => answers.attributes?.['has-pucca-house'] === false,
  },
  {
    id: 'attributes.pregnant',
    step: 6,
    kind: 'boolean',
    label: { en: 'Is a woman in the family currently pregnant?', te: 'కుటుంబంలో ప్రస్తుతం గర్భిణీ ఉందా?' },
    showWhen: (answers) =>
      (answers.gender === undefined || answers.gender === 'female') &&
      (answers.age === undefined || (answers.age >= 15 && answers.age <= 50)),
  },
  {
    id: 'attributes.girl-child-under-10',
    step: 6,
    kind: 'boolean',
    label: { en: 'Do you have a daughter under 10 years of age?', te: 'మీకు 10 సంవత్సరాలలోపు కుమార్తె ఉందా?' },
    showWhen: (answers) => answers.age === undefined || answers.age >= 18,
  },
  {
    id: 'attributes.disability-percent',
    step: 6,
    kind: 'number',
    label: { en: 'Disability percentage (if certified)', te: 'వైకల్యం శాతం (ధ్రువీకరణ ఉంటే)' },
    help: {
      en: 'Enter the percentage on your disability (UDID) certificate. Leave blank if not applicable.',
      te: 'మీ UDID ధ్రువీకరణ పత్రంలోని శాతం నమోదు చేయండి. వర్తించకపోతే ఖాళీగా వదిలేయండి.',
    },
    min: 0,
    max: 100,
    suffix: { en: '%', te: '%' },
  },
  {
    id: 'attributes.disability-certificate',
    step: 6,
    kind: 'boolean',
    label: { en: 'Do you hold a disability (UDID) certificate?', te: 'మీ వద్ద వైకల్యం (UDID) ధ్రువీకరణ పత్రం ఉందా?' },
    showWhen: (answers) => {
      const value = answers.attributes?.['disability-percent']
      return typeof value === 'number' && value > 0
    },
  },
  {
    id: 'attributes.govt-employee',
    step: 6,
    kind: 'boolean',
    label: { en: 'Is anyone in the family a serving or retired government employee?', te: 'కుటుంబంలో ఎవరైనా ప్రస్తుత లేదా పదవీ విరమించిన ప్రభుత్వ ఉద్యోగినా?' },
    why: {
      en: 'Several farmer and welfare schemes exclude government servant families. Answer for the household.',
      te: 'కొన్ని రైతు, సంక్షేమ పథకాలు ప్రభుత్వ ఉద్యోగుల కుటుంబాలకు వర్తించవు. కుటుంబం తరపున సమాధానించండి.',
    },
    preferNotToSay: true,
  },
  {
    id: 'attributes.income-tax-payer',
    step: 6,
    kind: 'boolean',
    label: { en: 'Did the family pay income tax last year?', te: 'గత సంవత్సరం కుటుంబం ఆదాయపు పన్ను చెల్లించిందా?' },
    why: {
      en: 'Income-tax paying families are excluded from several direct-benefit schemes.',
      te: 'ఆదాయపు పన్ను చెల్లించే కుటుంబాలకు కొన్ని ప్రత్యక్ష ప్రయోజన పథకాలు వర్తించవు.',
    },
    preferNotToSay: true,
  },
  {
    id: 'attributes.minority-community',
    step: 6,
    kind: 'boolean',
    label: { en: 'Do you belong to a notified minority community?', te: 'మీరు గుర్తింపు పొందిన మైనారిటీ వర్గానికి చెందినవారా?' },
    why: {
      en: 'Some scholarships and credit schemes are reserved for minority communities.',
      te: 'కొన్ని ఉపకార వేతనాలు, రుణ పథకాలు మైనారిటీ వర్గాలకు కేటాయించబడ్డాయి.',
    },
    preferNotToSay: true,
  },
]

const QUESTION_INDEX = new Map(QUESTIONS.map((question) => [question.id, question]))

export function getQuestion(id: string): Question | undefined {
  return QUESTION_INDEX.get(id)
}

export function questionsForStep(step: number, answers: Answers): Question[] {
  return QUESTIONS.filter(
    (question) => question.step === step && (!question.showWhen || question.showWhen(answers)),
  )
}

export function getAnswerValue(answers: Answers, id: string): unknown {
  if (id.startsWith('attributes.')) {
    const key = id.slice('attributes.'.length)
    return answers.attributes?.[key as keyof Answers['attributes']]
  }
  if (id === 'district') return answers.district
  if (id === 'socialCategory') return answers.socialCategory
  if (id === 'incomeBand') return answers.incomeBand
  return answers[id as keyof Answers]
}

export function setAnswerValue(answers: Answers, id: string, value: unknown): Answers {
  if (id.startsWith('attributes.')) {
    const key = id.slice('attributes.'.length) as keyof Answers['attributes']
    return { ...answers, attributes: { ...answers.attributes, [key]: value as never } }
  }
  if (id === 'district') return { ...answers, district: value === undefined ? undefined : String(value) }
  if (id === 'socialCategory')
    return { ...answers, socialCategory: value as Answers['socialCategory'] }
  if (id === 'incomeBand') return { ...answers, incomeBand: value as Answers['incomeBand'] }
  if (id === 'age')
    return { ...answers, age: typeof value === 'number' ? value : undefined }
  if (id === 'gender') return { ...answers, gender: value as Answers['gender'] }
  if (id === 'education') return { ...answers, education: value as Answers['education'] }
  if (id === 'student')
    return { ...answers, student: typeof value === 'boolean' ? value : undefined }
  if (id === 'occupation') return { ...answers, occupation: value as Answers['occupation'] }
  return answers
}

export const TOTAL_STEPS = STEPS.length
