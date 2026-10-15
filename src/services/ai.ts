import type { Localized } from '../data/types.ts'
import type { Scheme } from '../data/types.ts'
import { ALL_SCHEMES, getScheme } from '../data/index.ts'
import { bumpMetric, readMetrics } from './metrics.ts'
import type { Lang } from '../i18n/context.ts'

export type AiAnswer = {
  text: string
  mode: 'grounded' | 'ai'
  sources: { label: string; url: string }[]
  schemeId?: string
}

const SUGGESTIONS: Record<Lang, string[]> = {
  en: [
    'What is this scheme?',
    'Who is it for?',
    'What documents should I prepare?',
    'How do I apply?',
    'What should I verify before applying?',
  ],
  hi: [
    'यह योजना क्या है?',
    'यह किनके लिए है?',
    'मुझे कौन-से दस्तावेज़ तैयार करने चाहिए?',
    'मैं आवेदन कैसे करूँ?',
    'आवेदन से पहले क्या जाँचना चाहिए?',
  ],
  te: [
    'ఈ పథకం ఏమిటి?',
    'ఇది ఎవరి కోసం?',
    'నేను ఏ పత్రాలు సిద్ధం చేయాలి?',
    'నేను ఎలా దరఖాస్తు చేయాలి?',
    'దరఖాస్తు చేసే ముందు ఏమి తనిఖీ చేయాలి?',
  ],
  ta: [
    'இந்த திட்டம் என்ன?',
    'இது யாருக்கு?',
    'எனக்கு என்ன ஆவணங்கள் தயார் செய்ய வேண்டும்?',
    'நான் எப்படி விண்ணப்பிப்பது?',
    'விண்ணப்பிப்பதற்கு முன் என்ன சரிபார்க்க வேண்டும்?',
  ],
  bn: [
    'এই প্রকল্পটি কী?',
    'এটি কার জন্য?',
    'আমার কী কী কাগজপত্র প্রস্তুত করা উচিত?',
    'আমি কীভাবে আবেদন করব?',
    'আবেদনের আগে কী যাচাই করা উচিত?',
  ],
  mr: [
    'ही योजना काय आहे?',
    'ही कोणासाठी आहे?',
    'मला कोणते दस्तऐवज तयार करायचे?',
    'मी अर्ज कसा करू?',
    'अर्ज करण्यापूर्वी काय तपासावे?',
  ],
  gu: [
    'આ યોજના શું છે?',
    'તે કોના માટે છે?',
    'મારે શું દસ્તાવેજો તૈયાર કરવા જોઈએ?',
    'હું કેવી રીતે અરજી કરું?',
    'અરજી કરતા પહેલાં શું ચકાસવું જોઈએ?',
  ],
  kn: [
    'ಈ ಯೋಜನೆ ಏನು?',
    'ಇದು ಯಾರಿಗಾಗಿ?',
    'ನಾನು ಯಾವ ದಾಖಲೆಗಳನ್ನು ತಯಾರಿಸಬೇಕು?',
    'ನಾನು ಹೇಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬೇಕು?',
    'ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಮೊದಲು ಏನು ಪರಿಶೀಲಿಸಬೇಕು?',
  ],
  ml: [
    'ഈ പദ്ധതി എന്താണ്?',
    'ഇത് ആർക്കാണ്?',
    'എനിക്ക് എന്ത് രേഖകൾ തയ്യാറാക്കണം?',
    'ഞാൻ എങ്ങനെ അപേക്ഷിക്കും?',
    'അപേക്ഷിക്കുന്നതിന് മുമ്പ് എന്ത് പരിശോധിക്കണം?',
  ],
  pa: [
    'ਇਹ ਸਕੀਮ ਕੀ ਹੈ?',
    'ਇਹ ਕਿਸ ਲਈ ਹੈ?',
    'ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਤਿਆਰ ਕਰਨੇ ਚਾਹੀਦੇ ਹਨ?',
    'ਮੈਂ ਅਰਜ਼ੀ ਕਿਵੇਂ ਦੇਵਾਂ?',
    'ਅਰਜ਼ੀ ਦੇਣ ਤੋਂ ਪਹਿਲਾਂ ਕੀ ਤਸਦੀਕ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ?',
  ],
  or: [
    'ଏହି ଯୋଜନା କ’ଣ?',
    'ଏହା କାହା ପାଇଁ?',
    'ମୋତେ କେଉଁ ଦଲିଲ ପ୍ରସ୍ତୁତ କରିବା ଉଚିତ୍?',
    'ମୁଁ କିପରି ଆବେଦନ କରିବି?',
    'ଆବେଦନ ପୂର୍ବରୁ କ’ଣ ଯାଞ୍ଚ କରିବା ଉଚିତ୍?',
  ],
}

export function suggestedQuestions(lang: Lang): string[] {
  return SUGGESTIONS[lang] ?? SUGGESTIONS.en
}

type GroundedInput = {
  question: string
  schemeId?: string
  lang: Lang
}

type Template = {
  greeting: string
  noMatch: string
  docs: (name: string, docs: string) => string
  who: (name: string, forWhom: string, elig: string) => string
  apply: (name: string, how: string) => string
  verify: (status: string, date: string, uncertainty?: string) => string
  summary: (name: string, summary: string, benefits: string, applying: string) => string
}

const TEMPLATES: Record<Lang, Template> = {
  en: {
    greeting:
      'Hello! I am the Sahara AI assistant. Ask me about any scheme — for example "What is PM-KISAN?" or "Which schemes fit me?" — and I will answer from the verified scheme records in this catalogue.',
    noMatch:
      'I could not match that to a scheme in this catalogue. Try naming a scheme — for example "How does Jal Jeevan Mission work?" — or use the quick chips below. Answers come from the official records recorded here; final eligibility is always confirmed by the concerned department.',
    docs: (name, docs) =>
      `Documents recorded for ${name}:\n${docs}\n\nSome documents can vary by local office practice — confirm on the official portal.`,
    who: (name, forWhom, elig) =>
      `${name} is meant for: ${forWhom}\n\nEligibility as recorded: ${elig}`,
    apply: (name, how) => `How to apply for ${name}:\n${how}`,
    verify: (status, date, uncertainty) =>
      `Before applying: check the source verification status (${status}) and last-verified date (${date}).${uncertainty ? `\n\nKnown uncertainty: ${uncertainty}` : ''}\n\nFinal eligibility is always determined by the concerned department.`,
    summary: (name, summary, benefits, applying) =>
      `${name} — ${summary}\n\nBenefits: ${benefits}\n\nApplying: ${applying}`,
  },
  te: {
    greeting:
      'నమస్తే! నేను సహారా AI సహాయకుడిని. పథకాల గురించి ప్రశ్నించండి — "PM-KISAN అంటే ఏమిటి?", "నాకు ఏ పథకాలు వర్తిస్తాయి?" వంటివి అడగండి.',
    noMatch:
      'ఆ ప్రశ్నకు నేను ఖచ్చితమైన సమాధానం కనుగొనలేదు. పథకం పేరు చెప్పి అడగండి (ఉదా: "జల్ జీవన్ మిషన్ అంటే ఏమిటి?"), లేదా కింది చిప్‌లను ఉపయోగించండి. సమాధానాలు ఈ కేటలాగ్‌లోని అధికారిక రికార్డుల నుండే వస్తాయి; తుది అర్హత సంబంధిత శాఖే నిర్ధారిస్తుంది.',
    docs: (name, docs) =>
      `${name} కోసం పథకం రికార్డులో ఉన్న పత్రాలు:\n${docs}\n\nస్థానిక కార్యాలయం నియమాలను బట్టి కొన్ని పత్రాలు మారవచ్చు — అధికారిక పోర్టల్‌లో నిర్ధారించుకోండి.`,
    who: (name, forWhom, elig) => `${name}: ${forWhom}\n\n${elig}`,
    apply: (name, how) => `${name} దరఖాస్తు విధానం:\n${how}`,
    verify: (status, date, uncertainty) =>
      `దరఖాస్తు చేసే ముందు: మూలం ధ్రువీకరణ స్థితి — ${status}, చివరిసారి తనిఖీ ${date}.${uncertainty ? `\n\nతెలిసిన అనిశ్చితి: ${uncertainty}` : ''}\n\nఅర్హతను సంబంధిత శాఖ మాత్రమే తుదిగా నిర్ధారిస్తుంది.`,
    summary: (name, summary, benefits, applying) =>
      `${name} — ${summary}\n\nప్రయోజనం: ${benefits}\n\nదరఖాస్తు: ${applying}`,
  },
  hi: {
    greeting:
      'नमस्ते! मैं सहारा AI सहायक हूँ। किसी भी योजना के बारे में पूछें — जैसे "PM-KISAN क्या है?" या "मुझे कौन-सी योजनाएँ मिल सकती हैं?" — मैं इस कैटलॉग के सत्यापित योजना रिकॉर्ड से उत्तर दूँगा।',
    noMatch:
      'मैं उसे इस कैटलॉग की किसी योजना से मैच नहीं कर सका। किसी योजना का नाम लिखकर पूछें — जैसे "जल जीवन मिशन कैसे काम करता है?" — या नीचे दिए चिप्स उपयोग करें। उत्तर यहाँ दर्ज आधिकारिक रिकॉर्ड से आते हैं; अंतिम पात्रता हमेशा संबंधित विभाग पुष्टि करता है।',
    docs: (name, docs) =>
      `${name} के लिए दर्ज दस्तावेज़:\n${docs}\n\nकुछ दस्तावेज़ स्थानीय कार्यालय की प्रथा के अनुसार बदल सकते हैं — आधिकारिक पोर्टल पर पुष्टि करें।`,
    who: (name, forWhom, elig) =>
      `${name} किनके लिए है: ${forWhom}\n\nदर्ज पात्रता: ${elig}`,
    apply: (name, how) => `${name} के लिए आवेदन कैसे करें:\n${how}`,
    verify: (status, date, uncertainty) =>
      `आवेदन से पहले: स्रोत सत्यापन स्थिति (${status}) और अंतिम सत्यापन तिथि (${date}) जाँचें।${uncertainty ? `\n\nज्ञात अनिश्चितता: ${uncertainty}` : ''}\n\nअंतिम पात्रता हमेशा संबंधित विभाग निर्धारित करता है।`,
    summary: (name, summary, benefits, applying) =>
      `${name} — ${summary}\n\nलाभ: ${benefits}\n\nआवेदन: ${applying}`,
  },
  ta: {
    greeting:
      'வணக்கம்! நான் சஹாரா AI உதவியாளர். எந்த திட்டத்தைப் பற்றியும் கேளுங்கள் — எ.கா. "PM-KISAN என்ன?" அல்லது "எனக்கு ஏ திட்டங்கள் பொருந்தும்?" — இந்த அட்டவணையின் சரிபார்க்கப்பட்ட திட்ட பதிவுகளிலிருந்து நான் பதிலளிப்பேன்.',
    noMatch:
      'இதை இந்த அட்டவணையின் ஒரு திட்டத்துடன் பொருத்த முடியவில்லை. திட்டத்தின் பெயரைக் குறிப்பிட்டு கேளுங்கள் — எ.கா. "ஜல் ஜீவன் மிஷன் எப்படி செயல்படுகிறது?" — அல்லது கீழே உள்ள சிப்புகளைப் பயன்படுத்துங்கள். பதில்கள் இங்கே பதிவுசெய்யப்பட்ட அதிகாரப்பூர்வ பதிவுகளிலிருந்து வருகின்றன; இறுதி தகுதியை எப்போதும் சம்பந்தப்பட்ட துறை மட்டுமே உறுதிசெய்யும்.',
    docs: (name, docs) =>
      `${name} க்கான பதிவுசெய்யப்பட்ட ஆவணங்கள்:\n${docs}\n\nசில ஆவணங்கள் உள்ளூர் அலுவலக நடைமுறைப்படி மாறலாம் — அதிகாரப்பூர்வ போர்ட்டலில் உறுதிசெய்யவும்.`,
    who: (name, forWhom, elig) =>
      `${name} யாருக்காக: ${forWhom}\n\nபதிவுப்படி தகுதி: ${elig}`,
    apply: (name, how) => `${name} க்கு எப்படி விண்ணப்பிப்பது:\n${how}`,
    verify: (status, date, uncertainty) =>
      `விண்ணப்பிப்பதற்கு முன்: மூல சரிபார்ப்பு நிலை (${status}) மற்றும் கடைசி சரிபார்ப்பு தேதி (${date}) சரிபார்க்கவும்.${uncertainty ? `\n\nஅறியப்பட்ட நிச்சயமற்மை: ${uncertainty}` : ''}\n\nஇறுதி தகுதியை சம்பந்தப்பட்ட துறை மட்டுமே நிர்ணயிக்கிறது.`,
    summary: (name, summary, benefits, applying) =>
      `${name} — ${summary}\n\nநன்மைகள்: ${benefits}\n\nவிண்ணப்பம்: ${applying}`,
  },
  bn: {
    greeting:
      'নমস্কার! আমি সাহারা AI সহকারী। যেকোনো প্রকল্প সম্পর্কে জিজ্ঞাসা করুন — যেমন "PM-KISAN কী?" বা "আমার জন্য কোন প্রকল্প মেলতে পারে?" — আমি এই তালিকার যাচাইকৃত প্রকল্প রেকর্ড থেকে উত্তর দেব।',
    noMatch:
      'এটি এই তালিকার কোনো প্রকল্পের সাথে মেলাতে পারিনি। একটি প্রকল্পের নাম উল্লেখ করে জিজ্ঞাসা করুন — যেমন "জল জীবন মিশন কীভাবে কাজ করে?" — অথবা নিচের চিপ ব্যবহার করুন। উত্তরগুলি এখানে দর্জ সরকারি রেকর্ড থেকে আসে; চূড়ান্ত যোগ্যতা সর্বদা সংশ্লিষ্ট বিভাগ নিশ্চিত করে।',
    docs: (name, docs) =>
      `${name}-এর জন্য দর্জ কাগজপত্র:\n${docs}\n\nকিছু কাগজপত্র স্থানীয় অফিসের প্রথা অনুযায়ী বদলাতে পারে — সরকারি পোর্টালে নিশ্চিত করুন।`,
    who: (name, forWhom, elig) =>
      `${name} কার জন্য: ${forWhom}\n\nদর্জ যোগ্যতা: ${elig}`,
    apply: (name, how) => `${name}-এর জন্য আবেদন কীভাবে করবেন:\n${how}`,
    verify: (status, date, uncertainty) =>
      `আবেদনের আগে: উৎস যাচাইয়ের অবস্থা (${status}) এবং সর্বশেষ যাচাইয়ের তারিখ (${date}) দেখুন।${uncertainty ? `\n\nজ্ঞাত অনিশ্চয়তা: ${uncertainty}` : ''}\n\nচূড়ান্ত যোগ্যতা সর্বদা সংশ্লিষ্ট বিভাগ নির্ধারণ করে।`,
    summary: (name, summary, benefits, applying) =>
      `${name} — ${summary}\n\nসুবিধা: ${benefits}\n\nআবেদন: ${applying}`,
  },
  mr: {
    greeting:
      'नमस्कार! मी सहारा AI सहाय्यक आहे. कोणत्याही योजनेबद्दल विचारा — उदा. "PM-KISAN काय आहे?" किंवा "माझ्यासाठी कोणत्या योजना जुळू शकतात?" — मी या निर्देशिकेतील पडताळलेल्या योजना नोंदींमधून उत्तर देईन.',
    noMatch:
      'त्याला या निर्देशिकेतील कोणत्याही योजनेशी जुळवता आले नाही. योजनेचे नाव नमूद करून विचारा — उदा. "जल जीवन मिशन कसे काम करते?" — किंवा खालील चिप्स वापरा. उत्तरे इथे नोंदवलेल्या अधिकृत नोंदींमधून येतात; अंतिम पात्रता नेहमी संबंधित विभागच पुष्टी करतो.',
    docs: (name, docs) =>
      `${name} साठी नोंदवलेले दस्तऐवज:\n${docs}\n\nकाही दस्तऐवज स्थानिक कार्यालयाच्या पद्धतीनुसार बदलू शकतात — अधिकृत पोर्टलवर पुष्टी करा.`,
    who: (name, forWhom, elig) =>
      `${name} कोणासाठी आहे: ${forWhom}\n\nनोंदवलेली पात्रता: ${elig}`,
    apply: (name, how) => `${name} साठी अर्ज कसा करावा:\n${how}`,
    verify: (status, date, uncertainty) =>
      `अर्ज करण्यापूर्वी: स्रोत पडताळणी स्थिती (${status}) आणि शेवटची पडताळणी तारीख (${date}) तपासा.${uncertainty ? `\n\nज्ञात अनिश्चितता: ${uncertainty}` : ''}\n\nअंतिम पात्रता नेहमी संबंधित विभागच ठरवतो.`,
    summary: (name, summary, benefits, applying) =>
      `${name} — ${summary}\n\nलाभ: ${benefits}\n\nअर्ज: ${applying}`,
  },
  gu: {
    greeting:
      'નમસ્તે! હું સહારા AI સહાયક છું. કોઈપણ યોજના વિશે પૂછો — દા.ત. "PM-KISAN શું છે?" અથવા "મારા માટે કઈ યોજનાઓ મેળ ખાઈ શકે?" — હું આ દિશાસૂચિના ચકાસાયેલા યોજના રેકોર્ડમાંથી જવાબ આપીશ.',
    noMatch:
      'તેને આ દિશાસૂચિની કોઈ યોજના સાથે મેળવી શક્યું નથી. યોજનાનું નામ લખીને પૂછો — દા.ત. "જલ જીવન મિશન કેવી રીતે કામ કરે છે?" — અથવા નીચેના ચિપ્સ વાપરો. જવાબો અહીં નોંધાયેલા સત્તાવાર રેકોર્ડમાંથી આવે છે; અંતિમ પાત્રતા હંમેશા સંબંધિત વિભાગ નક્કી કરે છે.',
    docs: (name, docs) =>
      `${name} માટે નોંધાયેલા દસ્તાવેજો:\n${docs}\n\nકેટલાક દસ્તાવેજો સ્થાનિક ઓફિસ પ્રથા મુજબ બદલાઈ શકે છે — સત્તાવાર પોર્ટલ પર ખાતરી કરો.`,
    who: (name, forWhom, elig) =>
      `${name} કોના માટે છે: ${forWhom}\n\nનોંધાયેલી પાત્રતા: ${elig}`,
    apply: (name, how) => `${name} માટે અરજી કેવી રીતે કરવી:\n${how}`,
    verify: (status, date, uncertainty) =>
      `અરજી કરતા પહેલાં: સ્રોત ચકાસણી સ્થિતિ (${status}) અને છેલ્લે ચકાસાયેલ તારીખ (${date}) તપાસો.${uncertainty ? `\n\nજાણીતી અનિશ્ચિતતા: ${uncertainty}` : ''}\n\nઅંતિમ પાત્રતા હંમેશા સંબંધિત વિભાગ નક્કી કરે છે.`,
    summary: (name, summary, benefits, applying) =>
      `${name} — ${summary}\n\nલાભો: ${benefits}\n\nઅરજી: ${applying}`,
  },
  kn: {
    greeting:
      'ನಮಸ್ಕಾರ! ನಾನು ಸಹಾರಾ AI ಸಹಾಯಕ. ಯಾವುದೇ ಯೋಜನೆಯ ಬಗ್ಗೆ ಕೇಳಿ — ಉದಾ. "PM-KISAN ಏನು?" ಅಥವಾ "ನನಗೆ ಯಾವ ಯೋಜನೆಗಳು ಹೊಂದಬಹುದು?" — ಈ ಕೋಶಿಕೆಯ ಪರಿಶೀಲಿಸಿದ ಯೋಜನಾ ದಾಖಲೆಗಳಿಂದ ನಾನು ಉತ್ತರಿಸುತ್ತೇನೆ.',
    noMatch:
      'ಇದನ್ನು ಈ ಕೋಶಿಕೆಯ ಯಾವುದೇ ಯೋಜನೆಯೊಂದಿಗೆ ಹೊಂದಿಸಲಾಗಲಿಲ್ಲ. ಯೋಜನೆಯ ಹೆಸರು ಹೇಳಿ ಕೇಳಿ — ಉದಾ. "ಜಲ್ ಜೀವನ್ ಮಿಷನ್ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?" — ಅಥವಾ ಕೆಳಗಿನ ಚಿಪ್‌ಗಳನ್ನು ಬಳಸಿ. ಉತ್ತರಗಳು ಇಲ್ಲಿ ದಾಖಲಿಸಿದ ಅಧಿಕೃತ ದಾಖಲೆಗಳಿಂದ ಬರುತ್ತವೆ; ಅಂತಿಮ ಅರ್ಹತೆಯನ್ನು ಸಂಬಂಧಿತ ಇಲಾಖೆ ಮಾತ್ರ ದೃಢೀಕರಿಸುತ್ತದೆ.',
    docs: (name, docs) =>
      `${name} ಗಾಗಿ ದಾಖಲಿಸಿದ ದಾಖಲೆಗಳು:\n${docs}\n\nಕೆಲವು ದಾಖಲೆಗಳು ಸ್ಥಳೀಯ ಕಚೇರಿ ಪದ್ಧತಿಯಂತೆ ಬದಲಾಗಬಹುದು — ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ದೃಢೀಕರಿಸಿ.`,
    who: (name, forWhom, elig) =>
      `${name} ಯಾರಿಗಾಗಿ: ${forWhom}\n\nದಾಖಲಿಸಿದ ಅರ್ಹತೆ: ${elig}`,
    apply: (name, how) => `${name} ಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದು ಹೇಗೆ:\n${how}`,
    verify: (status, date, uncertainty) =>
      `ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಮೊದಲು: ಮೂಲ ಪರಿಶೀಲನೆ ಸ್ಥಿತಿ (${status}) ಮತ್ತು ಕೊನೆಯ ಪರಿಶೀಲನೆ ದಿನಾಂಕ (${date}) ಪರಿಶೀಲಿಸಿ.${uncertainty ? `\n\nತಿಳಿದ ಅನಿಶ್ಚಿತತೆ: ${uncertainty}` : ''}\n\nಅಂತಿಮ ಅರ್ಹತೆಯನ್ನು ಸಂಬಂಧಿತ ಇಲಾಖೆ ಮಾತ್ರ ನಿರ್ಧರಿಸುತ್ತದೆ.`,
    summary: (name, summary, benefits, applying) =>
      `${name} — ${summary}\n\nಪ್ರಯೋಜನಗಳು: ${benefits}\n\nಅರ್ಜಿ: ${applying}`,
  },
  ml: {
    greeting:
      'നമസ്കാരം! ഞാൻ സഹാര AI സഹായി. ഏതെങ്കിലും പദ്ധതിയെക്കുറിച്ച് ചോദിക്കൂ — ഉദാ. "PM-KISAN എന്താണ്?" അല്ലെങ്കിൽ "എനിക്ക് ഏത് പദ്ധതികൾ ചേരാം?" — ഈ നിർദ്ദേശികയിലെ പരിശോധിച്ച പദ്ധതി രേഖകളിൽ നിന്ന് ഞാൻ ഉത്തരം നൽകും.',
    noMatch:
      'ഇതിനെ ഈ നിർദ്ദേശികയിലെ ഒരു പദ്ധതിയുമായും പൊരുത്തപ്പെടുത്താൻ കഴിഞ്ഞില്ല. ഒരു പദ്ധതിയുടെ പേര് പരാമർശിച്ച് ചോദിക്കൂ — ഉദാ. "ജൽ ജീവൻ മിഷൻ എങ്ങനെ പ്രവർത്തിക്കുന്നു?" — അല്ലെങ്കിൽ താഴെയുള്ള ചിപ്പുകൾ ഉപയോഗിക്കൂ. ഉത്തരങ്ങൾ ഇവിടെ രേഖപ്പെടുത്തിയ ഔദ്യോഗിക രേഖകളിൽ നിന്നാണ്; അന്തിമ യോഗ്യത എപ്പോഴും ബന്ധപ്പെട്ട വകുപ്പ് മാത്രമേ സ്ഥിരീകരിക്കൂ.',
    docs: (name, docs) =>
      `${name}-ന് രേഖപ്പെടുത്തിയ രേഖകൾ:\n${docs}\n\nചില രേഖകൾ പ്രാദേശിക ഓഫീസ് രീതികളനുസരിച്ച് മാറാം — ഔദ്യോഗിക പോർട്ടലിൽ സ്ഥിരീകരിക്കുക.`,
    who: (name, forWhom, elig) =>
      `${name} ആർക്കായി: ${forWhom}\n\nരേഖപ്പെടുത്തിയ യോഗ്യത: ${elig}`,
    apply: (name, how) => `${name}-ന് എങ്ങനെ അപേക്ഷിക്കാം:\n${how}`,
    verify: (status, date, uncertainty) =>
      `അപേക്ഷിക്കുന്നതിന് മുമ്പ്: ഉറവിട പരിശോധന സ്ഥിതി (${status}) എന്നിയ അവസാന പരിശോധന തീയതി (${date}) പരിശോധിക്കുക.${uncertainty ? `\n\nഅറിയപ്പെടുന്ന അനിശ്ചിതത്വം: ${uncertainty}` : ''}\n\nഅന്തിമ യോഗ്യത ബന്ധപ്പെട്ട വകുപ്പ് മാത്രമേ നിർണ്ണയിക്കൂ.`,
    summary: (name, summary, benefits, applying) =>
      `${name} — ${summary}\n\nആനുകൂല്യങ്ങൾ: ${benefits}\n\nഅപേക്ഷ: ${applying}`,
  },
  pa: {
    greeting:
      'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਸਹਾਰਾ AI ਸਹਾਇਕ ਹਾਂ। ਕਿਸੇ ਵੀ ਸਕੀਮ ਬਾਰੇ ਪੁੱਛੋ — ਜਿਵੇਂ "PM-KISAN ਕੀ ਹੈ?" ਜਾਂ "ਮੇਰੇ ਲਈ ਕਿਹੜੀਆਂ ਸਕੀਮਾਂ ਮੇਲ ਖਾ ਸਕਦੀਆਂ ਹਨ?" — ਮੈਂ ਇਸ ਡਾਇਰੈਕਟਰੀ ਦੇ ਤਸਦੀਕ ਕੀਤੇ ਸਕੀਮ ਰਿਕਾਰਡਾਂ ਤੋਂ ਜਵਾਬ ਦੇਵਾਂਗਾ।',
    noMatch:
      'ਮੈਂ ਇਸ ਨੂੰ ਇਸ ਡਾਇਰੈਕਟਰੀ ਦੀ ਕਿਸੇ ਸਕੀਮ ਨਾਲ ਮੇਲ ਨਹੀਂ ਕਰ ਸਕਿਆ। ਕਿਸੇ ਸਕੀਮ ਦਾ ਨਾਮ ਦੱਸ ਕੇ ਪੁੱਛੋ — ਜਿਵੇਂ "ਜਲ ਜੀਵਨ ਮਿਸ਼ਨ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ?" — ਜਾਂ ਹੇਠਾਂ ਦੀਆਂ ਚਿੱਪਾਂ ਵਰਤੋ। ਜਵਾਬ ਇੱਥੇ ਦਰਜ ਸਰਕਾਰੀ ਰਿਕਾਰਡਾਂ ਤੋਂ ਆਉਂਦੇ ਹਨ; ਅੰਤਿਮ ਯੋਗਤਾ ਹਮੇਸ਼ਾ ਸੰਬੰਧਿਤ ਵਿਭਾਗ ਹੀ ਪੁਸ਼ਟੀ ਕਰਦਾ ਹੈ।',
    docs: (name, docs) =>
      `${name} ਲਈ ਦਰਜ ਦਸਤਾਵੇਜ਼:\n${docs}\n\nਕੁਝ ਦਸਤਾਵੇਜ਼ ਸਥਾਨਕ ਦਫ਼ਤਰ ਦੇ ਤਰੀਕਿਆਂ ਨਾਲ ਬਦਲ ਸਕਦੇ ਹਨ — ਸਰਕਾਰੀ ਪੋਰਟਲ ਤੇ ਤਸਦੀਕ ਕਰੋ।`,
    who: (name, forWhom, elig) =>
      `${name} ਕਿਸ ਲਈ ਹੈ: ${forWhom}\n\nਦਰਜ ਯੋਗਤਾ: ${elig}`,
    apply: (name, how) => `${name} ਲਈ ਅਰਜ਼ੀ ਕਿਵੇਂ ਦੇਣੀ ਹੈ:\n${how}`,
    verify: (status, date, uncertainty) =>
      `ਅਰਜ਼ੀ ਦੇਣ ਤੋਂ ਪਹਿਲਾਂ: ਸਰੋਤ ਤਸਦੀਕ ਸਥਿਤੀ (${status}) ਅਤੇ ਆਖਰੀ ਤਸਦੀਕ ਤਾਰੀਖ (${date}) ਚੈੱਕ ਕਰੋ।${uncertainty ? `\n\nਜਾਣਿਆ ਗਿਆ ਅਨਿਸ਼ਚਿਤਤਾ: ${uncertainty}` : ''}\n\nਅੰਤਿਮ ਯੋਗਤਾ ਹਮੇਸ਼ਾ ਸੰਬੰਧਿਤ ਵਿਭਾਗ ਹੀ ਤੈਅ ਕਰਦਾ ਹੈ।`,
    summary: (name, summary, benefits, applying) =>
      `${name} — ${summary}\n\nਲਾਭ: ${benefits}\n\nਅਰਜ਼ੀ: ${applying}`,
  },
  or: {
    greeting:
      'ନମସ୍କାର! ମୁଁ ସହାରା AI ସାହାୟକ। ଯେକୌଣସି ଯୋଜନା ବିଷୟରେ ପଚାରନ୍ତୁ — ଯେପରି "PM-KISAN କ’ଣ?" କିମ୍ବା "ମୋ ପାଇଁ କେଉଁ ଯୋଜନା ମେଳ ଖାଇପାରେ?" — ମୁଁ ଏହି ନିର୍ଦ୍ଦେଶିକାର ଯାଞ୍ଚ ହୋଇଥିବା ଯୋଜନା ରେକର୍ଡରୁ ଉତ୍ତର ଦେବି।',
    noMatch:
      'ଏହାକୁ ଏହି ନିର୍ଦ୍ଦେଶିକାର କୌଣସି ଯୋଜନା ସହ ମେଳ କରାଯାଇ ପାରିଲା ନାହିଁ। ଯୋଜନାର ନାମ ଉଲ୍ଲେଖ କରି ପଚାରନ୍ତୁ — ଯେପରି "ଜଲ୍ ଜୀବନ୍ ମିଶନ୍ କିପରି କାମ କରେ?" — କିମ୍ବା ତଳେ ଥିବା ଚିପ୍ ବ୍ୟବହାର କରନ୍ତୁ। ଉତ୍ତରଗୁଡ଼ିକ ଏଠାରେ ରେକର୍ଡ ହୋଇଥିବା ସରକାରୀ ରେକର୍ଡରୁ ଆସେ; ଚୂଡ଼ାନ୍ତ ଯୋଗ୍ୟତା ସର୍ବଦା ସଂପୃକ୍ତ ବିଭାଗ ହିଁ ନିଶ୍ଚିତ କରେ।',
    docs: (name, docs) =>
      `${name} ପାଇଁ ରେକର୍ଡ ହୋଇଥିବା ଦଲିଲ:\n${docs}\n\nକିଛି ଦଲିଲ ସ୍ଥାନୀୟ ଅଫିସ ପ୍ରଥା ଅନୁସାରେ ବଦଳିପାରେ — ସରକାରୀ ପୋର୍ଟାଲରେ ନିଶ୍ଚିତ କରନ୍ତୁ।`,
    who: (name, forWhom, elig) =>
      `${name} କାହା ପାଇଁ: ${forWhom}\n\nରେକର୍ଡ ହୋଇଥିବା ଯୋଗ୍ୟତା: ${elig}`,
    apply: (name, how) => `${name} ପାଇଁ ଆବେଦନ କିପରି କରିବେ:\n${how}`,
    verify: (status, date, uncertainty) =>
      `ଆବେଦନ ପୂର୍ବରୁ: ଉତ୍ସ ଯାଞ୍ଚ ସ୍ଥିତି (${status}) ଏବଂ ଶେଷ ଯାଞ୍ଚ ତାରିଖ (${date}) ଯାଞ୍ଚ କରନ୍ତୁ।${uncertainty ? `\n\nଜଣା ଥିବା ଅନିଶ୍ଚିତତା: ${uncertainty}` : ''}\n\nଚୂଡ଼ାନ୍ତ ଯୋଗ୍ୟତା ସର୍ବଦା ସଂପୃକ୍ତ ବିଭାଗ ନିର୍ଦ୍ଧାରଣ କରେ।`,
    summary: (name, summary, benefits, applying) =>
      `${name} — ${summary}\n\nଲାଭ: ${benefits}\n\nଆବେଦନ: ${applying}`,
  },
}

export function matchSchemeByName(message: string): Scheme | undefined {
  const q = message.toLowerCase()
  if (q.length < 3) return undefined
  const stop = new Set([
    'what', 'who', 'how', 'the', 'for', 'about', 'scheme', 'schemes', 'tell', 'me',
    'please', 'can', 'you', 'is', 'are', 'does', 'my', 'any',
    'కీ', 'పథకం', 'వివరాలు', 'కి', 'ఏ', 'నా', 'ఎలా',
    'क्या', 'है', 'के', 'लिए', 'मेरे', 'कैसे', 'योजना', 'बारे',
    'என்ன', 'இது', 'எப்படி', 'எனக்கு', 'திட்டம்',
    'কী', 'এটি', 'কি', 'আমার', 'কীভাবে', 'প্রকল্প',
    'काय', 'आहे', 'कसा', 'माझ्या', 'योजना',
    'શું', 'છે', 'કેવી', 'મારા', 'યોજના',
    'ಏನು', 'ಹೇಗೆ', 'ನನ್ನ', 'ಯೋಜನೆ',
    'എന്താണ്', 'എങ്ങനെ', 'എന്റെ', 'പദ്ധതി',
    'ਕੀ', 'ਹੈ', 'ਕਿਵੇਂ', 'ਮੇਰੇ', 'ਸਕੀਮ',
    'କ’ଣ', 'କିପରି', 'ମୋ', 'ଯୋଜନା',
  ])
  const words = q
    .replace(/[^a-z0-9\u0900-\u0d7f\s-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stop.has(word))
  let best: { scheme: Scheme; score: number } | undefined
  for (const scheme of ALL_SCHEMES) {
    if (scheme.publication !== 'published') continue
    const haystacks = [
      scheme.id.replace(/-/g, ' '),
      scheme.name.en.toLowerCase(),
      scheme.fullName.en.toLowerCase(),
    ]
    for (const haystack of haystacks) {
      for (const word of words) {
        if (haystack.includes(word)) {
          const score = word.length + (haystack.startsWith(word) ? 4 : 0)
          if (!best || score > best.score) best = { scheme, score }
        }
      }
    }
    const name = scheme.name.en.toLowerCase()
    const fullName = scheme.fullName.en.toLowerCase()
    if (q.includes(name) || q.includes(fullName)) return scheme
  }
  return best && best.score >= 5 ? best.scheme : undefined
}

function pickLocal(value: Localized, lang: Lang) {
  return lang === 'te' && value.te ? value.te : value.en
}

function groundedAnswer({ question, schemeId, lang }: GroundedInput): AiAnswer {
  const matched = schemeId ? getScheme(schemeId) : matchSchemeByName(question)
  const scheme: Scheme | undefined = matched
  const q = question.toLowerCase()
  const tpl = TEMPLATES[lang] ?? TEMPLATES.en
  const sources = scheme
    ? [
        { label: scheme.officialUrl.replace(/^https?:\/\//, '').split('/')[0], url: scheme.officialUrl },
        ...(scheme.otherUrls ?? []),
      ]
    : []

  if (!scheme) {
    if (/hello|hi\b|hey|namaste|నమస్తే|హలో|नमस्ते|வணக்கம்|নমস্কার|नमस्कार|નમસ્તે|ನಮಸ್ಕಾര|നമസ്കാര|ਸਤ ਸ੍ਰੀ|ନମସ୍କାର/.test(q)) {
      return { text: tpl.greeting, mode: 'grounded', sources: [] }
    }
    return { text: tpl.noMatch, mode: 'grounded', sources: [] }
  }

  const name = pickLocal(scheme.name, lang)
  const local = (value: Localized) => pickLocal(value, lang)

  let body: string
  if (/document|papers|proof|దస్తావేజు|పత్ర|धरना|दस्तावेज|ஆவண|কাগজ|दस्तऐवज|ದಾಖಲ|രേഖ|ਦਸਤਾਵੇਜ|ଦଲିল/.test(q)) {
    const docs = scheme.documents
      .map((doc) => `• ${doc.docId.replace(/-/g, ' ')} (${doc.requirement})`)
      .join('\n')
    body = tpl.docs(name, docs)
  } else if (/who|intended|beneficiar|ఎవరు|కోసం|कौन|किनके|யாருக்கு|কার জন্য|कोणासाठी|કોના|ಯಾರಿಗಾಗಿ|ആർക്കായി|ਕਿਸ ਲਈ|କାହା ପାଇଁ/.test(q)) {
    body = tpl.who(name, local(scheme.beneficiaries), local(scheme.eligibilityText))
  } else if (/apply|application|how|దరఖాస్తు|ఎలా|आवेदन|कैसे|விண்ணப்பம்|আবেদন|अर्ज|અરજી|ಅರ್ಜಿ|അപേക्ष|ਅਰਜ਼ੀ|ଆବେଦନ/.test(q)) {
    body = tpl.apply(name, local(scheme.application))
  } else if (/verify|before|check|తనిఖీ|ముందు|पुष्टि|जाँच|சரிபார்|যাচাই|तपास|ચકાસ|ಪರಿಶೀಲ|പരിശോധ|ਤਸਦੀਕ|ଯାଞ୍ଚ/.test(q)) {
    body = tpl.verify(scheme.verification, scheme.lastVerified, scheme.knownUncertainty ? local(scheme.knownUncertainty) : undefined)
  } else {
    body = tpl.summary(name, local(scheme.summary), local(scheme.benefits), local(scheme.application))
  }

  return { text: body, mode: 'grounded', sources, schemeId: scheme.id }
}

function aiEndpoint(): string | null {
  const configured = import.meta.env.VITE_AI_ENDPOINT as string | undefined
  if (configured) return configured
  if (typeof window !== 'undefined' && window.location.hostname.endsWith('vercel.app')) {
    return '/api/explain'
  }
  return null
}

async function aiAnswer(input: GroundedInput): Promise<AiAnswer | null> {
  const endpoint = aiEndpoint()
  if (!endpoint) return null
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: controller.signal,
    })
    if (!response.ok) return null
    const data = (await response.json()) as { text?: string; sources?: { label: string; url: string }[] }
    if (!data.text) return null
    return { text: data.text, mode: 'ai', sources: data.sources ?? [] }
  } catch {
    return null
  } finally {
    window.clearTimeout(timer)
  }
}

export async function answerQuestion(input: GroundedInput): Promise<AiAnswer> {
  bumpMetric('aiQuestions')
  const remote = await aiAnswer(input)
  if (remote) return remote
  return groundedAnswer(input)
}

export function readAiMetrics() {
  return readMetrics()
}
