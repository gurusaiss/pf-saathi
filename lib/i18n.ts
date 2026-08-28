export type Lang = "en" | "hi";

const DICT: Record<string, string> = {
  // Nav
  Home: "होम",
  "PF Journey": "पीएफ यात्रा",
  Claims: "दावे",
  Contributions: "योगदान",
  Family: "परिवार",
  Ask: "पूछें",
  "Log out": "लॉग आउट",

  // Landing
  "Understand your PF. Find what's wrong. Know what to do next.":
    "अपने पीएफ को समझें। जानें कि क्या गलत है। जानें आगे क्या करना है।",
  "You will know what's yours": "आप जानेंगे कि आपका क्या है",
  "Your claim will not be rejected": "आपका दावा खारिज नहीं होगा",
  "You will know what it costs": "आप जानेंगे इसकी कीमत क्या है",
  "What do you need help with?": "आपको किस चीज़ में मदद चाहिए?",
  "I changed jobs": "मैंने नौकरी बदली",
  "My claim was rejected": "मेरा दावा खारिज हो गया",
  "My contribution is missing": "मेरा योगदान गायब है",
  "Protect my family & nominee": "मेरे परिवार और नामिती की सुरक्षा करें",
  "I don't understand my PF": "मुझे अपना पीएफ समझ नहीं आता",
  "Check my PF profile": "मेरी पीएफ प्रोफ़ाइल जांचें",
  "Log in": "लॉग इन करें",
  "Demo access — click to try instantly": "डेमो एक्सेस — तुरंत आज़माने के लिए क्लिक करें",

  // Dashboard
  "Here's your PF at a glance.": "यह रहा आपका पीएफ एक नज़र में।",
  "Total visible balance across all accounts": "सभी खातों में कुल दिखने वाला बैलेंस",
  "PF Health": "पीएफ स्वास्थ्य",
  "Action Center": "एक्शन सेंटर",
  "Money Map": "मनी मैप",
  "Service history": "सेवा इतिहास",
  Employers: "नियोक्ता",
  "Stranded balance": "फंसा हुआ बैलेंस",

  // Claim Pre-Flight
  "Claim Pre-Flight Check": "दावा पूर्व-जांच",
  "You're ready to file.": "आप दाखिल करने के लिए तैयार हैं।",
  "Not ready to file yet.": "अभी दाखिल करने के लिए तैयार नहीं।",
};

export function t(lang: Lang, key: string): string {
  if (lang === "en") return key;
  return DICT[key] ?? key;
}
