// Results is an JSON with the following structure:
// {"Bahasa Melayu" : "A+", "Sejarah":"C"} 

const validateSPM = (results) => {

    results = JSON.parse(results);

    if (results.keys().length < 10 || results.keys().length > 12) throw new Error("SPM results must be between 10 to 12 subjects");

    const requiredSubjects = [
    "Bahasa Melayu", 
    "Bahasa Inggeris", 
    "Matematik", 
    "Sejarah", 
    "Pendidikan Islam", 
    "Pendidikan Moral", 
    "Sains", "Geografi", 
    "Kemahiran Hidup", 
    "Pendidikan Seni"
    ];
    const electiveSubjects = [
    'Pengajian Kejuruteraan Awam',
    'Lukisan Kejuruteraan',
    'Matematik Tambahan',
    'Kimia',
    'Fizik',
    'Pengajian Kejuruteraan Elektrik',
    'Pengajian Keusahawanan',
    'Prinsip Akaun',
    'Biologi',
    'Sains Pertanian'
    ];

    const requiredGrades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "E", "G"];

    // Check if all required subjects are present
    requiredSubjects.forEach(subject =>  {
        if (!results.hasOwnProperty(subject)) {
            throw new Error(`SPM results must contain ${subject}`);
        }
    });

    // Check if all grades are valid
    Object.values(results).forEach(grade => {
        if(!requiredGrades.includes(grade)) {
            throw new Error(`${grade} is not a valid SPM grade`);
        }
    });

    // Check if there are any elective subjects
    const electiveSubjectsPresent = electiveSubjects.map(subject => results.hasOwnProperty(subject));
    electiveSubjectsPresent && electiveSubjects.forEach(subject => {
        if(!results.hasOwnProperty(subject)) {
            throw new Error('Invalid elective subject');
        }
    });

    // Check if all elective grades are valid
    electiveSubjectsPresent && electiveSubjects.forEach(subject => {
        if(!requiredGrades.includes(results[subject])) {
            throw new Error(`${results[subject]} is not a valid SPM grade`);
        }
    });
}

const validateSTPM = (results) => {
    results = JSON.parse(results);
    if (results.keys().length < 4 || results.keys().length > 5) throw new Error("STPM results must be between 3 to 5 subjects");

    const subjects = ["Pengajian Am", "Bahasa Melayu", "Bahasa Cina", "Bahasa Tamil", "Bahasa Arab", "Literature in English", "Kesusasteraan Melayu Komunikatif", "Syariah", "Usuluddin", "Tahfiz Al-Quran", "Sejarah", "Geografi", "Ekonomi", "Pengajian Perniagaan", "Perakaunan", "Mathematics (Management)", "Mathematics (Technical)", "Information and Communications Technology", "Physics", "Chemistry", "Biology", "Sains Sukan", "Seni Visual"]

    const grades = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"];

    // Check if all subjects are valid
    Object.keys(results).forEach(subject => {
        if(!subjects.includes(subject)) {
            throw new Error(`${subject} is not a valid STPM subject`);
        }
    });

    // Check if all grades are valid
    Object.values(results).forEach(grade => {
        if(!grades.includes(grade)) {
            throw new Error(`${grade} is not a valid STPM grade`);
        }
    });
}

const validateIGCSE = (results) => {
    results = JSON.parse(results);
    if (Object.keys(results).length < 5 || Object.keys(results).length > 14) throw new Error("IGCSE results must be between 5 to 14 subjects");

    const subjects = ["Accounting - 0452", "Accounting (9-1) - 0985", "Afrikaans - Second Language - 0548", "Agriculture - 0600", "Arabic - First Language - 0508", "Arabic - First Language (9-1) - 7184", "Arabic - Foreign Language - 0544", "Art & Design - 0400", "Art & Design (9-1) 0989", "Bahasa Indonesia - 0538", "Biology - 0610", "Biology (9-1) - 0970", "Business Studies - 0450", "Business Studies (9-1) - 0986", "Chemistry - 0620", "Chemistry (9-1) - 0971", "Chinese - First Language - 0509", "Chinese - Second Language - 0523", "Chinese (Mandarin) - Foreign Language (0547)", "Computer Science - 0478", "Computer Science (9-1) - 0984", "Design & Technology - 0445", "Design & Technology (9-1) - 0979", "Drama - 0411", "Drama (9-1) - 0994", "Economics - 0455", "Economics (9-1) - 0987", "English - First Language - 0500", "English - First Language (9-1) - 0990", "English - First Language (US) - 0524", "English – Literature in English – 0475", "English – Literature in English (9-1) – 0992", "English (as an Additional Language) - 0472", "English (as an Additional Language) (9-1) - 0772", "English (Core) as a Second Language (Egypt) - 0465", "English as a Second Language (Count-in speaking) (0511)", "English as a Second Language (Count-in Speaking) (9-1) (0991)", "English as a Second Language (Speaking endorsement) - 0510", "English as a Second Language (Speaking Endorsement) (9-1) - 0993", "Enterprise - 0454", "Environmental Management - 0680", "Food & Nutrition - 0648", "French - First Language - 0501", "French - Foreign Language - 0520", "French (9-1) - 7156", "Geography - 0460", "Geography (9-1) - 0976", "German - First Language - 0505", "German - Foreign Language - 0525", "German (9-1) - 7159", "Global Perspectives - 0457", "Hindi as a Second Language - 0549", "History - 0470", "History (9-1) - 0977", "Information and Communication Technology - 0417", "Information and Communication Technology (9-1) - 0983", "IsiZulu as a Second Language - 0531", "Islamiyat - 0493", "Italian - Foreign Language - 0535", "Italian (9-1) - 7164", "Latin - 0480", "Malay - First Language - 0696", "Malay - Foreign Language - 0546", "Marine Science - 0697", "Mathematics - 0580", "Mathematics - Additional - 0606", "Mathematics - International - 0607", "Mathematics (9-1) - 0980", "Music - 0410", "Music (9-1) - 0978", "Pakistan Studies - 0448", "Physical Education - 0413", "Physical Education (9-1) - 0995", "Physical Science - 0652", "Physics - 0625", "Physics (9-1) - 0972", "Portuguese - First Language - 0504", "Religious Studies - 0490", "Sanskrit - 0499", "Science - Combined - 0653", "Sciences - Co-ordinated (9-1) - 0973", "Sciences - Co-ordinated (Double) - 0654", "Setswana - First Language - 0698", "Sociology - 0495", "Spanish - First Language - 0502", "Spanish - Foreign Language - 0530", "Spanish - Literature - 0488", "Spanish - Literature in Spanish - 0474", "Spanish (9-1) - 7160", "Swahili - 0262", "Thai - First Language - 0518", "Travel & Tourism - 0471", "Turkish - First Language - 0513", "Urdu as a Second Language - 0539", "Vietnamese - First Language - 0695", "World Literature - 0408"]

    const grades = ["A*" ,"A", "B", "C", "D", "E", "F", "G", "U"];

    // Check if all subjects are valid
    Object.keys(results).forEach(subject => {
        if(!subjects.includes(subject)) {
            throw new Error(`${subject} is not a valid IGCSE subject`);
        }
    });

    // Check if all grades are valid
    Object.values(results).forEach(grade => {
        if(!grades.includes(grade)) {
            throw new Error(`${grade} is not a valid IGCSE grade`);
        }
    });
}

const validateAS_Level = (results) => {
    results = JSON.parse(results);

    if (Object.keys(results).length < 1 || Object.keys(results).length > 6) throw new Error("AS Level results must be between 1 to 6 subjects");

    const subjects = ["Accounting - 9706", "Afrikaans - Language  - 8679", "Arabic - 9680", "Arabic - Language  - 8680", "Art & Design - 9479", "Biblical Studies - 9484", "Biology - 9700", "Business - 9609", "Chemistry - 9701", "Chinese - Language & Literature  - 9868", "Chinese - Language  - 8681", "Chinese  - 9715", "Chinese Language  - 8238", "Classical Studies - 9274", "Computer Science - 9618", "Design & Technology - 9705", "Design & Textiles - 9631", "Digital Media & Design - 9481", "Drama - 9482", "Economics - 9708", "English - Language and Literature  - 8695", "English - Literature - 9695", "English General Paper  - 8021", "English Language - 9093", "Environmental Management - 8291", "French - Language  - 8682", "French  - 9716", "French Language & Literature - 9898", "French Language  - 8028", "Geography - 9696", "German - Language  - 8027", "German - Language  - 8683", "German  - 9717", "German Language & Literature  - 9897", "Global Perspectives & Research - 9239", "Hindi - Language  - 8687", "Hindi - Literature  - 8675", "Hindi  - 9687", "Hinduism - 9487", "History - 9489", "Information Technology - 9626", "Islamic Studies - 9488", "Japanese Language  - 8281", "Law - 9084", "Marine Science - 9693", "Mathematics - 9709", "Mathematics - Further - 9231", "Media Studies - 9607", "Music - 9483", "Physical Education - 9396", "Physics - 9702", "Portuguese - Language  - 8684", "Portuguese  - 9718", "Psychology - 9990", "Sociology - 9699", "Spanish - First Language  - 8665", "Spanish - Language & Literature  - 9844", "Spanish - Language  - 8685", "Spanish - Literature  - 8673", "Spanish  - 9719", "Spanish Language  - 8022", "Sport & Physical Education - 8386", "Tamil - Language - 8689", "Tamil - Language - 9689", "Thinking Skills - 9694", "Travel & Tourism - 9395", "Urdu - Language  - 8686", "Urdu - Pakistan only  - 9686", "Urdu  - 9676"]

    const grades = ["A", "B", "C", "D", "E", "U"];

    // Check if all subjects are valid
    Object.keys(results).forEach(subject => {
        if(!subjects.includes(subject)) {
            throw new Error(`${subject} is not a valid AS Level subject`);
        }
    });

    // Check if all grades are valid
    Object.values(results).forEach(grade => {
        if(!grades.includes(grade)) {
            throw new Error(`${grade} is not a valid AS Level grade`);
        }
    });
}

const validateA_Level = (results) => {
    results = JSON.parse(results);

    if (Object.keys(results).length < 1 || Object.keys(results).length > 6) throw new Error("A Level results must be between 1 to 6 subjects");

    const subjects = ["Accounting - 9706", "Arabic - 9680", "Art & Design - 9479", "Biblical Studies - 9484", "Biology - 9700", "Business - 9609", "Chemistry - 9701", "Chinese - Language & Literature  - 9868", "Chinese  - 9715", "Classical Studies - 9274", "Computer Science - 9618", "Design & Technology - 9705", "Design & Textiles - 9631", "Digital Media & Design - 9481", "Drama - 9482", "Economics - 9708", "English - Literature - 9695", "English Language - 9093", "French  - 9716", "French Language & Literature - 9898", "Geography - 9696", "German  - 9717", "German Language & Literature  - 9897", "Global Perspectives & Research - 9239", "Hindi  - 9687", "Hinduism - 9487", "History - 9489", "Information Technology - 9626", "Islamic Studies - 9488", "Law - 9084", "Marine Science - 9693", "Mathematics - 9709", "Mathematics - Further - 9231", "Media Studies - 9607", "Music - 9483", "Physical Education - 9396", "Physics - 9702", "Portuguese  - 9718", "Psychology - 9990", "Sociology - 9699", "Spanish - Language & Literature  - 9844", "Spanish  - 9719", "Tamil - Language - 9689", "Thinking Skills - 9694", "Travel & Tourism - 9395", "Urdu - Pakistan only  - 9686", "Urdu  - 9676"]

    const grades = ["A*", "A", "B", "C", "D", "E", "U"];

    // Check if all subjects are valid
    Object.keys(results).forEach(subject => {
        if(!subjects.includes(subject)) {
            throw new Error(`${subject} is not a valid A Level subject`);
        }
    });

    // Check if all grades are valid
    Object.values(results).forEach(grade => {
        if(!grades.includes(grade)) {
            throw new Error(`${grade} is not a valid A Level grade`);
        }
    });
}

const validateUEC = (results) => {
    results = JSON.parse(results);

    if (Objects.keys(results).length < 7 || Objects.keys(results).length > 10) throw new Error("UEC results must be between 7 to 10 subjects");

    const subjects = ["Accounting", "Advanced Mathematics", "Advanced Mathematics I", "Advanced Mathematics II", "Art", "Bahasa Malaysia", "Basic Circuit Theory", "Biology", "Bookkeeping & Accounts", "Business Studies", "Chemistry", "Chinese Language", "Computing & Information Technology", "Digital Logic", "English", "Economics", "Fundamentals of Electrical Engineering", "Geography", "History", "Mathematics", "Physics", "Principles of Electronics"];

    const gradess = ["A1", "A2", "B3", "B4", "B5", "B6", "C7", "C8", "F9"];

    // Check if all subjects are valid
    Object.keys(results).forEach(subject => {
        if(!subjects.includes(subject)) {
            throw new Error(`${subject} is not a valid UEC subject`);
        }
    });

    // Check if all grades are valid
    Object.values(results).forEach(grade => {
        if(!grades.includes(grade)) {
            throw new Error(`${grade} is not a valid UEC grade`);
        }
    });
}

const validateIB = (results) => {
    results = JSON.parse(results);

    if (Objects.keys(results).length < 6 || Objects.keys(results).length > 7) throw new Error("IB results must be between 6 to 7 subjects");

    const subjectsGroup = [
        "Group 1 - Studies in Language and Literature (English)",
        "Group 1 - Studies in Language and Literature (Malay)",
        "Group 2 - Language Acquisition (Malay)",
        "Group 2 - Language Acquisition (Mandarin)",
        "Group 2 - Language Acquisition (French)",
        "Group 2 - Language Acquisition (Spanish)",
        "Group 3 - Individuals and Societies (Geography)",
        "Group 3 - Individuals and Societies (History)",
        "Group 3 - Individuals and Societies (Economics)",
        "Group 3 - Individuals and Societies (Business and Management)",
        "Group 3 - Individuals and Societies (Psychology)",
        "Group 4 - Sciences (Biology, Chemistry, Physics, Environmental Systems & Societies)",
        "Group 4 - Sciences (Chemistry)",
        "Group 4 - Sciences (Physics)",
        "Group 4 - Sciences (Environmental Systems & Societies)",
        "Group 5 - Mathematics (Mathematical Studies)",
        "Group 5 - Mathematics (Mathematics)",
        "Group 6 - The Arts (Visual Arts)",
        "Group 6 - The Arts (Theatre Arts)",
        "Group 6 - The Arts (Music and Film)",
    ];

    const subjectsCore = [
        "Core - Extended Essay",
        "Core - Theory of Knowledge"
    ];

    const gradesGroup = ["7", "6", "5", "4", "3", "2", "1"];
    const gradesCore = ["3", "2", "1"];

    

}


export { validateSPM, validateSTPM, validateIGCSE, validateAS_Level, validateA_Level, validateUEC };