// *Just to be sure system is works - delete before coding

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('test-button');
  if (btn) {
    btn.addEventListener('click', () => {
      alert('Artist button clicked!');
    });
  }
});
