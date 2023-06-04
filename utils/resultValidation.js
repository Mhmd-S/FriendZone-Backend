// Results is an JSON with the following structure:
// {"Bahasa Melayu" : "A+", "Sejarah":"C"} 
const validateSPM = (results) => {
    if (results.length < 10 || results.length > 12) throw new Error("SPM results must be between 10 to 12 subjects");

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

export { validateSPM };