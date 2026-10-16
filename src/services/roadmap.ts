import type { Localized, Scheme } from '../data/types.ts'
import { getDocument } from '../data/documents.ts'

export type RoadmapItem = { label: Localized; note?: Localized }

export type RoadmapStep = {
  id: string
  title: Localized
  body: Localized
  items?: RoadmapItem[]
  externalUrl?: string
  internalHref?: string
  internalLabel?: Localized
}

function docLabel(docId: string): Localized {
  const entry = getDocument(docId)
  if (entry) return entry.name
  return { en: docId.replace(/-/g, ' ') }
}

export function buildRoadmap(scheme: Scheme): RoadmapStep[] {
  const applicationEn = scheme.application.en
  const applicationTe = scheme.application.te ?? scheme.application.en
  const lastVerified = scheme.lastVerified

  const documentItems: RoadmapItem[] = scheme.documents.map((doc) => ({
    label: docLabel(doc.docId),
    note: doc.note,
  }))

  return [
    {
      id: 'documents',
      title: { en: 'Gather your documents', te: 'మీ పత్రాలు సిద్ధం చేసుకోండి' },
      body: {
        en: 'Keep physical copies of the documents below, and scanned copies (PDF or JPG) if the portal asks you to upload. Start with the required ones — missing papers are the most common reason applications are sent back.',
        te: 'క్రింది పత్రాల భౌతిక ప్రతులు మరియు పోర్టల్ అప్‌లోడ్ అడిగితే స్కాన్ కాపీలు (PDF లేదా JPG) సిద్ధంగా ఉంచుకోండి. తప్పనిసరి పత్రాలతో ప్రారంభించండి — పత్రాలు లేకపోవడమే దరఖాస్తులు వెనక్కి రావడానికి అత్యంత సాధారణ కారణం.',
      },
      items: documentItems,
    },
    {
      id: 'eligibility',
      title: { en: 'Re-check your eligibility', te: 'మీ అర్హతను మళ్ళీ తనిఖీ చేయండి' },
      body: {
        en: 'Open your eligibility receipt to see why this scheme matched for you and what information is still missing. If something does not match, re-answer the questionnaire first — do not proceed on a wrong assumption.',
        te: 'ఈ పథకం మీకు ఎందుకు సరిపోయింది మరియు ఇంకా ఏ సమాచారం లోపిస్తోందో చూడటానికి మీ అర్హత రసిద్ తెరవండి. ఏదైనా సరిపోకపోతే, తప్పు ఊహతో ముందుకు వెళ్ళకుండా ముందుగా ప్రశ్నావళిని మళ్ళీ సమాధానం ఇవ్వండి.',
      },
      internalHref: `#/receipt/${scheme.id}`,
      internalLabel: {
        en: 'Open eligibility receipt',
        te: 'అర్హత రసిద్ తెరవండి',
      },
    },
    {
      id: 'portal',
      title: { en: 'Open the official portal', te: 'అధికారిక పోర్టల్ తెరవండి' },
      body: {
        en: `Application channel recorded for this scheme:\n${applicationEn}\n\nOn the official portal, look for options named like "New User Registration", "Apply Online", "Beneficiary Login" or "Citizen Services" — the wording differs from portal to portal.`,
        te: `ఈ పథకానికి రికార్డ్ చేసిన దరఖాస్తు మార్గం:\n${applicationTe}\n\nఅధికారిక పోర్టల్‌లో "New User Registration", "Apply Online", "Beneficiary Login" లేదా "Citizen Services" వంటి పేర్లతో ఉన్న ఎంపికల కోసం చూడండి — పోర్టల్‌ను బట్టి పదాలు మారవచ్చు.`,
      },
      externalUrl: scheme.officialUrl,
    },
    {
      id: 'fill',
      title: { en: 'Fill your details carefully', te: 'మీ వివరాలను జాగ్రత్తగా నమోదు చేయండి' },
      body: {
        en: 'Enter your name, date of birth, address and other details exactly as they appear on your documents — even small spelling differences can get an application rejected. If bank details are asked, use the account shown in your passbook (account number and IFSC). Keep your mobile number ready for OTPs.',
        te: 'మీ పేరు, పుట్టిన తేదీ, చిరునామా మరియు ఇతర వివరాలను మీ పత్రాలలో ఉన్నట్లు ఖచ్చితంగా నమోదు చేయండి — చిన్న అక్షర తేడా కూడా దరఖాస్తు తిరస్కరించబడటానికి కారణం కావచ్చు. బ్యాంకు వివరాలు అడిగితే, పాస్‌బుక్‌లో ఉన్న ఖాతా (ఖాతా నంబర్ మరియు IFSC) వాడండి. OTPల కోసం మీ మొబైల్ నంబర్ సిద్ధంగా ఉంచుకోండి.',
      },
    },
    {
      id: 'review',
      title: { en: 'Review and submit', te: 'సమీక్షించి సమర్పించండి' },
      body: {
        en: 'Before the final submit, re-check every field against your documents. Many portals do not allow edits after submission, so this one minute of checking matters.',
        te: 'చివరి సమర్పణకు ముందు, ప్రతి విభాగాన్ని మీ పత్రాలతో సరిచూసుకోండి. చాలా పోర్టల్‌లు సమర్పణ తర్వాత మార్పులకు అవకాశం ఇవ్వవు — ఆ ఒక్క నిమిషం తనిఖీ చాలా ముఖ్యం.',
      },
    },
    {
      id: 'acknowledgment',
      title: { en: 'Save your application ID', te: 'మీ దరఖాస్తు ఐడిని సంరక్షించండి' },
      body: {
        en: 'After submitting, download or print the acknowledgment receipt and note the application or reference ID and the mobile number you used. You will need them later to track the application.',
        te: 'సమర్పించిన తర్వాత, అంగీకార రసిద్‌ను డౌన్‌లోడ్ చేసి లేదా ప్రింట్ చేసి, దరఖాస్తు లేదా రిఫరెన్స్ ఐడి మరియు మీరు వాడిన మొబైల్ నంబర్ నోట్ చేసుకోండి. తర్వాత దరఖాస్తు స్థితిని ట్రాక్ చేయడానికి అవి కావాలి.',
      },
    },
    {
      id: 'track',
      title: {
        en: 'Track the status and wait for official confirmation',
        te: 'స్థితిని ట్రాక్ చేసి అధికారిక ధ్రువీకరణ కోసం వేచి ఉండండి',
      },
      body: {
        en: `Check the application status on the same portal using your application ID. Our record for this scheme was last verified on ${lastVerified} — always confirm current details on the official portal. Final approval is given only by the concerned department; Sahara does not approve benefits.`,
        te: `మీ దరఖాస్తు ఐడితో అదే పోర్టల్‌లో దరఖాస్తు స్థితిని చూడండి. ఈ పథకంపై మా రికార్డు చివరిసారిగా ${lastVerified}న తనిఖీ చేయబడింది — ప్రస్తుత వివరాలను ఎల్లప్పుడూ అధికారిక పోర్టల్‌లో నిర్ధారించుకోండి. తుది ఆమోదం కేవలం సంబంధిత శాఖ మాత్రమే ఇస్తుంది; సహారా ప్రయోజనాలను ఆమోదించదు.`,
      },
      externalUrl: scheme.officialUrl,
    },
  ]
}
