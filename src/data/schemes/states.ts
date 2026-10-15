import type { Scheme } from '../types.ts'

export const stateSchemes: Scheme[] = [
  {
    id: 'ap-thalliki-vandanam',
    name: { en: 'Thalliki Vandanam', te: 'తల్లికి వందనం' },
    fullName: {
      en: 'Thalliki Vandanam – Annual Education Assistance for Mothers/Guardians',
      te: 'తల్లికి వందనం – తల్లులు/సంరక్షకులకు వార్షిక విద్యా సహాయం',
    },
    department: { en: 'School Education Department, Government of Andhra Pradesh' },
    level: 'state',
    state: 'AP',
    categories: ['education'],
    beneficiaries: {
      en: 'Mothers or guardians of children studying in Classes I to XII (including Intermediate) in recognized institutions in Andhra Pradesh',
    },
    summary: {
      en: '₹15,000 per child per year is paid to the mother or guardian so that children keep attending school from Class 1 to Class 12.',
      te: 'పాఠశాల నుండి ఇంటర్ వరకు (1–12 తరగతులు) చదువుతున్న పిల్లల తల్లులకు లేదా సంరక్షకులకు సంవత్సరానికి రూ.15,000 ఆర్థిక సహాయం.',
    },
    eligibilityText: {
      en: 'Open to eligible mothers or guardians sending children to Classes I–XII (including Intermediate) in recognized government, private aided, private unaided and residential schools and junior colleges, irrespective of the number of children. Some categories such as families of government employees, four-wheeler owners, income-tax payers and households with more than 3 acres of wet land are reported to be excluded under the prescribed criteria — confirm the current guidelines at your Grama/Ward Secretariat.',
    },
    benefits: {
      en: '₹15,000 per child per year is sanctioned to the mother or guardian. As per G.O.Ms.No.16 dated 16-07-2026, ₹2,000 per student is deducted at source for school maintenance, and about ₹13,000 is reported to be credited to the Aadhaar-linked bank account. For 2026-27, ₹10,120.78 crore was sanctioned covering 67,47,190 students and 42,70,802 mothers/guardians.',
    },
    benefitsVerified: true,
    application: {
      en: 'No separate application is usually needed — schools upload student details and the SGSW department verifies beneficiaries against household databases. Check eligibility and payment status with the mother Aadhaar number on the Beneficiary Management portal, through the official WhatsApp helpline, or at your Grama/Ward Secretariat.',
    },
    officialUrl: 'https://bm-sgsw.ap.gov.in/BM/Applnstatus',
    otherUrls: [
      {
        label: 'Thalliki Vandanam scheme portal (Government of Andhra Pradesh)',
        url: 'https://rtgs.ap.gov.in/tuv',
      },
    ],
    documents: [
      { docId: 'aadhaar', requirement: 'required', note: { en: 'Mother or guardian Aadhaar, linked to the bank account for DBT' } },
      { docId: 'bank-passbook', requirement: 'required', note: { en: 'Aadhaar-seeded account with active NPCI mapping' } },
      { docId: 'mobile-number', requirement: 'often-needed', note: { en: 'For OTP while checking status' } },
      { docId: 'student-id', requirement: 'often-needed', note: { en: 'School or junior college admission/roll number' } },
      { docId: 'birth-certificate', requirement: 'optional', note: { en: 'For age verification of the child, if records conflict' } },
    ],
    rules: [
      {
        id: 'state',
        kind: 'state',
        anyOf: ['AP'],
        required: true,
        explain: { en: 'This scheme is only for families living in Andhra Pradesh.' },
      },
      {
        id: 'manual-school-enrollment',
        kind: 'manual-verify',
        officialUrl: 'https://bm-sgsw.ap.gov.in/BM/Applnstatus',
        required: true,
        explain: { en: 'Your child must be enrolled in a recognized school or junior college in Andhra Pradesh — the school and secretariat verify this list.' },
      },
      {
        id: 'attr-govt-employee',
        kind: 'attribute',
        key: 'govt-employee',
        op: 'is-false',
        required: false,
        explain: { en: 'Children of government employees are reported to be excluded — verify the current exclusion list before applying.' },
      },
      {
        id: 'attr-income-tax-payer',
        kind: 'attribute',
        key: 'income-tax-payer',
        op: 'is-false',
        required: false,
        explain: { en: 'Income-tax paying households are reported to be excluded under the current criteria.' },
      },
    ],
    lastVerified: '2026-10-15',
    verification: 'verified',
    verificationNote: {
      en: 'Amount and ₹2,000 deduction confirmed from the text of G.O.Ms.No.16 dated 16-07-2026 (read via a third-party copy of the GO), and the official Beneficiary Management portal lists Thalliki Vandanam for 2026-27.',
    },
    knownUncertainty: {
      en: 'Reports differ on how the ₹2,000 deducted at source is split between school sanitation and maintenance works, and exclusion criteria differ between the 2025-26 and 2026-27 guidelines — confirm at your secretariat.',
    },
    publication: 'published',
  },
  {
    id: 'ap-post-matric-scholarship',
    name: { en: 'Post Matric Scholarship (AP)', te: 'పోస్ట్ మాట్రిక్ స్కాలర్‌షిప్ (ఆపీ)' },
    fullName: {
      en: 'Post Matric Scholarship – Fee Reimbursement (RTF) and Maintenance Fee (MTF), Andhra Pradesh',
      te: 'పోస్ట్ మాట్రిక్ స్కాలర్‌షిప్ – ఫీజు రీయింబర్స్‌మెంట్ (RTF) & మెయింటెనెన్స్ ఫీజు (MTF), ఆంధ్రప్రదేశ్',
    },
    department: { en: 'Social Welfare Department, Government of Andhra Pradesh' },
    level: 'state',
    state: 'AP',
    categories: ['education'],
    beneficiaries: {
      en: 'Eligible post-matric students (after Class 10) from Andhra Pradesh, mainly SC/ST/BC/Minority and economically weaker students',
    },
    summary: {
      en: 'Full fee reimbursement (RTF) and maintenance fee help (MTF) for eligible post-matric students in Andhra Pradesh.',
      te: 'ఆంధ్రప్రదేశ్‌లో అర్హులైన పోస్ట్ మాట్రిక్ విద్యార్థులకు పూర్తి ఫీజు రీయింబర్స్‌మెంట్ (RTF) మరియు మెయింటెనెన్స్ ఫీజు (MTF) సహాయం.',
    },
    eligibilityText: {
      en: 'Students studying at post-matric level (intermediate, ITI, polytechnic, degree, PG and above) in Andhra Pradesh with annual family income up to ₹2.5 lakh and land holding within the notified limits (up to 10 acres wet / 25 acres dry / 25 acres both, as per district social welfare notifications). Priority categories are SC, ST, BC and Minority students; other categories should confirm course-wise eligibility with the welfare department.',
    },
    benefits: {
      en: 'RTF means complete reimbursement of tuition and special fees for eligible students. MTF (maintenance fee) assistance is ₹10,000 per year for ITI students, ₹15,000 per year for polytechnic students and ₹20,000 per year for degree and above students, as notified by the district Social Welfare Department.',
    },
    benefitsVerified: true,
    application: {
      en: 'Apply through the Jnana Bhumi portal or your college after admission, with caste, income and other certificates. The college verifies and forwards the application to the department, and assistance is paid by DBT.',
    },
    officialUrl: 'https://jnanabhumi.ap.gov.in/',
    otherUrls: [
      {
        label: 'Tirupati district Social Welfare – scholarship schemes',
        url: 'https://tirupati.ap.gov.in/social-welfare',
      },
    ],
    documents: [
      { docId: 'aadhaar', requirement: 'required' },
      { docId: 'caste-certificate', requirement: 'required', note: { en: 'For SC/ST/BC/Minority category applicants' } },
      { docId: 'income-certificate', requirement: 'required', note: { en: 'Family annual income proof, usually not older than one year' } },
      { docId: 'bank-passbook', requirement: 'required' },
      { docId: 'marksheet', requirement: 'often-needed', note: { en: 'Previous qualifying examination marks memo' } },
      { docId: 'student-id', requirement: 'often-needed' },
      { docId: 'domicile-residence', requirement: 'optional' },
    ],
    rules: [
      {
        id: 'state',
        kind: 'state',
        anyOf: ['AP'],
        required: true,
        explain: { en: 'This scholarship record is for students of Andhra Pradesh.' },
      },
      {
        id: 'education',
        kind: 'education',
        student: true,
        required: true,
        explain: { en: 'Only students studying at post-matric level (after Class 10) can receive this support.' },
      },
      {
        id: 'income',
        kind: 'income',
        maxAnnual: 250000,
        required: true,
        explain: { en: 'Family annual income must be up to ₹2.5 lakh as per the notified eligibility.' },
      },
      {
        id: 'social-category',
        kind: 'social-category',
        anyOf: ['sc', 'st', 'obc', 'minority'],
        required: false,
        explain: { en: 'SC, ST, BC and Minority students are the primary beneficiaries — students of other categories should confirm eligibility for their course.' },
      },
    ],
    lastVerified: '2026-10-15',
    verification: 'verified',
    verificationNote: {
      en: 'RTF and MTF amounts (₹10,000 / ₹15,000 / ₹20,000) and income criteria read from the Tirupati district Social Welfare Department page updated in March 2026.',
    },
    knownUncertainty: {
      en: 'The Jnana Bhumi portal is a JavaScript application that only returned its page title from this environment, and MTF slabs change by course and year — confirm the current slab list on the portal or with your college.',
    },
    publication: 'published',
  },
  {
    id: 'ap-annadata-sukhibhava',
    name: { en: 'Annadata Sukhibhava', te: 'అన్నదాత సుఖీభవ' },
    fullName: {
      en: 'Annadata Sukhibhava – Agriculture Investment Support Scheme',
      te: 'అన్నదాత సుఖీభవ – వ్యవసాయ పెట్టుబడి సహాయ పథకం',
    },
    department: { en: 'Agriculture Department, Government of Andhra Pradesh' },
    level: 'state',
    state: 'AP',
    categories: ['agriculture'],
    beneficiaries: {
      en: 'Land-owning farmer families cultivating land in Andhra Pradesh',
    },
    summary: {
      en: '₹20,000 per acre per year to farmer families in Andhra Pradesh — ₹14,000 from the State and ₹6,000 from PM-KISAN.',
      te: 'ఆంధ్రప్రదేశ్ రైతు కుటుంబాలకు ఎకరానికి సంవత్సరానికి రూ.20,000 (రాష్ట్ర ప్రభుత్వం రూ.14,000 + పీఎం-కిసాన్ రూ.6,000) పెట్టుబడి సహాయం.',
    },
    eligibilityText: {
      en: 'Farmers with cultivable land in Andhra Pradesh. The state share of ₹14,000 per acre per year is credited under Annadata Sukhibhava and the central ₹6,000 per acre per year comes through PM-KISAN. Institutional landholders, serving government employees, income-tax payers and similar categories are excluded from the central share — confirm the current exclusion list.',
    },
    benefits: {
      en: '₹20,000 per acre per year in total: ₹14,000 per acre from the Government of Andhra Pradesh (launched from 02-08-2025 as Annadata Sukhibhava, earlier YSR Rythu Bharosa) plus ₹6,000 per acre from PM-KISAN, paid directly into the farmer bank account.',
    },
    benefitsVerified: true,
    application: {
      en: 'No separate application is usually needed for land-owning farmers — land records are matched with the beneficiary list by the village secretariat. Get your pattadar land record, Aadhaar and bank account seeded, and check status at the Grama/Ward Secretariat or on the scheme portal.',
    },
    officialUrl: 'https://annadathasukhibhava.ap.gov.in/index.html',
    documents: [
      { docId: 'land-records', requirement: 'required', note: { en: 'Pattadar passbook or land record for the cultivable land' } },
      { docId: 'aadhaar', requirement: 'required' },
      { docId: 'bank-passbook', requirement: 'required', note: { en: 'Account for DBT credit of the investment support' } },
      { docId: 'ration-card', requirement: 'often-needed' },
      { docId: 'mobile-number', requirement: 'optional' },
    ],
    rules: [
      {
        id: 'state',
        kind: 'state',
        anyOf: ['AP'],
        required: true,
        explain: { en: 'This scheme is only for farmers of Andhra Pradesh.' },
      },
      {
        id: 'occupation',
        kind: 'occupation',
        anyOf: ['farmer-owner'],
        required: false,
        explain: { en: 'Land-owning farmers are the primary beneficiaries; tenant cultivators may receive only the central PM-KISAN share — verify with your village office.' },
      },
      {
        id: 'attr-govt-employee',
        kind: 'attribute',
        key: 'govt-employee',
        op: 'is-false',
        required: false,
        explain: { en: 'Government employees and some other categories are excluded from the central PM-KISAN share.' },
      },
      {
        id: 'manual-land-record',
        kind: 'manual-verify',
        officialUrl: 'https://annadathasukhibhava.ap.gov.in/index.html',
        required: false,
        explain: { en: 'Eligibility is matched against your pattadar land record by the village secretariat — confirm your record and DBT seeding there.' },
      },
    ],
    lastVerified: '2026-10-15',
    verification: 'verified',
    verificationNote: {
      en: 'Launch date, ₹14,000 state share and ₹6,000 PM-KISAN share confirmed from the official portal and PIB press release (PRID 2318899) read during this session.',
    },
    knownUncertainty: {
      en: 'The scheme was earlier branded YSR Rythu Bharosa; some district pages and older documents still use the old name or older amounts.',
    },
    publication: 'published',
  },
  {
    id: 'ap-ntr-bharosa-pension',
    name: { en: 'NTR Bharosa Pension', te: 'ఎన్టీఆర్ భరోసా పెన్షన్' },
    fullName: {
      en: 'NTR Bharosa – Social Security Pensions (formerly YSR Pension Kanuka)',
      te: 'ఎన్టీఆర్ భరోసా – సామాజిక భరోసా పెన్షన్లు (గతంలో వైఎస్సార్ పెన్షన్ కనుక)',
    },
    department: { en: 'Social Welfare Department, Government of Andhra Pradesh' },
    level: 'state',
    state: 'AP',
    categories: ['social-security'],
    beneficiaries: {
      en: 'Old age, widow, single women, disabled persons, weavers, toddy tappers, fishermen, ART patients, cobbler, transgender persons, dappu artists and other notified vulnerable categories in Andhra Pradesh',
    },
    summary: {
      en: 'Monthly pensions in Andhra Pradesh from ₹4,000 to ₹15,000 depending on the category, renamed from YSR Pension Kanuka to NTR Bharosa.',
      te: 'వృద్ధులు, విధవలు, వికలాంగులు తదితర వర్గాలకు ఆంధ్రప్రదేశ్‌లో నెలవారీ పెన్షన్ (రూ.4,000 నుండి రూ.15,000 వరకు).',
    },
    eligibilityText: {
      en: 'Applicants must belong to one of the notified pension categories (old age, widow, single woman, disability, chronic disease, weaver, toddy tapper, fisherman, ART/HIV, cobbler, transgender, dappu artist and similar) and meet the category-specific age and income conditions verified by the Grama/Ward Secretariat. Existing pensioners continue in their category.',
    },
    benefits: {
      en: '₹4,000 per month for old age, widow, single women, weavers, toddy tappers, fishermen, ART (HIV) patients, cobbler, transgender persons and dappu artists; ₹6,000 for persons with disability and leprosy/multiple deformity; ₹10,000 for fully disabled persons and those with chronic diseases (kidney, heart or liver failure, CKDU, sickle cell, thalassemia, haemophilia); ₹15,000 for paralysis, muscular dystrophy and accident victims — as per G.O.Ms.No.43 dated 13-06-2024.',
    },
    benefitsVerified: true,
    application: {
      en: 'Apply at your Grama/Ward Secretariat through the volunteer or social welfare assistant, with Aadhaar, bank passbook and category proof (age, disability or medical certificate where applicable). Pensions are credited monthly by DBT.',
    },
    officialUrl: 'https://sspensions.ap.gov.in/',
    documents: [
      { docId: 'aadhaar', requirement: 'required' },
      { docId: 'bank-passbook', requirement: 'required' },
      { docId: 'age-proof', requirement: 'often-needed', note: { en: 'For old age pension claim' } },
      { docId: 'disability-certificate', requirement: 'optional', note: { en: 'For disability pension categories, with SADAREM/medical certification' } },
      { docId: 'death-certificate', requirement: 'optional', note: { en: 'For widow pension, of the late husband' } },
      { docId: 'passport-photo', requirement: 'often-needed' },
    ],
    rules: [
      {
        id: 'state',
        kind: 'state',
        anyOf: ['AP'],
        required: true,
        explain: { en: 'This pension scheme is only for residents of Andhra Pradesh.' },
      },
      {
        id: 'attr-disability-certificate',
        kind: 'attribute',
        key: 'disability-certificate',
        op: 'is-true',
        required: false,
        explain: { en: 'A disability certificate can qualify you for the higher disability pension categories (₹6,000 to ₹15,000 per month).' },
      },
      {
        id: 'attr-unorganised-worker',
        kind: 'attribute',
        key: 'unorganised-worker',
        op: 'is-true',
        required: false,
        explain: { en: 'Unorganised workers such as weavers, beedi workers and toddy tappers have dedicated pension categories.' },
      },
      {
        id: 'manual-category-check',
        kind: 'manual-verify',
        officialUrl: 'https://sspensions.ap.gov.in/',
        required: false,
        explain: { en: 'Your pension category, age condition and family card are verified by the village or ward secretariat before sanction.' },
      },
    ],
    lastVerified: '2026-10-15',
    verification: 'verified',
    verificationNote: {
      en: 'Scheme name and slabs confirmed from the official social security pensions portal and G.O.Ms.No.43 dated 13-06-2024 read during this session.',
    },
    knownUncertainty: {
      en: 'Renamed from YSR Pension Kanuka in June 2024. Category lists, age thresholds and slabs are revised periodically — confirm the current category list before applying.',
    },
    publication: 'published',
  },
  {
    id: 'ap-ntr-vaidya-seva',
    name: { en: 'Dr. NTR Vaidya Seva', te: 'డా. ఎన్టీఆర్ వైద్య సేవ' },
    fullName: {
      en: 'Dr. NTR Vaidya Seva – Cashless Health Assurance (formerly Aarogyasri)',
      te: 'డా. ఎన్టీఆర్ వైద్య సేవ – నగదు రహిత ఆరోగ్య బీమా (గతంలో ఆరోగ్యశ్రీ)',
    },
    department: { en: 'Health, Medical and Family Welfare Department, Government of Andhra Pradesh' },
    level: 'state',
    state: 'AP',
    categories: ['social-security'],
    beneficiaries: {
      en: 'White ration card (BPL) families in Andhra Pradesh, with EHS, WJHS and PM-JAY package coverage for other eligible groups',
    },
    summary: {
      en: 'Cashless tertiary healthcare cover of up to ₹5 lakh per family per year for white ration card (BPL) families in Andhra Pradesh.',
      te: 'తెల్లరేషన్ కార్డు (బీపీఎల్) కుటుంబాలకు ఆంధ్రప్రదేశ్‌లో సంవత్సరానికి రూ.5 లక్షల వరకు ఉచిత, నగదు రహిత ఆరోగ్య చికిత్స.',
    },
    eligibilityText: {
      en: 'Families holding a white ration card (BPL) in Andhra Pradesh are covered under the Dr. NTR Vaidya Seva Trust scheme. Treatment must be for a listed procedure at a government hospital or empanelled network hospital after referral by a government doctor. EHS, WJHS and PM-JAY beneficiaries get coverage under the respective package rules.',
    },
    benefits: {
      en: 'Up to ₹5 lakh per family per year as a floater for listed secondary and tertiary care procedures (3,257 procedures are listed on the trust portal), cashless at government and empanelled network hospitals, with transport and daily allowance benefits as per the guidelines.',
    },
    benefitsVerified: true,
    application: {
      en: 'No pre-enrolment is needed for white ration card families. Take the white ration card, Aadhaar and referral to a government hospital (CCH/field hospital), where the treating doctor refers you to a network hospital for cashless treatment.',
    },
    officialUrl: 'https://drntrvaidyaseva.ap.gov.in/web/guest/asri',
    documents: [
      { docId: 'ration-card', requirement: 'required', note: { en: 'White ration card (BPL) as primary eligibility proof' } },
      { docId: 'aadhaar', requirement: 'required' },
      { docId: 'bank-passbook', requirement: 'often-needed' },
      { docId: 'mobile-number', requirement: 'optional' },
    ],
    rules: [
      {
        id: 'state',
        kind: 'state',
        anyOf: ['AP'],
        required: true,
        explain: { en: 'This health scheme is for residents of Andhra Pradesh.' },
      },
      {
        id: 'manual-white-ration-card',
        kind: 'manual-verify',
        officialUrl: 'https://drntrvaidyaseva.ap.gov.in/web/guest/asri',
        required: true,
        explain: { en: 'Cashless treatment under this scheme requires a white ration card (BPL) or an enrolled EHS/WJHS/PM-JAY family — check your card status at the secretariat.' },
      },
      {
        id: 'manual-referral',
        kind: 'manual-verify',
        officialUrl: 'https://drntrvaidyaseva.ap.gov.in/web/guest/asri',
        required: false,
        explain: { en: 'The procedure must be listed and referred by a government doctor — confirm the procedure and empanelled hospital with the trust helpline.' },
      },
    ],
    lastVerified: '2026-10-15',
    verification: 'verified',
    verificationNote: {
      en: '₹5 lakh floater cover, 3,257 listed procedures and 129.44 lakh covered white ration card families confirmed from the official trust portal during this session.',
    },
    knownUncertainty: {
      en: 'In September 2025 the Chief Minister announced a universal health insurance of ₹2.5 lakh for all residents and cover up to ₹25 lakh for poor families under NTR Vaidya Seva, while the portal still shows ₹5 lakh — confirm the current cover before relying on this record.',
    },
    publication: 'published',
  },
  {
    id: 'ap-pedalandariki-illu',
    name: { en: 'Pedalandariki Illu', te: 'పేదలందరికీ ఇల్లు' },
    fullName: {
      en: 'Navaratnalu – Pedalandariki Illu (Housing for All)',
      te: 'నవరత్నాలు – పేదలందరికీ ఇల్లు',
    },
    department: { en: 'Revenue and Housing Departments, Government of Andhra Pradesh' },
    level: 'state',
    state: 'AP',
    categories: ['housing-services'],
    beneficiaries: {
      en: 'Houseless and poor families in Andhra Pradesh, with the house site patta registered in the name of the woman of the family',
    },
    summary: {
      en: 'Free house site pattas in the woman name and staged financial assistance to build a pucca house for eligible poor families in Andhra Pradesh.',
      te: 'అర్హులైన పేద కుటుంబాలకు మహిళా పేరుపై ఉచిత ఇంటి స్థలం (పట్టా) మరియు ఇంటి నిర్మాణానికి దశలవారీ ఆర్థిక సహాయం.',
    },
    eligibilityText: {
      en: 'Houseless families and families without a pucca house in Andhra Pradesh, identified through the village and ward secretariat surveys. The house site patta is registered in the name of the woman of the family, and construction must start within the time limit fixed by the department. Families that already own a pucca house are not eligible.',
    },
    benefits: {
      en: 'A free registered residential house site patta in the name of the woman of the family, plus stage-wise financial assistance for constructing a pucca house. The cash assistance is dovetailed with central PMAY components (₹1.5 lakh reported for earlier PMAY phases and up to ₹2.39 lakh reported under PMAY-G 2.0) — confirm the current amount at the Housing Corporation or secretariat.',
    },
    benefitsVerified: false,
    application: {
      en: 'Enrol through your Village or Ward Volunteer household survey, or apply at the local secretariat/Housing Corporation office with Aadhaar, income and ration card documents. Application status can be checked on the Housing portal or UMANG.',
    },
    officialUrl: 'https://housing.ap.gov.in/',
    otherUrls: [
      {
        label: 'Pedalandariki Illu on UMANG (Government of India)',
        url: 'https://web.umang.gov.in/landing/scheme/detail/pedalandariki-illu_pi.html',
      },
    ],
    documents: [
      { docId: 'aadhaar', requirement: 'required' },
      { docId: 'bank-passbook', requirement: 'required' },
      { docId: 'income-certificate', requirement: 'often-needed' },
      { docId: 'ration-card', requirement: 'often-needed' },
      { docId: 'property-or-pucca-house-proof', requirement: 'often-needed', note: { en: 'Proof that the family does not own a pucca house' } },
      { docId: 'passport-photo', requirement: 'often-needed' },
    ],
    rules: [
      {
        id: 'state',
        kind: 'state',
        anyOf: ['AP'],
        required: true,
        explain: { en: 'This housing scheme is only for families of Andhra Pradesh.' },
      },
      {
        id: 'attr-no-pucca-house',
        kind: 'attribute',
        key: 'has-pucca-house',
        op: 'is-false',
        required: true,
        explain: { en: 'Families that already own a permanent pucca house are not eligible for this scheme.' },
      },
      {
        id: 'gender',
        kind: 'gender',
        anyOf: ['female'],
        required: false,
        explain: { en: 'The house site patta must be registered in the name of the woman of the family.' },
      },
      {
        id: 'manual-survey',
        kind: 'manual-verify',
        officialUrl: 'https://housing.ap.gov.in/',
        required: false,
        explain: { en: 'Houseless status and beneficiary listing are verified through the village or ward secretariat survey — confirm your name in the list there.' },
      },
    ],
    lastVerified: '2026-10-15',
    verification: 'needs-reverification',
    verificationNote: {
      en: 'The housing.ap.gov.in portal is a JavaScript application that only returned its page title from this environment, so the cash amount could not be confirmed from a primary source. Scheme name and active patta distribution confirmed through official district notices (Palnadu district) and the UMANG listing.',
    },
    knownUncertainty: {
      en: 'Branding is mixed: official district notices still say Navaratnalu – Pedalandariki Illu while the portal says Housing for All (NTR Housing), and reported cash assistance differs by PMAY component (₹1.5 lakh to ₹2.39 lakh). 25 lakh site pattas were announced under Pedalandariki Illu with 50 lakh homes targeted by 2029.',
    },
    publication: 'published',
  },
  {
    id: 'ap-ambedkar-overseas-vidya-nidhi',
    name: { en: 'Ambedkar Overseas Vidya Nidhi (AP)', te: 'అంబేద్కర్ ఓవర్సీస్ విద్యా నిధి (ఆపీ)' },
    fullName: {
      en: 'Ambedkar Overseas Vidya Nidhi – Scholarship for Higher Studies Abroad (Andhra Pradesh)',
      te: 'అంబేద్కర్ ఓవర్సీస్ విద్యా నిధి – విదేశాల్లో ఉన్నత చదువులు (ఆంధ్రప్రదేశ్)',
    },
    department: { en: 'Welfare Departments (SC/ST/BC/Minority), Government of Andhra Pradesh' },
    level: 'state',
    state: 'AP',
    categories: ['education'],
    beneficiaries: {
      en: 'Eligible students from Andhra Pradesh (SC/ST/BC/Minority and notified categories such as EBC and Kapu) admitted to higher studies abroad',
    },
    summary: {
      en: 'Financial support for eligible Andhra Pradesh students to pursue postgraduate and professional studies at universities abroad.',
      te: 'అర్హులైన ఆంధ్రప్రదేశ్ విద్యార్థులకు విదేశాల్లో ఉన్నత చదువుల కోసం ఆర్థిక సహాయం.',
    },
    eligibilityText: {
      en: 'Andhra Pradesh native students admitted to approved universities abroad for higher studies, generally up to 35 years of age, with family income up to ₹8 lakh per year and at least 60% marks in the qualifying examination. Only one child per family can receive this assistance, and the applicant should not have received a similar foreign scholarship earlier. Confirm the current course, country and category rules with the welfare department.',
    },
    benefits: {
      en: 'A one-time post-admission grant towards tuition and living expenses for higher studies abroad, as per the current departmental guidelines. The AP grant amount was not confirmed from a primary source this session.',
    },
    benefitsVerified: false,
    application: {
      en: 'Apply to the concerned welfare department through the notified application window after securing admission, with income, caste, marks and admission documents. Sanctioned students receive the grant as per the current GO guidelines.',
    },
    officialUrl: 'https://tirupati.ap.gov.in/social-welfare',
    documents: [
      { docId: 'aadhaar', requirement: 'required' },
      { docId: 'income-certificate', requirement: 'required' },
      { docId: 'caste-certificate', requirement: 'often-needed', note: { en: 'For SC/ST/BC/Minority category applicants' } },
      { docId: 'marksheet', requirement: 'required', note: { en: 'Qualifying examination marks with the required percentage' } },
      { docId: 'domicile-residence', requirement: 'often-needed' },
      { docId: 'passport-photo', requirement: 'often-needed' },
      { docId: 'bank-passbook', requirement: 'often-needed' },
    ],
    rules: [
      {
        id: 'state',
        kind: 'state',
        anyOf: ['AP'],
        required: true,
        explain: { en: 'This scholarship is for students native to Andhra Pradesh.' },
      },
      {
        id: 'age',
        kind: 'age',
        max: 35,
        required: true,
        explain: { en: 'Applicants are generally expected to be up to 35 years of age as per the notified criteria.' },
      },
      {
        id: 'income',
        kind: 'income',
        maxAnnual: 800000,
        required: true,
        explain: { en: 'Family annual income must be up to ₹8 lakh as per the district Social Welfare notification.' },
      },
      {
        id: 'education',
        kind: 'education',
        min: 'graduate',
        required: true,
        explain: { en: 'Applicants should have completed graduation with the required percentage before applying for courses abroad.' },
      },
      {
        id: 'social-category',
        kind: 'social-category',
        anyOf: ['sc', 'st', 'obc', 'minority'],
        required: false,
        explain: { en: 'SC, ST, BC and Minority students are the main applicants; EBC and Kapu categories are also covered as per district notifications — confirm your category.' },
      },
    ],
    lastVerified: '2026-10-15',
    verification: 'needs-reverification',
    verificationNote: {
      en: 'Eligibility (age up to 35, income up to ₹8 lakh, 60% marks, one per family) read from the Tirupati district Social Welfare page updated in March 2026. The grant amount and the current application window were not confirmed from a primary source this session.',
    },
    knownUncertainty: {
      en: 'The Telangana version of this scheme pays up to ₹20 lakh, but the AP amount could not be confirmed and must not be assumed. Course lists, country lists and deadlines change every cycle — verify with the welfare department.',
    },
    publication: 'published',
  },
  {
    id: 'ap-chandranna-bima',
    name: { en: 'Chandranna Bima', te: 'చంద్రన్న బీమా' },
    fullName: {
      en: 'Chandranna Bima – Life and Accident Insurance for BPL Breadwinners',
      te: 'చంద్రన్న బీమా – బీపీఎల్ కుటుంబ ప్రధాన సంపాదకుల జీవన బీమా',
    },
    department: { en: 'Swarna Gramam and Swarna Wardu (SGSW) Department, Government of Andhra Pradesh' },
    level: 'state',
    state: 'AP',
    categories: ['social-security'],
    beneficiaries: {
      en: 'Primary breadwinners aged 18 to 70 years from BPL families in Andhra Pradesh (1.23 crore beneficiaries listed)',
    },
    summary: {
      en: 'Insurance for BPL primary breadwinners in Andhra Pradesh: ₹1 lakh on natural death and up to ₹5 lakh on accidental death or disability.',
      te: 'బీపీఎల్ కుటుంబాల ప్రధాన సంపాదకులకు సహజ మరణానికి రూ.1 లక్ష, ప్రమాద మరణం లేదా పూర్తి వైకల్యానికి రూ.5 లక్షల బీమా సాయం.',
    },
    eligibilityText: {
      en: 'The primary breadwinner of a BPL family in Andhra Pradesh, aged 18 to 70 years. Natural death relief applies only up to age 50, while accidental death and disability cover applies up to age 70. The family must hold BPL status (white ration card) and be listed through the secretariat/Bimamitra network.',
    },
    benefits: {
      en: 'Natural death (age 18–50): ₹1 lakh relief directly from the Government. Accidental death (age 18–70): ₹5 lakh. Full disability (age 18–70): ₹5 lakh. Partial disability (age 18–70): up to ₹2.5 lakh. The entire premium is borne by the Government for BPL families, and claims are processed through the Bimamitra network.',
    },
    benefitsVerified: true,
    application: {
      en: 'Enrolment is done through the Grama/Ward Secretariat and Bimamitra volunteers using your ration card, Aadhaar and bank details. In the event of death or disability, the nominee files the claim through the Bimamitra with the death or medical certificate.',
    },
    officialUrl: 'https://chandrannabima.ap.gov.in/new/Default.aspx',
    otherUrls: [
      {
        label: 'Chandranna Bima claims dashboard',
        url: 'https://bima.ap.gov.in/Default.aspx',
      },
    ],
    documents: [
      { docId: 'ration-card', requirement: 'required', note: { en: 'BPL (white ration card) status proof' } },
      { docId: 'aadhaar', requirement: 'required' },
      { docId: 'bank-passbook', requirement: 'required' },
      { docId: 'age-proof', requirement: 'often-needed' },
      { docId: 'death-certificate', requirement: 'optional', note: { en: 'Needed by the nominee at the time of a claim' } },
      { docId: 'mobile-number', requirement: 'optional' },
    ],
    rules: [
      {
        id: 'state',
        kind: 'state',
        anyOf: ['AP'],
        required: true,
        explain: { en: 'This scheme is only for BPL families of Andhra Pradesh.' },
      },
      {
        id: 'age',
        kind: 'age',
        min: 18,
        max: 70,
        required: true,
        explain: { en: 'Only primary breadwinners aged 18 to 70 are covered — natural death relief applies up to age 50.' },
      },
      {
        id: 'manual-bpl-status',
        kind: 'manual-verify',
        officialUrl: 'https://chandrannabima.ap.gov.in/new/Default.aspx',
        required: true,
        explain: { en: 'Only BPL families are covered — your white ration card and listing are verified by the Bimamitra at the secretariat.' },
      },
    ],
    lastVerified: '2026-10-15',
    verification: 'verified',
    verificationNote: {
      en: 'Cover amounts and age bands read directly from the official Chandranna Bima portal (SGSW Department) during this session; the claims dashboard was also checked.',
    },
    knownUncertainty: {
      en: 'Older branding YSR BIMA still appears on some government pages (bima.ap.gov.in About page), while the current portal uses Chandranna Bima.',
    },
    publication: 'published',
  },
  {
    id: 'tg-rythu-bharosa',
    name: { en: 'Rythu Bharosa', te: 'రైతు భరోసా' },
    fullName: {
      en: 'Rythu Bharosa – Agriculture Investment Support Scheme, Telangana',
      te: 'రైతు భరోసా – వ్యవసాయ పెట్టుబడి సహాయ పథకం, తెలంగాణ',
    },
    department: { en: 'Agriculture Department, Government of Telangana' },
    level: 'state',
    state: 'TG',
    categories: ['agriculture'],
    beneficiaries: {
      en: 'Registered farmer families (pattadars) cultivating land in Telangana',
    },
    summary: {
      en: '₹12,000 per acre per year to farmer families in Telangana as investment support at the start of Kharif and Rabi seasons.',
      te: 'తెలంగాణ రైతు కుటుంబాలకు ఎకరానికి సంవత్సరానికి రూ.12,000 (ఖరీఫ్, రబీ సీజన్లకు చొప్పున రూ.6,000) పెట్టుబడి సహాయం.',
    },
    eligibilityText: {
      en: 'Farmers with cultivable land recorded in the state land database in Telangana. The support is paid per acre, per season, directly to the bank account linked to the pattadar passbook. Lands used for mining, real estate or industrial purposes, institutional landholders and other notified exclusions are not covered.',
    },
    benefits: {
      en: '₹6,000 per acre per season — ₹12,000 per acre per year for both Kharif and Rabi seasons — paid by Direct Benefit Transfer into the registered bank account at the start of each season (Rs 18,000 crore was budgeted for Rythu Bharosa in 2025-26).',
    },
    benefitsVerified: true,
    application: {
      en: 'No separate application is needed for land-owning farmers — land records are matched automatically. Ensure your pattadar record, Aadhaar and bank account are linked, and verify the seasonal credit at the village rythu bharosa meeting or agriculture office.',
    },
    officialUrl: 'https://rythubharosa.telangana.gov.in/',
    otherUrls: [
      {
        label: 'Rythu Bharosa – Suryapet district information',
        url: 'https://suryapet.telangana.gov.in/scheme/rythu-bharosa',
      },
    ],
    documents: [
      { docId: 'land-records', requirement: 'required', note: { en: 'Pattadar passbook or land record' } },
      { docId: 'aadhaar', requirement: 'required' },
      { docId: 'bank-passbook', requirement: 'required', note: { en: 'Account linked for DBT of the seasonal instalment' } },
      { docId: 'mobile-number', requirement: 'optional' },
    ],
    rules: [
      {
        id: 'state',
        kind: 'state',
        anyOf: ['TG'],
        required: true,
        explain: { en: 'This scheme is only for farmers of Telangana.' },
      },
      {
        id: 'occupation',
        kind: 'occupation',
        anyOf: ['farmer-owner'],
        required: false,
        explain: { en: 'Registered land-owning farmers (pattadars) receive the investment support; tenant cultivators depend on land-record verification.' },
      },
      {
        id: 'manual-land-record',
        kind: 'manual-verify',
        officialUrl: 'https://rythubharosa.telangana.gov.in/',
        required: false,
        explain: { en: 'Payment is released against your pattadar land record — confirm your record and DBT seeding with the village secretariat.' },
      },
    ],
    lastVerified: '2026-10-15',
    verification: 'verified',
    verificationNote: {
      en: '₹6,000 per acre per season (₹12,000 per year) confirmed from the official Rythu Bharosa portal and the Suryapet district official page during this session.',
    },
    knownUncertainty: {
      en: 'Renamed from Rythu Bandhu after December 2023. Some district pages still show older figures (for example a Narayanpet page shows the old Rs 4,000 per season rate) — trust the current portal rate.',
    },
    publication: 'published',
  },
  {
    id: 'tg-rythu-bima',
    name: { en: 'Rythu Bima', te: 'రైతు బీమా' },
    fullName: {
      en: 'Rythu Bima – Farmers Group Life Insurance Scheme',
      te: 'రైతు బీమా – రైతుల సమూహ జీవన బీమా పథకం',
    },
    department: { en: 'Agriculture Department, Government of Telangana' },
    level: 'state',
    state: 'TG',
    categories: ['agriculture', 'social-security'],
    beneficiaries: {
      en: 'Farmers aged 18 to 59 years enrolled in the Telangana land database',
    },
    summary: {
      en: 'Group life insurance of ₹5 lakh for farmers in Telangana — the Government pays the entire premium to LIC and the amount reaches the nominee within 10 days.',
      te: 'తెలంగాణ రైతులకు ₹5 లక్షల సమూహ జీవన బీమా — ప్రీమియం పూర్తిగా ప్రభుత్వం చెల్లిస్తుంది, మరణం జరిగిన 10 రోజుల్లోగా నామినీకి చెల్లిస్తారు.',
    },
    eligibilityText: {
      en: 'Farmers in the age group of 18 to 59 years whose land records are enrolled in the online farmer-wise land database of Telangana. The entire premium is paid by the State Government, so farmers do not pay anything. The nominee receives the claim without having to visit any office.',
    },
    benefits: {
      en: '₹5 lakh insured amount deposited into the designated nominee account within 10 days of the farmer death (natural or accidental causes included), with 100% of the premium paid by the Government to LIC of India.',
    },
    benefitsVerified: true,
    application: {
      en: 'Enrolment is automatic through the land record database — keep your pattadar record, Aadhaar and nominee bank details updated with the village agriculture officer. After a death, outreach officers collect the record and the claim is settled by RTGS to the nominee.',
    },
    officialUrl: 'https://rythubharosa.telangana.gov.in/Default_Home.aspx',
    otherUrls: [
      {
        label: 'Rythu Bima claim forms',
        url: 'https://www.rythubharosa.telangana.gov.in/Forms.aspx',
      },
    ],
    documents: [
      { docId: 'land-records', requirement: 'required' },
      { docId: 'aadhaar', requirement: 'required' },
      { docId: 'bank-passbook', requirement: 'required', note: { en: 'Nominee account for the claim settlement' } },
      { docId: 'age-proof', requirement: 'often-needed' },
    ],
    rules: [
      {
        id: 'state',
        kind: 'state',
        anyOf: ['TG'],
        required: true,
        explain: { en: 'This insurance scheme is only for farmers of Telangana.' },
      },
      {
        id: 'age',
        kind: 'age',
        min: 18,
        max: 59,
        required: true,
        explain: { en: 'Farmers aged 18 to 59 years alone are eligible for enrolment.' },
      },
      {
        id: 'occupation',
        kind: 'occupation',
        anyOf: ['farmer-owner', 'farmer-tenant', 'agricultural-labourer'],
        required: false,
        explain: { en: 'Farmers, tenant cultivators and agricultural labourers with cultivation records are covered — confirm your entry in the land database.' },
      },
      {
        id: 'manual-enrolment',
        kind: 'manual-verify',
        officialUrl: 'https://rythubharosa.telangana.gov.in/Default_Home.aspx',
        required: false,
        explain: { en: 'Enrolment is based on the online land database — verify your and your nominee details with the village agriculture officer.' },
      },
    ],
    lastVerified: '2026-10-15',
    verification: 'verified',
    verificationNote: {
      en: '₹5 lakh cover, 18–59 age band, 100% government premium and 10-day claim timeline confirmed from the official Rythu Bharosa portal description and Suryapet district page during this session.',
    },
    knownUncertainty: {
      en: 'News reports in October 2026 said the 2026-27 premium had not yet been paid and that a successor Indiramma family life insurance scheme was announced but not launched — confirm the current coverage status before relying on this cover.',
    },
    publication: 'published',
  },
  {
    id: 'tg-indiramma-indlu',
    name: { en: 'Indiramma Indlu', te: 'ఇందిరమ్మ ఇళ్లు' },
    fullName: {
      en: 'Indiramma Indlu – Housing for the Houseless Poor',
      te: 'ఇందిరమ్మ ఇళ్లు – నివాసం లేని పేదలకు ఇళ్లు',
    },
    department: { en: 'Transport, Roads and Buildings Department, Government of Telangana' },
    level: 'state',
    state: 'TG',
    categories: ['housing-services'],
    beneficiaries: {
      en: 'Landless and homeless poor families in Telangana (L1: own small land; L2: no land, no house; L3: own a house — not eligible)',
    },
    summary: {
      en: '₹5 lakh housing assistance (100% subsidy) to landless and homeless families in Telangana, with a free 250 square yard plot for families who own no land.',
      te: 'భూమి, ఇల్లు లేని అర్హ కుటుంబాలకు తెలంగాణలో రూ.5 లక్షల సబ్సిడీ, భూమి లేని వారికి 250 గజాల నివేసి స్థలం.',
    },
    eligibilityText: {
      en: 'Houseless poor families of Telangana identified through the Prajapalana survey. L1 families that own a small plot receive the construction assistance on their own site; L2 families that own neither land nor a house also receive a free 250 square yard residential plot; L3 families that already own a permanent house are not eligible. Sanctions are released in constituency quotas after field verification and Grama Sabha listings.',
    },
    benefits: {
      en: '₹5 lakh per house as 100% subsidy, released in four construction stages (₹1 lakh at basement level, ₹1 lakh at walling/roof level and further payments on progress), plus a free 250 square yard residential plot for landless (L2) beneficiaries.',
    },
    benefitsVerified: true,
    application: {
      en: 'Applications were collected through the Prajapalana survey (Six Guarantees) and are verified field-by-field using the Indiramma Indlu mobile app. Check your application status or raise claims on the Indiramma Indlu portal, or apply through MeeSeva when a demand survey notification is open.',
    },
    officialUrl: 'https://indirammaindlu.telangana.gov.in/',
    otherUrls: [
      {
        label: 'Indiramma Indlu government orders and guidelines',
        url: 'https://indirammaindlu.telangana.gov.in/getPostDynamicData?optionId=4&type=2',
      },
    ],
    documents: [
      { docId: 'aadhaar', requirement: 'required' },
      { docId: 'bank-passbook', requirement: 'required' },
      { docId: 'ration-card', requirement: 'often-needed' },
      { docId: 'property-or-pucca-house-proof', requirement: 'often-needed', note: { en: 'Proof of houseless status (own house absence)' } },
      { docId: 'land-records', requirement: 'optional', note: { en: 'For L1 beneficiaries who own a plot' } },
      { docId: 'passport-photo', requirement: 'often-needed' },
    ],
    rules: [
      {
        id: 'state',
        kind: 'state',
        anyOf: ['TG'],
        required: true,
        explain: { en: 'This housing scheme is only for families of Telangana.' },
      },
      {
        id: 'attr-no-pucca-house',
        kind: 'attribute',
        key: 'has-pucca-house',
        op: 'is-false',
        required: true,
        explain: { en: 'Families that already own a permanent house (L3 category) are not eligible for a new sanction.' },
      },
      {
        id: 'manual-survey',
        kind: 'manual-verify',
        officialUrl: 'https://indirammaindlu.telangana.gov.in/',
        required: false,
        explain: { en: 'Houseless and landless status is verified through the Prajapalana survey, field enquiry and Grama Sabha listing by the secretariat and MPDO.' },
      },
    ],
    lastVerified: '2026-10-15',
    verification: 'verified',
    verificationNote: {
      en: '₹5 lakh 100% subsidy, 250 square yard plot for the landless and the L1/L2/L3 categories confirmed from official district pages (Mahabubnagar, Mulugu, Kamareddy, Suryapet) and the GO list (G.O.Ms.No.7 dated 09-03-2024) on the official portal during this session.',
    },
    knownUncertainty: {
      en: 'Sanctions happen in constituency quotas (about 3,500 houses per constituency in phase 1) after list finalisation, so being eligible does not guarantee an immediate sanction. Flats and housing tower components run under separate demand surveys with their own deadlines.',
    },
    publication: 'published',
  },
  {
    id: 'tg-gruha-jyothi',
    name: { en: 'Gruha Jyothi', te: 'గృహ జ్యోతి' },
    fullName: {
      en: 'Gruha Jyothi – Free Power up to 200 Units per Month',
      te: 'గృహ జ్యోతి – నెలకు 200 యూనిట్ల వరకు ఉచిత విద్యుత్',
    },
    department: { en: 'Energy Department, Government of Telangana' },
    level: 'state',
    state: 'TG',
    categories: ['housing-services'],
    beneficiaries: {
      en: 'Eligible domestic electricity consumers (households) in Telangana',
    },
    summary: {
      en: 'Up to 200 units of electricity free every month for eligible domestic households in Telangana.',
      te: 'తెలంగాణలో అర్హ గృహహస్తులకు నెలకు 200 యూనిట్ల వరకు ఉచిత విద్యుత్.',
    },
    eligibilityText: {
      en: 'Domestic (household) electricity consumers in Telangana are eligible for free units up to the notified cap. Consumers on free electricity supply categories (such as agriculture) and certain other exempted categories are not covered, and some consumer groups are covered up to 100 units — confirm your consumer category with your electricity distribution company.',
    },
    benefits: {
      en: 'Up to 200 units of electricity per month are free for eligible domestic households (from 17-10-2024). Units beyond the free cap are billed at the normal tariff. Application is through the Grama/Ward Sachivalayam or the electricity bill payment office.',
    },
    benefitsVerified: true,
    application: {
      en: 'Apply at your local electricity office, Grama/Ward Sachivalayam or through your DISCOM with the electricity service connection details, Aadhaar and ration card. The subsidy is adjusted in the monthly bill.',
    },
    officialUrl: 'https://mulugu.telangana.gov.in/scheme/gruha-jyothi',
    documents: [
      { docId: 'aadhaar', requirement: 'required' },
      { docId: 'ration-card', requirement: 'often-needed' },
      { docId: 'mobile-number', requirement: 'often-needed', note: { en: 'For bill alerts and any OTP-based updates' } },
      { docId: 'bank-passbook', requirement: 'optional' },
    ],
    rules: [
      {
        id: 'state',
        kind: 'state',
        anyOf: ['TG'],
        required: true,
        explain: { en: 'This power scheme is only for consumers of Telangana.' },
      },
      {
        id: 'manual-consumer-category',
        kind: 'manual-verify',
        officialUrl: 'https://mulugu.telangana.gov.in/scheme/gruha-jyothi',
        required: false,
        explain: { en: 'Free units depend on your meter and consumer category — confirm eligibility with your electricity distribution company or sachivalayam.' },
      },
    ],
    lastVerified: '2026-10-15',
    verification: 'verified',
    verificationNote: {
      en: '200 free units per month and the 17-10-2024 start confirmed from the official Mulugu district Gruha Jyothi page and the Telangana Southern Power Distribution Company page during this session.',
    },
    knownUncertainty: {
      en: 'Named under the Six Guarantees, with implementation details (unit caps, exempted consumer categories) revised after the October 2024 launch — confirm current rules with your DISCOM.',
    },
    publication: 'published',
  },
  {
    id: 'tg-mahalakshmi',
    name: { en: 'Mahalakshmi', te: 'మహాలక్ష్మి' },
    fullName: {
      en: 'Mahalakshmi – Women Welfare Scheme',
      te: 'మహాలక్ష్మి – మహిళా సంక్షేమ పథకం',
    },
    department: { en: 'Transport and Women and Child Welfare Departments, Government of Telangana' },
    level: 'state',
    state: 'TG',
    categories: ['women-family'],
    beneficiaries: {
      en: 'Women in Telangana — free bus travel for women passengers, and eligible women heads of family for the cash and cylinder components',
    },
    summary: {
      en: 'Free bus travel for women in Telangana, plus announced support of ₹2,500 per month and ₹500 LPG cylinders for eligible women heads of family.',
      te: 'తెలంగాణలో మహిళలకు ఉచిత బస్సు ప్రయాణం; అర్హ మహిళా కుటుంబాధిపతులకు నెలకు రూ.2,500 మరియు రూ.500కే ఎల్‌పీజీ సిలిండర్ (ప్రకటించినవి).',
    },
    eligibilityText: {
      en: 'Free bus travel applies to women passengers in TSRTC ordinary buses across Telangana. The ₹2,500 monthly financial support and the ₹500 domestic LPG cylinder components apply to eligible women heads of family identified through the ration card and family head records — confirm whether the cash and cylinder components are currently being implemented in your district.',
    },
    benefits: {
      en: 'Free travel in TSRTC ordinary buses across Telangana (running since 2024). The scheme also promises ₹2,500 per month to eligible women heads of family and a domestic LPG cylinder at ₹500 — news checks reported these two components as not yet implemented, so verify the current status before you rely on them.',
    },
    benefitsVerified: false,
    application: {
      en: 'Free bus travel needs no application — simply board an eligible TSRTC bus. For the cash and cylinder components, eligibility is determined from ration card and family head records by the secretariat; check your status at the Grama/Ward Sachivalayam or on the scheme portal when open.',
    },
    officialUrl: 'https://mahabubnagar.telangana.gov.in/scheme/maha-lakshmi-scheme',
    documents: [
      { docId: 'ration-card', requirement: 'required' },
      { docId: 'aadhaar', requirement: 'required' },
      { docId: 'bank-passbook', requirement: 'often-needed', note: { en: 'For the monthly financial support, if implemented' } },
      { docId: 'mobile-number', requirement: 'optional' },
    ],
    rules: [
      {
        id: 'state',
        kind: 'state',
        anyOf: ['TG'],
        required: true,
        explain: { en: 'This scheme is only for residents of Telangana.' },
      },
      {
        id: 'gender',
        kind: 'gender',
        anyOf: ['female'],
        required: true,
        explain: { en: 'The scheme is for women — free bus travel for women passengers and financial support to women heads of family.' },
      },
      {
        id: 'manual-family-head',
        kind: 'manual-verify',
        officialUrl: 'https://mahabubnagar.telangana.gov.in/scheme/maha-lakshmi-scheme',
        required: false,
        explain: { en: 'For the cash component, the woman must be the head of the family in the ration card record — verify at your secretariat.' },
      },
    ],
    lastVerified: '2026-10-15',
    verification: 'needs-reverification',
    verificationNote: {
      en: 'Free bus travel confirmed from the official Mahabubnagar district scheme page and the Telangana State portal. The ₹2,500 cash and ₹500 cylinder components could not be confirmed from a primary source this session.',
    },
    knownUncertainty: {
      en: 'News reports through March 2025 said the ₹2,500 monthly cash and ₹500 cylinder components were pending implementation while free bus travel was running — the components may have changed since, so confirm current status before use.',
    },
    publication: 'published',
  },
  {
    id: 'tg-post-matric-scholarship',
    name: { en: 'Telangana ePASS Scholarship', te: 'తెలంగాణ ఈ-పాస్ స్కాలర్‌షిప్' },
    fullName: {
      en: 'Telangana ePASS – Post Matric Scholarship (RTF/MTF)',
      te: 'తెలంగాణ ఈ-పాస్ – పోస్ట్ మాట్రిక్ స్కాలర్‌షిప్ (RTF/MTF)',
    },
    department: { en: 'Social Welfare Department, Government of Telangana' },
    level: 'state',
    state: 'TG',
    categories: ['education'],
    beneficiaries: {
      en: 'Post-matric students of Scheduled Castes and other eligible categories (ST, BC, EBC, Minority and PwD under extended DBT orders) in Telangana',
    },
    summary: {
      en: 'Fee reimbursement (RTF) and maintenance fee support (MTF) for post-matric students in Telangana.',
      te: 'తెలంగాణలో పోస్ట్ మాట్రిక్ విద్యార్థులకు ఫీజు రీయింబర్స్‌మెంట్ (RTF) మరియు మెయింటెనెన్స్ సహాయం (MTF).',
    },
    eligibilityText: {
      en: 'Students studying at post-matric level (after Class 10) in Telangana, primarily Scheduled Caste students under the Social Welfare Department, with ST, BC, EBC, Minority and PwD students covered under extended DBT orders (G.O.Ms.No.6 dated 06-09-2024). Family income and course conditions apply as notified each year on the ePASS portal.',
    },
    benefits: {
      en: 'RTF (registration and tuition fee reimbursement) as per the notified fee structure for the course, plus MTF (maintenance fee) assistance paid by DBT. Amounts vary by course and year, so check the current slab list on the ePASS portal.',
    },
    benefitsVerified: false,
    application: {
      en: 'Apply online on the Telangana ePASS portal after college admission, or through your college with caste, income and other certificates. Renewal students should apply each academic year before the notified deadline.',
    },
    officialUrl: 'https://telanganaepass.cgg.gov.in/',
    documents: [
      { docId: 'aadhaar', requirement: 'required' },
      { docId: 'caste-certificate', requirement: 'required', note: { en: 'For SC/ST/BC/Minority category applicants' } },
      { docId: 'income-certificate', requirement: 'required' },
      { docId: 'bank-passbook', requirement: 'required' },
      { docId: 'marksheet', requirement: 'often-needed' },
      { docId: 'student-id', requirement: 'often-needed' },
      { docId: 'domicile-residence', requirement: 'optional' },
    ],
    rules: [
      {
        id: 'state',
        kind: 'state',
        anyOf: ['TG'],
        required: true,
        explain: { en: 'This scholarship is for students of Telangana.' },
      },
      {
        id: 'education',
        kind: 'education',
        student: true,
        required: true,
        explain: { en: 'Only students studying at post-matric level (after Class 10) can apply.' },
      },
      {
        id: 'social-category',
        kind: 'social-category',
        anyOf: ['sc', 'st', 'obc', 'minority'],
        required: false,
        explain: { en: 'Scheduled Caste students are the primary beneficiaries of this Social Welfare scheme; ST, BC, EBC, Minority and PwD students are covered under extended DBT orders — confirm your category on ePASS.' },
      },
      {
        id: 'manual-income-check',
        kind: 'manual-verify',
        officialUrl: 'https://telanganaepass.cgg.gov.in/',
        required: false,
        explain: { en: 'Income limit and fee slabs change every year — confirm the current criteria for your course on the ePASS portal.' },
      },
    ],
    lastVerified: '2026-10-15',
    verification: 'verified',
    verificationNote: {
      en: 'Scheme identity, RTF/MTF structure and the DBT extension order (G.O.Ms.No.6 dated 06-09-2024) confirmed from the official Telangana ePASS portal during this session.',
    },
    knownUncertainty: {
      en: 'No fixed amount is stated because the current course-wise fee and maintenance slabs were not confirmed this session — check the ePASS slab list before quoting any figure.',
    },
    publication: 'published',
  },
  {
    id: 'tg-ambedkar-overseas-vidya-nidhi',
    name: { en: 'Ambedkar Overseas Vidya Nidhi (TG)', te: 'అంబేద్కర్ ఓవర్సీస్ విద్యా నిధి (తెలంగాణ)' },
    fullName: {
      en: 'Ambedkar Overseas Vidya Nidhi – Higher Studies Abroad (Telangana)',
      te: 'అంబేద్కర్ ఓవర్సీస్ విద్యా నిధి – విదేశాల్లో ఉన్నత చదువులు (తెలంగాణ)',
    },
    department: { en: 'Scheduled Castes Development Department, Government of Telangana' },
    level: 'state',
    state: 'TG',
    categories: ['education'],
    beneficiaries: {
      en: 'Scheduled Caste students of Telangana admitted to higher studies abroad (one child per family)',
    },
    summary: {
      en: 'Financial support up to ₹20 lakh for eligible Telangana students to pursue higher studies abroad.',
      te: 'అర్హ తెలంగాణ విద్యార్థులకు విదేశాల్లో ఉన్నత చదువుల కోసం రూ.20 లక్షల వరకు గ్రాంట్.',
    },
    eligibilityText: {
      en: 'Scheduled Caste students of Telangana with family income up to ₹5 lakh per year, admitted to approved universities abroad for postgraduate or professional courses, with at least 60% in the qualifying degree and the required English proficiency or entrance test scores (GRE/GMAT etc. as applicable). Only one child per family can receive this support.',
    },
    benefits: {
      en: 'Grant of up to ₹20 lakh, or the admission letter amount if lower, plus one-way economy class airfare and visa fee, for study in the USA, Canada, Germany, France, UK, Singapore, Japan, South Korea, Australia and New Zealand.',
    },
    benefitsVerified: true,
    application: {
      en: 'Apply on the Telangana ePASS overseas scholarship link during the notified window with income, caste, marks, admission letter and test score documents. Selection is department-based and the grant is released as per the GO.',
    },
    officialUrl: 'https://telanganaepass.cgg.gov.in/OverseasLinks.do',
    documents: [
      { docId: 'aadhaar', requirement: 'required' },
      { docId: 'income-certificate', requirement: 'required' },
      { docId: 'caste-certificate', requirement: 'required' },
      { docId: 'marksheet', requirement: 'required', note: { en: 'Degree marks with at least 60%' } },
      { docId: 'domicile-residence', requirement: 'often-needed' },
      { docId: 'passport-photo', requirement: 'often-needed' },
      { docId: 'bank-passbook', requirement: 'often-needed' },
    ],
    rules: [
      {
        id: 'state',
        kind: 'state',
        anyOf: ['TG'],
        required: true,
        explain: { en: 'This scholarship is for students native to Telangana.' },
      },
      {
        id: 'social-category',
        kind: 'social-category',
        anyOf: ['sc'],
        required: true,
        explain: { en: 'This scheme is reserved for Scheduled Caste students of Telangana.' },
      },
      {
        id: 'income',
        kind: 'income',
        maxAnnual: 500000,
        required: true,
        explain: { en: 'Family annual income must be up to ₹5 lakh as notified on the portal.' },
      },
      {
        id: 'education',
        kind: 'education',
        min: 'graduate',
        required: true,
        explain: { en: 'Applicants must have completed their degree with at least 60% and the required test scores before applying.' },
      },
    ],
    lastVerified: '2026-10-15',
    verification: 'verified',
    verificationNote: {
      en: 'Income limit, ₹20 lakh grant, country list, one-per-family rule and 60% requirement confirmed from the official Telangana ePASS overseas scholarship page during this session.',
    },
    knownUncertainty: {
      en: 'The listed application deadline is 15 October 2026 — confirm whether the window is still open. Country lists, test scores and amounts change each cycle.',
    },
    deadline: {
      en: 'Application deadline listed on the ePASS portal: 15 October 2026 (confirm whether the cycle is still open).',
    },
    publication: 'published',
  },
  {
    id: 'tg-cheyutha',
    name: { en: 'Cheyutha', te: 'చేయూత' },
    fullName: {
      en: 'Cheyutha – Social Security Pensions, Telangana',
      te: 'చేయూత – సామాజిక భరోసా పెన్షన్లు, తెలంగాణ',
    },
    department: { en: 'Society for Elimination of Rural Poverty (SERP), Government of Telangana' },
    level: 'state',
    state: 'TG',
    categories: ['social-security'],
    beneficiaries: {
      en: 'Old age, widow, single women, toddy tappers, beedi workers, weavers, HIV/AIDS and dialysis patients, and persons with disability in Telangana',
    },
    summary: {
      en: 'Monthly social security pensions in Telangana — ₹4,000 for categories like old age, widow and single women, and ₹6,000 for persons with disability.',
      te: 'తెలంగాణలో వృద్ధులు, విధవలు, ఒంటరి మహిళలకు నెలకు రూ.4,000, దివ్యాంగులకు రూ.6,000 సామాజిక భరోసా పెన్షన్.',
    },
    eligibilityText: {
      en: 'Applicants must belong to one of the notified pension categories — old age, widow, single woman, toddy tapper, beedi worker, weaver, HIV/AIDS, dialysis patient, disability (with SADAREM certificate) or other listed groups — and meet the category-specific age and income conditions. Existing pensioners continue in their category; new applicants are verified by the Grama/Ward Sachivalayam.',
    },
    benefits: {
      en: '₹4,000 per month for old age, widow, single women, toddy tappers, beedi workers, weavers, HIV/AIDS and dialysis patients; ₹6,000 per month for persons with disability (Divyang, with SADAREM certificate) — as listed in the Government of Telangana Cheyutha application form (December 2023). ₹14,861 crore was budgeted for Cheyutha in 2025-26.',
    },
    benefitsVerified: true,
    application: {
      en: 'Apply at your Grama/Ward Sachivalayam or gram panchayat/municipal office with Aadhaar, bank passbook and category proof (age, medical or SADAREM certificate where applicable). Current pensioners need not reapply; pensions are credited monthly by DBT.',
    },
    officialUrl: 'https://www.cheyutha.telangana.gov.in/',
    documents: [
      { docId: 'aadhaar', requirement: 'required' },
      { docId: 'bank-passbook', requirement: 'required' },
      { docId: 'age-proof', requirement: 'often-needed', note: { en: 'For old age pension claim' } },
      { docId: 'disability-certificate', requirement: 'optional', note: { en: 'SADAREM or medical certificate for the disability category' } },
      { docId: 'marriage-certificate', requirement: 'optional', note: { en: 'For widow pension where applicable' } },
      { docId: 'passport-photo', requirement: 'often-needed' },
    ],
    rules: [
      {
        id: 'state',
        kind: 'state',
        anyOf: ['TG'],
        required: true,
        explain: { en: 'This pension scheme is only for residents of Telangana.' },
      },
      {
        id: 'attr-disability-certificate',
        kind: 'attribute',
        key: 'disability-certificate',
        op: 'is-true',
        required: false,
        explain: { en: 'A disability (SADAREM) certificate qualifies you for the ₹6,000 monthly disability pension.' },
      },
      {
        id: 'attr-unorganised-worker',
        kind: 'attribute',
        key: 'unorganised-worker',
        op: 'is-true',
        required: false,
        explain: { en: 'Occupations such as beedi work, weaving and toddy tapping have dedicated pension categories under Cheyutha.' },
      },
      {
        id: 'manual-category-check',
        kind: 'manual-verify',
        officialUrl: 'https://www.cheyutha.telangana.gov.in/',
        required: false,
        explain: { en: 'Your pension category, age condition and beneficiary list entry are verified by the sachivalayam or SERP field worker before sanction.' },
      },
    ],
    lastVerified: '2026-10-15',
    verification: 'verified',
    verificationNote: {
      en: '₹4,000 and ₹6,000 slabs confirmed from the Government of Telangana Cheyutha application form (December 2023, hosted on the official s3waas.gov.in storage) and the 2025-26 Telangana Budget in Brief, which lists Cheyutha as a funded Six Guarantees scheme.',
    },
    knownUncertainty: {
      en: 'Cheyutha replaced the Aasara pension brand after December 2023, and category lists and age thresholds are revised periodically (news reports in 2026 mentioned revised pension guidelines). Some sources also bundle ₹10 lakh Rajiv Aarogyasri health cover messaging with Cheyutha — confirm the current category list, amount and health cover before applying.',
    },
    publication: 'published',
  },
]
