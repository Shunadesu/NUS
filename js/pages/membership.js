   // Check if user is logged in
   const userEmail = localStorage.getItem('loggedInUserEmail');
   const userInfoSection = document.getElementById('userInfoSection');
   const userEmailElement = document.getElementById('userEmail');
   const regularMemberFooter = document.getElementById('regularMemberFooter');
   const userPointsElement = document.getElementById('userPoints');
   const pointsProgressElement = document.getElementById('pointsProgress');
   const nextLevelPointsElement = document.getElementById('nextLevelPoints');

   // Get user points from localStorage or set default
   const userPoints = parseInt(localStorage.getItem('userPoints')) || 0;

   if (userEmail) {
       // Show user info section
       userInfoSection.style.display = 'block';
       userEmailElement.textContent = userEmail;
       
       // Update points display
       userPointsElement.textContent = userPoints;

       // Calculate next level and progress
       let nextLevel = 500;
       if (userPoints >= 2000) {
           nextLevel = 'Max Level';
       } else if (userPoints >= 1000) {
           nextLevel = 2000;
       } else if (userPoints >= 500) {
           nextLevel = 1000;
       }
       nextLevelPointsElement.textContent = nextLevel;

       // Calculate progress percentage
       let progressPercentage = 0;
       if (userPoints < 500) {
           progressPercentage = (userPoints / 500) * 100;
       } else if (userPoints < 1000) {
           progressPercentage = ((userPoints - 500) / 500) * 100;
       } else if (userPoints < 2000) {
           progressPercentage = ((userPoints - 1000) / 1000) * 100;
       } else {
           progressPercentage = 100;
       }
       pointsProgressElement.style.width = `${progressPercentage}%`;
       
       // Hide the "Start Earning Points" button
       regularMemberFooter.style.display = 'none';
   } else {
       // If not logged in, redirect to login page
       window.location.href = '/pages/login.html';
   }

// Update progress marker position based on progress percentage
const progressBar = document.querySelector('.progress-bar');
const currentPointsMarker = document.getElementById('currentPointsMarker');

if (progressBar && currentPointsMarker) {
   // Get the width of the progress bar
   const progressBarWidth = progressBar.offsetWidth;
   
   // Calculate marker position based on progress percentage
   const markerPosition = (progressPercentage / 100) * progressBarWidth;
   
   // Position the marker
   currentPointsMarker.style.left = `${markerPosition - 5}px`; // Subtract half marker width (10px/2) for centering
   
   // Only show marker if there are points
   currentPointsMarker.style.display = userPoints > 0 ? 'block' : 'none';
}