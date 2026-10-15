import type { DocCatalogEntry } from './types.ts'

export const DOCUMENT_CATALOG: DocCatalogEntry[] = [
  {
    id: 'aadhaar',
    name: { en: 'Aadhaar card', te: 'ఆధార్ కార్డు' },
    purpose: {
      en: 'Confirms identity and is usually linked to the bank account so benefits can be transferred directly.',
      te: 'గుర్తింపు ధ్రువీకరణకు ఉపయోగపడుతుంది. సహాయం నేరుగా ఖాతాలోకి జమ కావడానికి బ్యాంకు ఖాతాతో లింక్ చేయాలి.',
    },
    officialInfoUrl: 'https://uidai.gov.in/',
    obtainVia: {
      en: 'Enroll at an Aadhaar Seva Kendra or authorised enrolment centre.',
      te: 'ఆధార్ సేవా కేంద్రం లేదా అధీకృత ఎన్రోల్‌మెంట్ కేంద్రంలో నమోదు చేసుకోవచ్చు.',
    },
  },
  {
    id: 'bank-passbook',
    name: { en: 'Bank passbook or account details', te: 'బ్యాంకు పాస్‌బుక్ లేదా ఖాతా వివరాలు' },
    purpose: {
      en: 'Shows the account where the government can send money directly (DBT). The account should be in the beneficiary or guardian\u2019s name.',
      te: 'ప్రభుత్వం నేరుగా డబ్బు పంపగల ఖాతా వివరాలు. ఖాతా లబ్ధిదారుడి లేదా సంరక్షకుడి పేరు మీద ఉండాలి.',
    },
    officialInfoUrl: 'https://jandhan.gov.in/',
    obtainVia: {
      en: 'Open a basic savings account at any bank branch or business correspondent (CSP) point.',
      te: 'ఏదైనా బ్యాంకు శాఖ లేదా CSP కేంద్రంలో ప్రాథమిక పొదుపు ఖాతా తెరవచ్చు.',
    },
  },
  {
    id: 'land-records',
    name: { en: 'Land records (pattadar passbook / 7-12 extract)', te: 'భూమి రికార్డులు (పట్టాదారు పాస్‌బుక్)' },
    purpose: {
      en: 'Proves ownership or tenancy of cultivable land, which many farmer schemes require.',
      te: 'సాగు భూమి యాజమాన్యం లేదా కౌలు ఉన్నట్లు చూపే రికార్డు. చాలా రైతు పథకాలకు ఇది అవసరం.',
    },
    obtainVia: {
      en: 'Download from your state land records portal (Bhulekh / Dharani / MeeBhoomi) or collect from the village revenue officer.',
      te: 'రాష్ట్ర భూమి రికార్డుల పోర్టల్ నుండి డౌన్‌లోడ్ చేయవచ్చు లేదా గ్రామ రెవెన్యూ అధికారి వద్ద పొందవచ్చు.',
    },
  },
  {
    id: 'income-certificate',
    name: { en: 'Family income certificate', te: 'కుటుంబ ఆదాయ ధ్రువీకరణ పత్రం' },
    purpose: {
      en: 'Official proof of annual family income, needed by schemes that limit benefits to lower-income households.',
      te: 'కుటుంబ వార్షిక ఆదాయాన్ని అధికారికంగా నిరూపించే పత్రం. తక్కువ ఆదాయ కుటుంబాలకు పరిమితమైన పథకాలకు అవసరం.',
    },
    obtainVia: {
      en: 'Apply through your state e-district portal, MeeSeva / Seva Kendra, or the tahsildar office. Usually valid for one year.',
      te: 'రాష్ట్ర ఈ-డిస్ట్రిక్ట్ పోర్టల్ లేదా తహసీల్దార్ కార్యాలయంలో దరఖాస్తు చేయాలి. సాధారణంగా ఒక సంవత్సరం వర్తిస్తుంది.',
    },
  },
  {
    id: 'caste-certificate',
    name: { en: 'Caste certificate (SC / ST / OBC)', te: 'కుల ధ్రువీకరణ పత్రం (SC / ST / OBC)' },
    purpose: {
      en: 'Proves SC, ST or OBC category status for category-specific scholarships and schemes.',
      te: 'SC, ST లేదా OBC వర్గానికి చెందిన వారని నిరూపించే పత్రం. వర్గ-నిర్దిష్ట ఉపకార వేతనాలకు, పథకాలకు అవసరం.',
    },
    obtainVia: {
      en: 'Apply via your state e-district portal or mandal/taluk office; the format differs by state.',
      te: 'రాష్ట్ర ఈ-డిస్ట్రిక్ట్ పోర్టల్ లేదా మండల కార్యాలయంలో దరఖాస్తు చేయాలి; రాష్ట్రాల వారీగా నమూనా భిన్నంగా ఉంటుంది.',
    },
  },
  {
    id: 'domicile-residence',
    name: { en: 'Domicile / residence certificate', te: 'నివాస ధ్రువీకరణ పత్రం' },
    purpose: {
      en: 'Proves you normally live in the state, which state schemes and some scholarships require.',
      te: 'మీరు ఆ రాష్ట్రంలో నివసిస్తున్నట్లు నిరూపించే పత్రం. రాష్ట్ర పథకాలకు, కొన్ని ఉపకార వేతనాలకు అవసరం.',
    },
    obtainVia: {
      en: 'Apply through your state e-district portal or tahsildar office.',
      te: 'రాష్ట్ర ఈ-డిస్ట్రిక్ట్ పోర్టల్ లేదా తహసీల్దార్ కార్యాలయంలో దరఖాస్తు చేయాలి.',
    },
  },
  {
    id: 'ration-card',
    name: { en: 'Ration card', te: 'రేషన్ కార్డు' },
    purpose: {
      en: 'Shows household composition and, in many states, priority-household or BPL status used for benefit lists.',
      te: 'కుటుంబ సభ్యుల వివరాలు మరియు చాలా రాష్ట్రాల్లో ప్రాధాన్య కుటుంబం / BPL హోదాను చూపే పత్రం.',
    },
    officialInfoUrl: 'https://nfsa.gov.in/',
    obtainVia: {
      en: 'Apply or update through your state food & civil supplies department portal or MeeSeva/e-district.',
      te: 'రాష్ట్ర ఆహార & పౌర సరఫరాల శాఖ పోర్టల్ లేదా ఈ-డిస్ట్రిక్ట్ ద్వారా దరఖాస్తు చేయవచ్చు.',
    },
  },
  {
    id: 'passport-photo',
    name: { en: 'Passport-size photograph', te: 'పాస్‌పోర్ట్ సైజు ఫోటో' },
    purpose: {
      en: 'Needed on most application forms and beneficiary records.',
      te: 'చాలా దరఖాస్తు ఫారమ్‌లు, లబ్ధిదారుల నమోదులకు అవసరం.',
    },
  },
  {
    id: 'age-proof',
    name: { en: 'Date-of-birth proof', te: 'పుట్టిన తేదీ రుజువు' },
    purpose: {
      en: 'Confirms age for schemes with age limits — e.g. school memo, birth certificate or Aadhaar.',
      te: 'వయసు పరిమితి ఉన్న పథకాలకు వయసును నిరూపించే పత్రం — ఉదా: పాఠశాల మెమో, జనన ధ్రువీకరణ పత్రం లేదా ఆధార్.',
    },
  },
  {
    id: 'birth-certificate',
    name: { en: 'Birth certificate', te: 'జనన ధ్రువీకరణ పత్రం' },
    purpose: {
      en: 'Legal proof of date of birth, issued by the Civil Registration System.',
      te: 'పౌర నమోదు వ్యవస్థ ద్వారా జారీ చేయబడే చట్టపరమైన పుట్టిన తేదీ రుజువు.',
    },
    officialInfoUrl: 'https://crsorgi.gov.in/',
  },
  {
    id: 'disability-certificate',
    name: { en: 'Disability certificate / UDID card', te: 'వైకల్యం ధ్రువీకరణ పత్రం / UDID కార్డు' },
    purpose: {
      en: 'Certifies the type and percentage of disability, which disability schemes require.',
      te: 'వైకల్యం రకం మరియు శాతాన్ని ధ్రువీకరిస్తుంది. వైకల్యం పథకాలకు ఇది అవసరం.',
    },
    officialInfoUrl: 'https://www.swavlambancard.gov.in/',
    obtainVia: {
      en: 'Apply for the UDID (Unique Disability ID) card through the Swavlamban portal or district disability centre.',
      te: 'స్వావలంబన పోర్టల్ లేదా జిల్లా వైకల్యం కేంద్రం ద్వారా UDID కార్డు కోసం దరఖాస్తు చేయవచ్చు.',
    },
  },
  {
    id: 'student-id',
    name: { en: 'School / college identity or admission proof', te: 'పాఠశాల / కళాశాల గుర్తింపు లేదా ప్రవేశ రుజువు' },
    purpose: {
      en: 'Shows current admission or enrollment in an educational institution.',
      te: 'ప్రస్తుతం విద్యాసంస్థలో చేరి ఉన్నట్లు చూపే పత్రం.',
    },
  },
  {
    id: 'marksheet',
    name: { en: 'Marks memo / marksheet', te: 'మార్కుల మెమో' },
    purpose: {
      en: 'Shows marks in the qualifying examination, needed where scholarships require a percentage.',
      te: 'అర్హత పరీక్షలో వచ్చిన మార్కులను చూపే పత్రం. నిర్దిష్ట శాతం అవసరమైన ఉపకార వేతనాలకు ఉపయోగపడుతుంది.',
    },
  },
  {
    id: 'bonafide-student-certificate',
    name: { en: 'Bonafide student certificate', te: 'విద్యార్థి బోనఫైడ్ ధ్రువీకరణ పత్రం' },
    purpose: {
      en: 'A letter from your institution confirming you are currently studying there.',
      te: 'మీరు ప్రస్తుతం ఆ సంస్థలో చదువుతున్నట్లు సంస్థ ఇచ్చే ధ్రువీకరణ పత్రం.',
    },
  },
  {
    id: 'business-proof',
    name: { en: 'Business registration proof', te: 'వ్యాపార నమోదు రుజువు' },
    purpose: {
      en: 'Shows the enterprise exists — Udyam/MSME registration, shop licence or GST certificate.',
      te: 'వ్యాపారం ఉనికిలో ఉన్నట్లు చూపే పత్రం — ఉద్యం నమోదు, దుకాణ లైసెన్స్ లేదా GST ధ్రువీకరణ పత్రం.',
    },
    officialInfoUrl: 'https://udyamregistration.gov.in/',
  },
  {
    id: 'project-report',
    name: { en: 'Project report / business plan', te: 'ప్రాజెక్ట్ నివేదిక / వ్యాపార ప్రణాళిక' },
    purpose: {
      en: 'A simple write-up of the business idea, cost and expected income, required by loan-linked schemes.',
      te: 'వ్యాపార ఆలోచన, ఖర్చు, ఊహించిన ఆదాయం గురించి సంక్షిప్త వివరణ. రుణ-ఆధారిత పథకాలకు అవసరం.',
    },
  },
  {
    id: 'letter-of-recommendation',
    name: { en: 'Letter of recommendation (SHG / ULB / trade body)', te: 'శిఫారసు లేఖ (SHG / పట్టణ సంస్థ / వృత్తి సంఘం)' },
    purpose: {
      en: 'Confirms membership of a self-help group, street-vendor list or recognised trade association.',
      te: 'స్వయం సహాయక బృందం, వీధి వ్యాపారుల జాబితా లేదా గుర్తింపు పొందిన వృత్తి సంఘం సభ్యత్వాన్ని ధ్రువీకరిస్తుంది.',
    },
  },
  {
    id: 'mgnrega-job-card',
    name: { en: 'MGNREGA job card', te: 'మనరేగా ఉపాధి హామీ జాబ్ కార్డు' },
    purpose: {
      en: 'Registers a rural household for guaranteed wage employment and is used as residence proof in rural areas.',
      te: 'గ్రామీణ కుటుంబాన్ని హామీ వేతన ఉపాధికి నమోదు చేస్తుంది. గ్రామీణ ప్రాంతాల్లో నివాస రుజువుగా కూడా ఉపయోగపడుతుంది.',
    },
    officialInfoUrl: 'https://nrega.nic.in/',
  },
  {
    id: 'vending-certificate',
    name: { en: 'Certificate of vending / street-vendor listing', te: 'వ్యాపార ధ్రువీకరణ పత్రం / వీధి వ్యాపారుల జాబితా' },
    purpose: {
      en: 'Places you on the local vending survey or Town Vending Committee list, needed by street-vendor schemes.',
      te: 'స్థానిక వ్యాపార సర్వే లేదా టౌన్ వెండింగ్ కమిటీ జాబితాలో మీ పేరు ఉన్నట్లు చూపే పత్రం.',
    },
    obtainVia: {
      en: 'Ask your local municipal body or Town Vending Committee; surveys are run by urban local bodies.',
      te: 'స్థానిక పురపాలక సంస్థ లేదా టౌన్ వెండింగ్ కమిటీ వద్ద పొందవచ్చు.',
    },
  },
  {
    id: 'family-id',
    name: { en: 'Family ID / household survey record', te: 'కుటుంబ గుర్తింపు / గృహ సర్వే నమోదు' },
    purpose: {
      en: 'Some states maintain a family ID (e.g. after a household survey) used to link welfare benefits.',
      te: 'కొన్ని రాష్ట్రాలు కుటుంబ గుర్తింపు నంబర్ నిర్వహిస్తాయి; సంక్షేమ పథకాలను దానికి అనుసంధానిస్తారు.',
    },
  },
  {
    id: 'mcp-card',
    name: { en: 'Mother & Child Protection (MCP) card', te: 'తల్లి & శిశు రక్షణ (MCP) కార్డు' },
    purpose: {
      en: 'Issued by the anganwadi/health worker; records pregnancy and child immunisation details.',
      te: 'అంగన్‌వాడీ / ఆరోగ్య కార్యకర్త జారీ చేస్తారు; గర్భధారణ, శిశు టీకాల వివరాలు ఇందులో నమోదవుతాయి.',
    },
  },
  {
    id: 'pregnancy-proof',
    name: { en: 'Pregnancy proof (MCP card / ANM letter)', te: 'గర్భధారణ రుజువు (MCP కార్డు / ANM లేఖ)' },
    purpose: {
      en: 'Confirms the pregnancy and expected delivery period for maternity benefit schemes.',
      te: 'మాతృత్వ ప్రయోజన పథకాల కోసం గర్భధారణ, ప్రసవ సమయాన్ని ధ్రువీకరిస్తుంది.',
    },
  },
  {
    id: 'property-or-pucca-house-proof',
    name: { en: 'House / property status proof', te: 'ఇల్లు / ఆస్తి హోదా రుజువు' },
    purpose: {
      en: 'Shows whether your family already owns a pucca house or land, which housing schemes check.',
      te: 'మీ కుటుంబానికి ఇప్పటికే పక్కా ఇల్లు లేదా భూమి ఉందో లేదో చూపే పత్రం. గృహ పథకాలు దీన్ని పరిశీలిస్తాయి.',
    },
  },
  {
    id: 'property-record',
    name: { en: 'Property / premises record', te: 'ఆస్తి / స్థలం రికార్డు' },
    purpose: {
      en: 'Shows ownership or lease of the premises where a business or workshop is run.',
      te: 'వ్యాపారం లేదా పనిశాల నడుపుతున్న స్థలం యాజమాన్యం లేదా కౌలు రికార్డు.',
    },
  },
  {
    id: 'sowing-certificate',
    name: { en: 'Sowing / cultivation certificate', te: 'విత్తన / సాగు ధ్రువీకరణ పత్రం' },
    purpose: {
      en: 'Confirms which crop was sown in a season, sometimes required by crop insurance schemes.',
      te: 'ఒక సీజన్‌లో ఏ పంట విత్తారో ధ్రువీకరించే పత్రం. కొన్ని పంట బీమా పథకాలు దీన్ని కోరతాయి.',
    },
    obtainVia: {
      en: 'Get it from the village revenue officer, agriculture officer or through the state crop insurance portal.',
      te: 'గ్రామ రెవెన్యూ అధికారి లేదా వ్యవసాయ అధికారి వద్ద పొందవచ్చు.',
    },
  },
  {
    id: 'mobile-number',
    name: { en: 'Mobile number', te: 'మొబైల్ నంబర్' },
    purpose: {
      en: 'Used for OTP, status updates and application alerts. It should be reachable by you.',
      te: 'OTP, దరఖాస్తు స్థితి, హెచ్చరికల కోసం ఉపయోగపడుతుంది. మీకు అందుబాటులో ఉండే నంబర్ ఇవ్వాలి.',
    },
  },
  {
    id: 'marriage-certificate',
    name: { en: 'Marriage certificate', te: 'వివాహ ధ్రువీకరణ పత్రం' },
    purpose: {
      en: 'Legal proof of marriage, used by schemes meant for married couples or widows.',
      te: 'వివాహానికి చట్టపరమైన రుజువు. వివాహిత జంటలు, వితంతువులకు ఉద్దేశించిన పథకాల్లో ఉపయోగపడుతుంది.',
    },
  },
  {
    id: 'death-certificate',
    name: { en: 'Death certificate', te: 'మరణ ధ్రువీకరణ పత్రం' },
    purpose: {
      en: 'Required by nominees when claiming insurance or pension after the death of a family member.',
      te: 'కుటుంబ సభ్యుడి మరణానంతరం బీమా లేదా పింఛను పొందేటప్పుడు నామినీలకు అవసరం.',
    },
    officialInfoUrl: 'https://crsorgi.gov.in/',
  },
  {
    id: 'pan',
    name: { en: 'PAN card', te: 'పాన్ కార్డు' },
    purpose: {
      en: 'Tax identity; some loan and business schemes ask for it, and income-tax payers are excluded from certain benefits.',
      te: 'పన్ను గుర్తింపు. కొన్ని రుణ, వ్యాపార పథకాలు దీన్ని కోరతాయి; ఆదాయపు పన్ను చెల్లించేవారికి కొన్ని ప్రయోజనాలు వర్తించవు.',
    },
    officialInfoUrl: 'https://www.incometax.gov.in/',
  },
  {
    id: 'voter-id',
    name: { en: 'Voter ID (EPIC)', te: 'ఓటరు గుర్తింపు కార్డు' },
    purpose: {
      en: 'Proof of identity and residence issued by the Election Commission.',
      te: 'ఎన్నికల సంఘం జారీ చేసిన గుర్తింపు, నివాస రుజువు.',
    },
    officialInfoUrl: 'https://www.eci.gov.in/',
  },
]

export const documentById = new Map(DOCUMENT_CATALOG.map((doc) => [doc.id, doc]))

export function getDocument(docId: string): DocCatalogEntry | undefined {
  return documentById.get(docId)
}
