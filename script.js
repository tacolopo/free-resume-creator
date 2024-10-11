document.getElementById('resumeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    generateResume();
});

document.getElementById('printResume').addEventListener('click', function() {
    window.print();
});

function generateResume() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const education = document.getElementById('education').value;
    const skills = document.getElementById('skills').value.split(',').map(skill => skill.trim());
    const experience = document.getElementById('experience').value;
    const accomplishments = document.getElementById('accomplishments').value;

    const resumeHTML = `
        <h1>${name}</h1>
        <p>Phone: ${phone} | Email: ${email}</p>
        
        <h2>Education</h2>
        <p>${education}</p>
        
        <h2>Skills</h2>
        <ul>
            ${skills.map(skill => `<li>${skill}</li>`).join('')}
        </ul>
        
        <h2>Work Experience</h2>
        <p>${experience}</p>
        
        <h2>Accomplishments</h2>
        <p>${accomplishments}</p>
    `;

    document.getElementById('resumeContent').innerHTML = resumeHTML;
    document.getElementById('resumeOutput').classList.remove('hidden');
}
