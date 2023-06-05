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

const validateOlevel = (results) => {
    results = JSON.parse(results);

    const subjects = [
        
    ]

}

export { validateSPM, validateSTPM };