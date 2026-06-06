export interface HelpSection {
  steps: string[];
  tips: string[];
  faqs: { question: string; answer: string }[];
}

export const toolHelpData: Record<string, HelpSection> = {
  "Base64 Encoder/Decoder": {
    steps: [
      "Type or paste your raw text into the Plain Text input text area.",
      "Click the 'Encode Text' to transform plain text into Base64 format.",
      "Or click 'Decode Text' to transform base64 text back into plain human-readable text.",
      "Additionally, you can drag and drop or upload any physical file (images, PDF, audio, up to 5MB) to encode the file entirely into a Base64 data URL.",
      "Copy your results with a single click or download your decoded binary files instantly."
    ],
    tips: [
      "Base64 encoding is perfect for embedding small graphic assets directly inside HTML or CSS files without making extra HTTP requests.",
      "Make sure you remove data URI prefixes (like `data:image/png;base64,`) if you are trying to decode raw binary payloads directly."
    ],
    faqs: [
      {
        question: "Is my uploaded file sent to any server?",
        answer: "Absolutely not. All encoding, decoding, and file conversions occur purely client-side inside your own browser using standard Web APIs. No data is ever transmitted, ensuring 100% absolute privacy."
      },
      {
        question: "Can I decode files back to their original visual formats?",
        answer: "Yes, our decoder handles Base64 strings representing files, recognizing major file categories and allowing you to download the precise rebuilt binary format directly."
      },
      {
        question: "What is the file size limit?",
        answer: "We recommend files under 5MB to optimize browser performance, as large files might consume substantial system memory during Base64 string serialization."
      }
    ]
  },
  "String Case Converter": {
    steps: [
      "Enter or paste the paragraphs you want to modify in the input text area.",
      "Click any of the various Case Convert buttons (`UPPERCASE`, `lowercase`, `Title Case`, etc.) to instantly rewrite the entire string in real-time.",
      "Review the word counts, line counts, and character statistics to verify paragraph lengths.",
      "Click the copy icon to instantly send the newly converted text straight to your clipboard."
    ],
    tips: [
      "Use 'Sentence case' to quickly format paragraphs copied from unformatted transcriptions into readable articles.",
      "Title Case uses standard English capitalization rules for headers, keeping prepositions and determiners correctly styled."
    ],
    faqs: [
      {
        question: "Does it support non-English letters?",
        answer: "Yes, our converter is built using modern Javascript Unicode converters, ensuring standard international alphabets and accented characters style into casing structures normally."
      },
      {
        question: "Does it preserve spaces and paragraph structure?",
        answer: "Yes, all line indexes, paragraph spacing, and indentations are preserved perfectly when formatting the string."
      }
    ]
  },
  "Color Wheel & Contrast Checker": {
    steps: [
      "Click on the custom interactive color wheel or block to select your base color.",
      "Use the custom slider controls to adjust opacity transparency, brightness, saturations, and contrast parameters.",
      "Directly enter values in Hex, RGB, or HSL fields to load existing specs.",
      "Choose from the generated matching palettes (Analogous, Monochromatic, Triadic, Tetradic) to build beautiful interfaces.",
      "Click copy to pull any individual values immediately into your code buffer."
    ],
    tips: [
      "Use the built-in system Eye Dropper tool (if your browser supports it) by clicking the dropper icon to sample any shade from anywhere on your display interface.",
      "Review the color palette generator rules underneath to construct high-contrast themes that meet universal WCAG contrast criteria."
    ],
    faqs: [
      {
        question: "What formats are supported?",
        answer: "We support Hexadecimal strings (`#000000`), alpha colors (`#000000ff`), traditional CSS RGBA blocks (`rgba(0,0,0,1)`), and standardized CSS HSLA definitions (`hsla(0,0%,0%,1)`)."
      },
      {
        question: "Can I generate randomized color combinations?",
        answer: "Yes! Click the 'Randomize Color' button in the interface to build high-contrast random combinations curated directly by our color-theory logic."
      }
    ]
  },
  "Image Compressor": {
    steps: [
      "Drag and drop any JPEG, PNG, or WebP graphic file directly onto the upload surface area.",
      "Use the range slider tracking controls to specify your desired output visual quality percent.",
      "Observe the dynamic calculations outputting original file size vs. estimated compressed byte size.",
      "Click on the 'Download Compressed Image' button to save the minimized graphic element instantly."
    ],
    tips: [
      "For standard digital websites, a quality percentage of 75% to 85% delivers massive storage savings up to 80% without any visible degradation on modern displays.",
      "PNG files can also be compressed to reduce layout rendering overhead and page loads cleanly."
    ],
    faqs: [
      {
        question: "Does this compressor support bulk files?",
        answer: "Currently, our tool optimization lets you render and preview single image configurations dynamically with immediate side-by-side compression previews."
      },
      {
        question: "Is there any quality loss?",
        answer: "JPEG and WebP use lossy compression algorithms. By choosing a quality above 70%, the loss is virtually imperceptible to the human eye while still reducing file size significantly."
      }
    ]
  },
  "Image to PDF": {
    steps: [
      "Upload one or more photos (JPG, JPEG, PNG, WebP) using the upload area.",
      "Drag and drop the uploaded thumbnails to rearrange, reorder, or organize page layout structures safely.",
      "Adjust layout parameters like PDF orientation (Portrait vs. Landscape) and specify your borders margins (No Margin, Small, Large).",
      "Click 'Generate PDF file' and download the compiled outcome cleanly."
    ],
    tips: [
      "Rearrange your pictures before building to compile beautiful, consecutive booklet outputs.",
      "Make sure to choose 'Landscape' if you are constructing slides, presentations, or horizontal photo compilations."
    ],
    faqs: [
      {
        question: "How many images can I merge into a PDF?",
        answer: "There are no hard limits to document sizing. Keep in mind that uploading dozens of heavy high-res images might cause short processing delays during PDF layout compilation."
      },
      {
        question: "Is my original image dimension preserved?",
        answer: "Yes, our PDF compiler automatically matches page aspect ratios, fitting images within specified margins to maintain visual precision."
      }
    ]
  },
  "JSON Formatter & Validator": {
    steps: [
      "Type, paste, or upload raw minified/messy JSON text into the main editor panel.",
      "Choose your preferred layout indent space preferences (2 spaces, 4 spaces, or tab index).",
      "Click the 'Format and Beautify' button to align fields beautifully with elegant indents.",
      "Click 'Minify' if you want to compress JSON structures onto a singular compact lines representation for code APIs.",
      "Check the real-time syntax validator output reporting blocks of error fields if variables are nested incorrectly."
    ],
    tips: [
      "The real-time parsed visualizer allows you to expand and collapse sub-trees of code logic, perfect for reading massive data feeds.",
      "Click the clear button to easily reset workspace files and restart styling structures."
    ],
    faqs: [
      {
        question: "What causes validation to show errors?",
        answer: "JSON requires strict adherence to syntax rules: double quotes for all keys (not single quotes), no trailing commas on the last items of objects/arrays, and properly matched curly brackets."
      },
      {
        question: "Does it support massive datasets?",
        answer: "Yes! Our high-performance editor manages large arrays without freezing, thanks to browser thread optimization."
      }
    ]
  },
  "Password Generator": {
    steps: [
      "Pick your desired character length using the simple slider range from 8 to 64 character sizes.",
      "Specify custom criteria parameters (include Uppercase, Lowercase, Numbers, or Special symbols).",
      "Click the 'Generate Safe Codes' key to compute an unpredictable cryptographic string setup.",
      "Check the security complexity bar showing absolute estimated entropy ranks.",
      "Copy your formatted code instantly with our single click button."
    ],
    tips: [
      "The longer the code length, the higher the mathematical complexity. Passwords of 16 characters or more with mixed components are standard for server authentications.",
      "Keep Special Symbols enabled to defend against most dictionary-based database intrusions."
    ],
    faqs: [
      {
        question: "How are password characters randomized?",
        answer: "We use standard cryptographically secure browser-based randomness vectors (`crypto.getRandomValues()`) rather than standard math tools, guaranteeing absolute zero patterns."
      },
      {
        question: "Are your generated codes kept on server trackers?",
        answer: "No. The code is created inside your browser thread buffer. Once you close the tab, all memory is destroyed cleanly, guaranteeing maximum safety."
      }
    ]
  },
  "PDF Merger": {
    steps: [
      "Select 2 or more PDF files from your machine and place them into our clean panel.",
      "Use drag-and-drop handles on listed documents to re-prioritize target page margins.",
      "Click 'Merge PDFs' to render your documents together.",
      "Confirm rendering in the dialog and download your finalized collective document."
    ],
    tips: [
      "Double-check your file arrangement to verify pages are in chronological order before merging.",
      "Delete individual rows inside the merger queue with a quick click of the trash icon."
    ],
    faqs: [
      {
        question: "Can I combine secure password-protected documents?",
        answer: "Encrypted or locked PDFs must first be unlocked using your original decrypting tools before you can upload and merge them in our script."
      },
      {
        question: "Does merging compress document qualities?",
        answer: "No, our compiler handles elements directly at the file buffer level, meaning image quality and text vectors remain identical."
      }
    ]
  },
  "QR Code Generator": {
    steps: [
      "Enter any URL web address, plain text, or email contacts into the 'Content' input field.",
      "Style your QR code using the custom interactive color palette picker fields (foreground background colors).",
      "Select an Error Correction Level (Low, Medium, Quartile, High) depending on your design preferences.",
      "Click on 'Generate' and check out the interactive preview mockup directly on page.",
      "Download your layout in ultra-crisp SVG files or standard PNG formats."
    ],
    tips: [
      "Select high-contrast color settings (e.g. dark blue on white) to ensure scanners can parse the information easily under different lighting conditions.",
      "Choose correction level 'High' to allow logo graphics overlay while keeping files easily scan-readable."
    ],
    faqs: [
      {
        question: "What are Error Correction Levels?",
        answer: "Error Correction levels allow QR code graphics to be partially damaged/covered while still remaining scanner readable. High levels include redundant data blocks, meaning up to 30% could be blocked or styled without scanning failure."
      },
      {
        question: "Do our QR codes expire?",
        answer: "No, our generated elements are static. They directly embed the absolute input string, meaning they persist permanently and never expire."
      }
    ]
  },
  "Word & Text Analyser": {
    steps: [
      "Directly type, compose, or copy-paste text inside the interactive input box.",
      "Watch the statistics update in real-time as you write.",
      "Analyze characters, word indexes, sentence counts, and paragraph lengths.",
      "Evaluate total read-time counts and check the density maps displaying your most frequent words."
    ],
    tips: [
      "The read-time predictor helps you evaluate if your email, post, or article meets audience attention spans.",
      "Our analyzer instantly strips common structural elements (stop words) when building the density map so you can see keyword frequencies clearly."
    ],
    faqs: [
      {
        question: "How is reading speed estimated?",
        answer: "Estimated reading time is calculated using the standard global metric of 200 words-per-minute (WPM) for adult audiences."
      },
      {
        question: "Does formatting symbols skew counts?",
        answer: "No, our statistical script cleans punctuations, extra spaces, and trailing symbols to provide accurate character counts."
      }
    ]
  }
};
